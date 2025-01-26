'use client';

import Image from 'next/image';
import { Bookmark, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/app/store/userStore';
import { Recipe } from '@/model/models';
import { isFavorite, isNoted } from '@/app/utils/user-data-helper';
import { useRouter } from 'next/navigation';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { properties, toggleFavorite, toggleNotedRecipe } = useUserStore();

  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/routes/recipe/${recipe.id}`);
  };

  const maxIngredientDisplay: number = 5;

  return (
    <div
      className='bg-white shadow-md rounded-lg overflow-hidden cursor-pointer'
      onClick={handleCardClick}
      role='link'
      tabIndex={0} // Make the card focusable
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleCardClick(); // Support keyboard navigation
      }}
    >
      <div className='relative h-48 w-full'>
        <Image
          src={recipe.imageUrl || '/placeholder.svg'}
          alt={recipe.name}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Content Section */}
      <div className='p-4'>
        <div className='flex justify-between items-center mb-2'>
          {/* Recipe Name */}
          <h3 className='text-lg font-semibold text-gray-800'>{recipe.name}</h3>

          {/* Action Buttons */}
          <div
            className='flex space-x-2'
            onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling to the card
          >
            <Button
              variant='ghost'
              size='icon'
              onClick={() => toggleFavorite(recipe.id!)}
            >
              <Star
                className={
                  isFavorite(properties, recipe.id!)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-400'
                }
              />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => toggleNotedRecipe(recipe.id!)}
            >
              <Bookmark
                className={
                  isNoted(properties, recipe.id!)
                    ? 'fill-blue-400 text-blue-400'
                    : 'text-gray-400'
                }
              />
            </Button>
          </div>
        </div>

        {/* Ingredients Section */}
        <div className='text-sm text-gray-600 mb-4'>
          <h4 className='font-semibold mb-1'>Ingredients:</h4>
          <ul className='list-disc list-inside'>
            {recipe.analyzedIngredients
              .slice(0, maxIngredientDisplay)
              .map((ingredient, index) => (
                <li key={index}>{ingredient.name}</li>
              ))}
            {recipe.analyzedIngredients.length > maxIngredientDisplay && (
              <li>
                ...and{' '}
                {recipe.analyzedIngredients.length - maxIngredientDisplay} more
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
