'use client';

import {
  getIngredients,
  getRecipeById,
  saveIngredient,
  saveRecipeToDatabase,
  updateIngredient,
} from '@/lib/providers/database-access';
import { Ingredient, IngredientCategory, Recipe } from '@/model/models';
import { useState, useCallback, useEffect } from 'react';
import { useUserStore } from '@/app/store/userStore';
import { toast } from '@/hooks/use-toast';

export function useSingleRecipe() {
  const { user } = useUserStore();

  const [currentRecipe, setCurrentRecipe] = useState<Recipe>({
    name: '',
    link: '',
    servings: 1,
    description: '',
    analyzedIngredients: [],
    ownerId: '',
    isPrivate: false,
    categories: [],
  });

  const [existingIngredients, setExistingIngredients] = useState<Ingredient[]>(
    [],
  );

  useEffect(() => {
    fetchExistingIngredients();
  }, []);

  const fetchExistingIngredients = async () => {
    setExistingIngredients(await getIngredients());
  };

  const uploadFile = async (file: File): Promise<string> => {
    // we don't use firebase storage in the project, but leave the code to enable it after it's not public anymore

    // const storageRef = ref(storage, `recipe_files/${file.name}`)
    // await uploadBytes(storageRef)
    // return getDownloadURL(storageRef)

    return file.name;
  };

  const saveRecipe = useCallback(
    async (image?: File, pdf?: File) => {
      if (user == null) return;

      try {
        if (image) {
          currentRecipe.imageUrl = await uploadFile(image);
        }
        if (pdf) {
          currentRecipe.pdfUrl = await uploadFile(pdf);
        }

        const savedIngredients: Ingredient[] = await Promise.all(
          currentRecipe.analyzedIngredients.map(async (ing) => {
            if (ing.ingredientId) {
              // this is quiet critical because when a user isn't happy with analysis and changes everything about the ingredient it will be changed for every recipe as well
              // because we have nothing better at the moment we keep it that way
              await updateIngredient(ing.ingredientId, ing);
              return ing;
            } else {
              // amount is saved as well, that's why we can keep it like that until changed
              return await saveIngredient(ing);
            }
          }),
        );

        currentRecipe.analyzedIngredients = savedIngredients;

        await saveRecipeToDatabase(currentRecipe, user.uid);
      } catch (error) {
        console.log('Error on saving receipe', error);
        toast({
          variant: 'destructive',
          title: 'Error on saving',
          description: 'Was not able to save the receipe!',
        });
      }
    },
    [currentRecipe, user],
  );

  const editRecipe = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
  };

  const createIngredientAndEnrichIfAlreadyExisting = (
    name: string,
    amount: string,
    existingIngredients: Ingredient[],
  ): Ingredient => {
    const existingIngredient = existingIngredients.find(
      (ing) =>
        ing.name.toLowerCase() === name.toLowerCase() ||
        (ing.aliases &&
          ing.aliases.some(
            (alias) => alias.toLowerCase() === name.toLowerCase(),
          )),
    );

    return {
      id: Math.random().toString(36).substring(2, 9),
      ingredientId: existingIngredient?.ingredientId,
      amount: amount,
      name: name,
      category: existingIngredient?.category || IngredientCategory.Others,
      aliases: existingIngredient?.aliases || [],
    };
  };

  const analyzeIngredients = useCallback(
    (ingredienList: string) => {
      const ingredients = ingredienList
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((line) => {
          const [amount, ...nameParts] = line.split(' ');
          const name = nameParts.join(' ').trim();
          return createIngredientAndEnrichIfAlreadyExisting(
            name,
            amount,
            existingIngredients,
          );
        });

      setCurrentRecipe((prev) => ({
        ...prev,
        analyzedIngredients: ingredients,
      }));
    },
    [existingIngredients],
  );

  const updateCurrentRecipe = useCallback(
    (
      field: keyof Recipe,
      value: string | number | boolean | string[] | Ingredient[],
    ) => {
      setCurrentRecipe((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const fetchRecipeById = useCallback(
    async (id: string): Promise<Recipe | null> => {
      try {
        const receipe = await getRecipeById(id);
        if (receipe != null) {
          setCurrentRecipe(receipe);
        }
        return receipe;
      } catch (error) {
        console.error('Error on fetching recipe:', error);
        toast({
          variant: 'destructive',
          title: 'Error on fetching receipe',
          description: 'Was not able to fetch the receipe!',
        });
        return null;
      }
    },
    [],
  );

  return {
    currentRecipe,
    saveRecipe,
    editRecipe,
    analyzeIngredients,
    updateCurrentRecipe,
    fetchRecipeById,
  };
}
