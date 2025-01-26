import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { RecipeCard } from './recipe-card';
import { FoodCategories, Recipe } from '@/model/models';
import {
  RecipeFilterValues,
  RecipeFilterValuesArray,
} from '@/app/hooks/useRecipes';

interface RecipeOverviewProps {
  recipes: Recipe[];
  onAddNewRecipe: () => void;
  filter: RecipeFilterValues;
  onFilterChange: (filter: RecipeFilterValues) => void;
  onSearch: (term: string) => void;
  onCategorySelect: (categories: FoodCategories[]) => void;
}

export function RecipeOverview({
  recipes,
  onAddNewRecipe,
  filter,
  onFilterChange,
  onSearch,
  onCategorySelect,
}: RecipeOverviewProps) {
  const [selectedCategories, setSelectedCategories] = useState<
    FoodCategories[]
  >([]);

  const handleCategoryToggle = (category: FoodCategories) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updatedCategories);
    onCategorySelect(updatedCategories);
  };

  return (
    <div>
      <div className='flex flex-col space-y-4 mb-6'>
        <div className='flex flex-wrap sm:justify-between gap-4 sm:items-center flex-col-reverse sm:flex-row'>
          <div className='flex gap-2'>
            {RecipeFilterValuesArray.map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                onClick={() => onFilterChange(f)}
              >
                {f}
              </Button>
            ))}
          </div>
          <div>
            <Button onClick={onAddNewRecipe}>Add New Recipe</Button>
          </div>
        </div>
        <Input
          type='text'
          placeholder='Search recipes...'
          onChange={(e) => onSearch(e.target.value)}
          className='max-w-md'
        />
        <div className='flex flex-wrap gap-2'>
          {Object.values(FoodCategories).map((category) => (
            <Button
              key={category}
              variant={
                selectedCategories.includes(category) ? 'default' : 'outline'
              }
              onClick={() => handleCategoryToggle(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
