import { useState, useEffect } from 'react';
import {
  getCurrentMealPlan,
  getRecipeByIds,
} from '@/lib/providers/database-access';
import { useUserStore } from '@/app/store/userStore';
import {
  Recipe,
  MealPlan,
  MealPlanDay,
  WeekDays,
  MealType,
} from '@/model/models';

// Interface to connect a meal with its recipe
export interface MealWithRecipe {
  mealType: MealType;
  day: WeekDays;
  servings: number;
  recipe: Recipe;
}

interface UseMealPlanResult {
  mealPlan: MealPlan | null;
  recipes: Recipe[] | null;
  mealsWithRecipes: MealWithRecipe[] | null;
  loading: boolean;
  error: string | null;
}

export function useMealPlan(): UseMealPlanResult {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [mealsWithRecipes, setMealsWithRecipes] = useState<
    MealWithRecipe[] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, properties } = useUserStore();

  useEffect(() => {
    const fetchMealPlanAndRecipes = async () => {
      if (!user?.uid) return;

      setLoading(true);
      setError(null);

      let mealTypeFilter: MealType[] = [];
      if (properties.manageDinner)
        mealTypeFilter = [...mealTypeFilter, MealType.Dinner];
      if (properties.manageLunch)
        mealTypeFilter = [...mealTypeFilter, MealType.Lunch];

      try {
        // Fetch the user's meal plan
        const planning = await getCurrentMealPlan(user.uid);

        if (planning?.mealPlan) {
          setMealPlan(planning.mealPlan);

          // Extract recipe IDs from the meal plan (and remove undefined IDs)
          const recipeIds = Object.values(planning.mealPlan)
            .flatMap((day) =>
              mealTypeFilter.map((mealType) => day[mealType]?.id),
            )
            .filter((id): id is string => !!id);

          // Fetch recipes by IDs
          const fetchedRecipes = await getRecipeByIds(recipeIds);
          setRecipes(fetchedRecipes);

          // Currently there is no exception or similar when a receipeId isn't found
          const mealsWithRecipes: MealWithRecipe[] = Object.entries(
            planning.mealPlan,
          ).flatMap(([day, mealDay]) =>
            [MealType.Lunch, MealType.Dinner].flatMap((mealType) => {
              const meal = mealDay[mealType as keyof MealPlanDay];
              const recipe = fetchedRecipes.find((r) => r.id === meal?.id);
              if (meal && recipe) {
                return {
                  mealType: mealType,
                  day: day as WeekDays,
                  servings: meal.servings,
                  recipe,
                };
              }
              return [];
            }),
          );

          setMealsWithRecipes(mealsWithRecipes);
        } else {
          setMealPlan(null);
          setRecipes([]);
          setMealsWithRecipes([]);
        }
      } catch (err) {
        console.error('Error fetching meal plan or recipes:', err);
        setError('Failed to fetch meal plan or recipes.');
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlanAndRecipes();
  }, [user, properties.manageDinner, properties.manageLunch]);

  return { mealPlan, recipes, mealsWithRecipes, loading, error };
}
