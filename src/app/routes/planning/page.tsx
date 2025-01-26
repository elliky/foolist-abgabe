'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '@/app/store/userStore';
import { useRecipes } from '@/app/hooks/useRecipes';
import { MealType, PlanningDays, PlanningDocument } from '@/model/models';
import {
  savePlanningDocument,
  createNewMealPlan as createNewMealPlanDB,
  getCurrentMealPlan,
  getPreviousMealPlan,
} from '@/lib/providers/database-access';
import { PlanningActions } from '@/app/routes/planning/planning-actions';
import { DailyMealCard } from '@/app/routes/planning/day-meal-plan';

export default function PlanningPage() {
  const createNewPlanningDocument = (): PlanningDocument => {
    return {
      mealPlan: PlanningDays.reduce(
        (acc, day) => ({ ...acc, [day]: { lunch: null, dinner: null } }),
        {},
      ),
    };
  };

  const { user, properties, updateSettings } = useUserStore();
  const { recipes } = useRecipes();
  const [planningDocument, setPlanningDocument] = useState<PlanningDocument>(
    createNewPlanningDocument(),
  );
  const [loading, setLoading] = useState(true);
  const [noPlanning, setNoPlanning] = useState(false);

  const initializeMealPlan = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const planningDoc = await getCurrentMealPlan(user.uid);

      if (planningDoc) {
        setPlanningDocument(planningDoc || {});
      } else {
        setNoPlanning(true);
      }
    } catch (error) {
      console.error('Failed to fetch the meal plan:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    initializeMealPlan();
  }, [initializeMealPlan]);

  const handleCreateNewPlanning = async () => {
    if (!user?.uid) return;

    if (planningDocument.id) {
      planningDocument.isCurrent = false;
      await savePlanningDocument(user.uid, planningDocument);
    }

    const newPlanningDocument = createNewPlanningDocument();

    if (properties.notedRecipesForNextPlanning.length > 0) {
      const shuffledRecipes = [...properties.notedRecipesForNextPlanning].sort(
        () => Math.random() - 0.5,
      );

      shuffledRecipes.forEach((recipeId, index) => {
        if (index < PlanningDays.length) {
          const recipe = recipes.find((r) => r.id === recipeId);
          if (recipe) {
            const mealType =
              Math.random() < 0.5 ? MealType.Lunch : MealType.Dinner;
            newPlanningDocument.mealPlan[PlanningDays[index]][mealType] = {
              id: recipe.id!,
              name: recipe.name,
              servings: properties.defaultServings,
            };
          }
        }
      });
    }

    setLoading(true);
    try {
      const newMealPlan = await createNewMealPlanDB(
        user.uid,
        newPlanningDocument.mealPlan,
      );
      setPlanningDocument(newMealPlan);
      setNoPlanning(false);

      // Clear the notedRecipesForNextPlanning
      await updateSettings({ notedRecipesForNextPlanning: [] });
    } catch (error) {
      console.error('Failed to create a new planning document:', error);
    } finally {
      setLoading(false);
    }
  };

  const assignMealWithoutSaving = (
    planningDocument: PlanningDocument,
    day: string,
    mealType: MealType,
    recipeId: string,
    recipeName: string,
    servings: number,
  ): PlanningDocument => {
    return {
      ...planningDocument,
      mealPlan: {
        ...planningDocument.mealPlan,
        [day]: {
          ...planningDocument.mealPlan[day],
          [mealType]: { id: recipeId, name: recipeName, servings },
        },
      },
    };
  };

  const assignAllRandomMeals = async (mealType: MealType) => {
    if (!user?.uid) return;

    let updatedPlanningDocument = { ...planningDocument };
    const availableRecipes = [...recipes]; // Copy receipes to splice for random assignment

    for (const day of PlanningDays) {
      if (availableRecipes.length == 0) break;

      const randomIndex = Math.floor(Math.random() * availableRecipes.length);
      const [randomRecipe] = availableRecipes.splice(randomIndex, 1); // Remove selected recipe from list

      updatedPlanningDocument = assignMealWithoutSaving(
        updatedPlanningDocument,
        day,
        mealType,
        randomRecipe.id!,
        randomRecipe.name,
        properties.defaultServings,
      );
    }

    // Save the updated planning document after all meals are assigned
    setPlanningDocument(updatedPlanningDocument);

    try {
      await savePlanningDocument(user.uid, updatedPlanningDocument);
    } catch (error) {
      console.error('Failed to save the meal plan:', error);
    }
  };

  const assignMeal = async (
    day: string,
    mealType: MealType,
    recipeId: string,
    recipeName: string,
    servings: number,
  ) => {
    if (!user?.uid) return;

    let updatedPlanningDocument = { ...planningDocument };

    updatedPlanningDocument = assignMealWithoutSaving(
      updatedPlanningDocument,
      day,
      mealType,
      recipeId,
      recipeName,
      servings,
    );

    setPlanningDocument(updatedPlanningDocument);

    try {
      await savePlanningDocument(user.uid, updatedPlanningDocument);
    } catch (error) {
      console.error('Failed to save the meal plan:', error);
    }
  };

  const assignRandomMeal = async (day: string, mealType: MealType) => {
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];

    if (randomRecipe) {
      await assignMeal(
        day,
        mealType,
        randomRecipe.id!,
        randomRecipe.name,
        properties.defaultServings,
      );
    }
  };

  const showPreviousMealPlan = async () => {
    if (!user?.uid) return;

    try {
      const previousPlan = await getPreviousMealPlan(user.uid);
      if (previousPlan) {
        setPlanningDocument(previousPlan);
      }
    } catch (error) {
      console.error('Failed to fetch the previous meal plan:', error);
    }
  };

  // Loading isn't used at the moment but should be in the future
  // that's why we use it here for the moment
  console.debug('loading', loading);

  return (
    <>
      <PlanningActions
        assignAllRandomMeals={assignAllRandomMeals}
        showPreviousMealPlan={showPreviousMealPlan}
        createNewMealPlan={handleCreateNewPlanning}
        planningDocumentAvailable={!noPlanning}
      />
      {!noPlanning && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {PlanningDays.map((day) => (
            <DailyMealCard
              key={day}
              day={day}
              mealPlan={planningDocument.mealPlan}
              assignMeal={assignMeal}
              assignRandomMeal={assignRandomMeal}
            />
          ))}
        </div>
      )}
    </>
  );
}
