'use client';

import { getRecipes } from '@/lib/providers/database-access';
import { FoodCategories, Recipe } from '@/model/models';
import { useState, useCallback, useEffect } from 'react';
import { useUserStore } from '@/app/store/userStore';

export type RecipeFilterValues = 'All' | 'Own' | 'Favorites';

export const RecipeFilterValuesArray: RecipeFilterValues[] = [
  'All',
  'Own',
  'Favorites',
];

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const [filter, setFilter] = useState<RecipeFilterValues>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<
    FoodCategories[]
  >([]);
  const { properties } = useUserStore();

  const fetchRecipes = useCallback(async () => {
    let recipesList = await getRecipes(filter);

    if (filter === 'Favorites') {
      recipesList = recipesList.filter((recipe) =>
        properties.favoriteRecipes.includes(recipe.id!),
      );
    }

    // Filter recipes based on search term and selected categories
    recipesList = recipesList.filter((recipe) => {
      const matchesSearch =
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.analyzedIngredients.some((ing) =>
          ing.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesCategories =
        selectedCategories.length === 0 ||
        selectedCategories.every((cat) => recipe.categories.includes(cat));

      return matchesSearch && matchesCategories;
    });

    setRecipes(recipesList);
  }, [filter, searchTerm, selectedCategories, properties.favoriteRecipes]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return {
    recipes,
    filter,
    setFilter,
    setSearchTerm,
    setSelectedCategories,
    fetchRecipes,
  };
}
