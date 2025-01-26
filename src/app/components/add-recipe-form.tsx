'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ChangeEvent, useState, useEffect } from 'react';
import { IngredientAnalysis } from './ingredient-analysis';
import { FoodCategories, Ingredient, Recipe } from '@/model/models';

interface AddRecipeFormProps {
  recipe: Recipe;
  onUpdate: (
    field: keyof Recipe,
    value: string | number | boolean | string[] | Ingredient[],
  ) => void;
  onAnalyze: (ingredientList: string) => void;
  onSave: (image?: File, pdf?: File) => void;
}

export function AddRecipeForm({
  recipe,
  onUpdate,
  onAnalyze,
  onSave,
}: AddRecipeFormProps) {
  const [image, setImage] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [ingredientList, setIngredientList] = useState<string>('');

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void,
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    setIsAnalyzed(recipe.analyzedIngredients.length > 0);
  }, [recipe.analyzedIngredients]);

  return (
    <form className='space-y-4'>
      <div>
        <Label htmlFor='name'>Recipe Name</Label>
        <Input
          id='name'
          value={recipe.name}
          onChange={(e) => onUpdate('name', e.target.value)}
          placeholder='Enter recipe name'
        />
      </div>
      <div>
        <Label htmlFor='link'>Recipe Link (optional)</Label>
        <Input
          id='link'
          value={recipe.link}
          onChange={(e) => onUpdate('link', e.target.value)}
          placeholder='https://example.com/recipe'
        />
      </div>
      <div>
        <Label htmlFor='servings'>Number of Servings</Label>
        <Input
          id='servings'
          type='number'
          value={recipe.servings.toString()} // Convert to string to fix NaN error
          onChange={(e) => onUpdate('servings', parseInt(e.target.value) || 1)} // Use 1 as fallback
          min={1}
        />
      </div>
      <div>
        <Label htmlFor='description'>Description (optional)</Label>
        <Textarea
          id='description'
          value={recipe.description || ''}
          onChange={(e) => onUpdate('description', e.target.value)}
          placeholder='Enter recipe description'
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor='categories'>Categories</Label>
        <div className='flex flex-wrap gap-2'>
          {Object.values(FoodCategories).map((category) => (
            <Button
              key={category}
              type='button'
              variant={
                recipe.categories.includes(category) ? 'default' : 'outline'
              }
              onClick={() => {
                const newCategories = recipe.categories.includes(category)
                  ? recipe.categories.filter((c) => c !== category)
                  : [...recipe.categories, category];
                onUpdate('categories', newCategories);
              }}
              className='text-sm'
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor='image'>Recipe Image (optional)</Label>
        <Input
          id='image'
          type='file'
          accept='image/*'
          onChange={(e) => handleFileChange(e, setImage)}
        />
      </div>
      <div>
        <Label htmlFor='pdf'>Recipe PDF (optional)</Label>
        <Input
          id='pdf'
          type='file'
          accept='.pdf'
          onChange={(e) => handleFileChange(e, setPdf)}
        />
      </div>
      <div className='flex items-center space-x-2'>
        <Switch
          id='isPrivate'
          checked={recipe.isPrivate}
          onCheckedChange={(checked) => onUpdate('isPrivate', checked)}
        />
        <Label htmlFor='isPrivate'>Private Recipe</Label>
      </div>
      <div>
        <Label htmlFor='ingredientList'>Ingredient List</Label>
        <Textarea
          id='ingredientList'
          value={ingredientList}
          onChange={(e) => setIngredientList(e.target.value)}
          placeholder={
            'Paste your ingredient list here, one per line.\nFormat it like "QuantityUnit Name" e.g. "200g Onions", unit is optional'
          }
          rows={5}
        />
      </div>
      <div className='space-x-2'>
        <Button type='button' onClick={() => onAnalyze(ingredientList)}>
          {isAnalyzed ? 'Re-analyze Ingredients' : 'Analyze Ingredients'}
        </Button>
      </div>
      {isAnalyzed && (
        <IngredientAnalysis
          ingredients={recipe.analyzedIngredients}
          onUpdate={(id, field, value) => {
            const updatedIngredients = recipe.analyzedIngredients.map((ing) =>
              ing.id === id ? { ...ing, [field]: value } : ing,
            );
            onUpdate('analyzedIngredients', updatedIngredients);
          }}
          onRemove={(id) => {
            const updatedIngredients = recipe.analyzedIngredients.filter(
              (ing) => ing.id !== id,
            );
            onUpdate('analyzedIngredients', updatedIngredients);
          }}
          // onAdd={() => {
          //   const newIngredient = {
          //     id: Date.now().toString(), // just assign timestamp for easier handling
          //     name: '',
          //     amount: '',
          //     category: IngredientCategory.Others,
          //     aliases: [],
          //   };
          //   onUpdate('analyzedIngredients', [
          //     ...recipe.analyzedIngredients,
          //     newIngredient,
          //   ]);
          // }}
        />
      )}
      {isAnalyzed && (
        <div className='space-x-2'>
          <Button
            type='button'
            onClick={() => onSave(image || undefined, pdf || undefined)}
          >
            Save Recipe
          </Button>
        </div>
      )}
    </form>
  );
}
