'use client';

import { AddRecipeForm } from '@/app/components/add-recipe-form';
import { RecipeOverview } from '@/app/routes/recipe/recipe-overview';
import { RecipeFilterValues, useRecipes } from '@/app/hooks/useRecipes';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { FoodCategories } from '@/model/models';
import { useSingleRecipe } from '@/app/hooks/useSingleRecipe';

export default function RecipeManagementPage() {
  const [isAdding, setIsAdding] = useState(false);
  const {
    currentRecipe,
    updateCurrentRecipe,
    analyzeIngredients,
    saveRecipe,
    editRecipe,
  } = useSingleRecipe();
  const {
    recipes,
    filter,
    setFilter,
    setSearchTerm,
    setSelectedCategories,
    fetchRecipes,
  } = useRecipes();

  const handleSaveRecipe = async (image?: File, pdf?: File) => {
    await saveRecipe(image, pdf);
    // udpate receipe list
    await fetchRecipes();
    setIsAdding(false);
  };

  const handleAddNewRecipe = () => {
    editRecipe({
      name: '',
      link: '',
      servings: 1,
      analyzedIngredients: [],
      ownerId: '',
      isPrivate: false,
      categories: [],
      description: '',
    });
    setIsAdding(true);
  };

  const handleFilterChange = (filter: RecipeFilterValues) => {
    setFilter(filter);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCategorySelect = (categories: FoodCategories[]) => {
    setSelectedCategories(categories);
  };

  return (
    <>
      <h1 className='text-3xl font-bold mb-6'>Recipes</h1>
      {isAdding ? (
        <>
          <Button onClick={() => setIsAdding(false)} className='mb-4'>
            Back to Overview
          </Button>
          <AddRecipeForm
            recipe={currentRecipe}
            onUpdate={updateCurrentRecipe}
            onAnalyze={analyzeIngredients}
            onSave={handleSaveRecipe}
          />
        </>
      ) : (
        <RecipeOverview
          recipes={recipes}
          onAddNewRecipe={handleAddNewRecipe}
          onFilterChange={handleFilterChange}
          filter={filter}
          onSearch={handleSearch}
          onCategorySelect={handleCategorySelect}
        />
      )}
    </>
  );
}
