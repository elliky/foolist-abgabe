'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carrot, Beef, Milk, Wheat, Coffee } from 'lucide-react';
import {
  ExtendedIngredient,
  GroupedIngredients,
  IngredientCategory,
  WeekDays,
} from '@/model/models';
import { useMealPlan } from '@/app/hooks/usePlanning';
import { getIngredients } from '@/lib/providers/database-access';
import React from 'react';
import { addOrUpdateIngredient } from '@/app/utils/ingredient-analysis-util';

const labelIcons: { [K in IngredientCategory]: () => React.JSX.Element } = {
  [IngredientCategory.Vegetables]: () => <Carrot />,
  [IngredientCategory.Meat]: () => <Beef />,
  [IngredientCategory.Dairy]: () => <Milk />,
  [IngredientCategory.Grain]: () => <Wheat />,
  [IngredientCategory.Others]: () => <Coffee />,
};

const weekDayAbbreviation: { [K in WeekDays]: string } = {
  [WeekDays.Monday]: 'M',
  [WeekDays.Tuesday]: 'Tu',
  [WeekDays.Wednesday]: 'W',
  [WeekDays.Thursday]: 'Th',
  [WeekDays.Friday]: 'F',
  [WeekDays.Saturday]: 'Sa',
  [WeekDays.Sunday]: 'Su',
};

export default function ShoppingListPage() {
  const [groupedIngredients, setGroupedIngredients] =
    useState<GroupedIngredients>({} as GroupedIngredients);
  const { mealsWithRecipes } = useMealPlan();

  useEffect(() => {
    if (!mealsWithRecipes) return;

    const fetchAndProcessIngredients = async () => {
      try {
        const ingredients = await getIngredients();

        const calculatedIngredients: ExtendedIngredient[] = [];

        mealsWithRecipes.forEach(({ servings, recipe, day }) => {
          recipe.analyzedIngredients.forEach((ing) => {
            const ingredient = ingredients.find(
              (i) => i.id === ing.ingredientId,
            );

            if (ingredient) {
              addOrUpdateIngredient(
                calculatedIngredients,
                ingredient,
                servings / recipe.servings,
                ing.amount,
                day,
              );
            }
          });
        });

        const grouped = calculatedIngredients.reduce((acc, ingredient) => {
          if (!acc[ingredient.category]) {
            acc[ingredient.category] = [];
          }
          acc[ingredient.category].push(ingredient);
          return acc;
        }, {} as GroupedIngredients);

        setGroupedIngredients(grouped);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    };

    fetchAndProcessIngredients();
  }, [mealsWithRecipes]);

  return (
    <>
      <h1 className='text-3xl font-bold mb-6'>Shopping List</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {Object.entries(groupedIngredients).map(([category, items]) => (
          <Card key={category} className='w-full'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                {labelIcons[category as keyof typeof labelIcons]?.()}
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2 min-h-72'>
                {items.map((ingredient, index) => (
                  <li key={index} className='flex items-center justify-between'>
                    <span>{ingredient.name}</span>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm font-medium'>
                        {parseFloat(ingredient.amount).toFixed(0)}{' '}
                        {ingredient.unit}
                      </span>
                      <div className='flex flex-wrap gap-1'>
                        {[...ingredient.usedOnDays].map((day, index) => (
                          <span
                            key={index}
                            className={`px-1 py-0.5 rounded-full text-xs font-bold
                              )}-500`}
                            title={day}
                          >
                            {weekDayAbbreviation[day]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
