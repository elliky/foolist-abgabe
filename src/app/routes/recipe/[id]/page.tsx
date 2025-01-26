'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Edit, Bookmark } from 'lucide-react';
import { AddRecipeForm } from '@/app/components/add-recipe-form';
import { useUserStore } from '@/app/store/userStore';
import { isFavorite, isNoted } from '@/app/utils/user-data-helper';
import { useSingleRecipe } from '@/app/hooks/useSingleRecipe';

export default function RecipePage() {
  const { id } = useParams();
  const {
    currentRecipe,
    updateCurrentRecipe,
    fetchRecipeById,
    analyzeIngredients,
    saveRecipe,
  } = useSingleRecipe();
  const [isEditing, setIsEditing] = useState(false);
  const { properties, user, toggleFavorite, toggleNotedRecipe } =
    useUserStore();

  useEffect(() => {
    const loadRecipe = async () => {
      if (typeof id === 'string') {
        await fetchRecipeById(id);
      }
    };
    loadRecipe();
  }, [id, fetchRecipeById]);

  const handleSaveRecipe = async (image?: File, pdf?: File) => {
    if (currentRecipe) {
      await saveRecipe(image, pdf);
      setIsEditing(false);
      // Reload the recipe after saving
      fetchRecipeById(currentRecipe.id!);
    }
  };

  if (!currentRecipe) {
    return <div>Loading...</div>;
  }

  const isOwner = currentRecipe.ownerId === user?.uid;

  return (
    <>
      <Link href='/routes/recipe'>
        <Button className='mb-4'>Back to Recipes</Button>
      </Link>
      {isEditing ? (
        <div>
          <Button onClick={() => setIsEditing(false)} className='mb-4'>
            Cancel Editing
          </Button>
          <AddRecipeForm
            recipe={currentRecipe}
            onUpdate={(field, value) => updateCurrentRecipe(field, value)}
            onAnalyze={analyzeIngredients}
            onSave={handleSaveRecipe}
          />
        </div>
      ) : (
        <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
          <div className='relative h-64 w-full'>
            <Image
              src={currentRecipe.imageUrl || '/placeholder.svg'}
              alt={currentRecipe.name}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className='p-6'>
            <div className='flex justify-between items-center mb-4'>
              <h1 className='text-3xl font-bold text-gray-800'>
                {currentRecipe.name}
              </h1>
              <div className='flex items-center space-x-2'>
                {isOwner && (
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className='text-gray-400' />
                  </Button>
                )}
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => toggleFavorite(currentRecipe.id!)}
                >
                  <Star
                    className={
                      isFavorite(properties, currentRecipe.id!)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-400'
                    }
                  />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => toggleNotedRecipe(currentRecipe.id!)}
                >
                  <Bookmark
                    className={
                      isNoted(properties, currentRecipe.id!)
                        ? 'fill-blue-400 text-blue-400'
                        : 'text-gray-400'
                    }
                  />
                </Button>
              </div>
            </div>
            <p className='text-gray-600 mb-4'>
              Servings: {currentRecipe.servings}
            </p>
            <div className='mb-4'>
              <h2 className='text-xl font-semibold mb-2'>Categories:</h2>
              <div className='flex flex-wrap gap-2'>
                {currentRecipe.categories?.map((category) => (
                  <span
                    key={category}
                    className='bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm'
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
            <div className='mb-6'>
              <h2 className='text-xl font-semibold mb-2'>Ingredients:</h2>
              <ul className='list-disc list-inside'>
                {currentRecipe.analyzedIngredients.map((ingredient, index) => (
                  <li key={index} className='text-gray-700'>
                    {ingredient.amount} {ingredient.name}
                  </li>
                ))}
              </ul>
            </div>
            {currentRecipe.description && (
              <div className='mb-6'>
                <h2 className='text-xl font-semibold mb-2'>Description:</h2>
                <p className='text-gray-700'>{currentRecipe.description}</p>
              </div>
            )}
            {currentRecipe.link && (
              <div className='mb-6'>
                <h2 className='text-xl font-semibold mb-2'>Recipe Link:</h2>
                <a
                  href={currentRecipe.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 hover:underline'
                >
                  {currentRecipe.link}
                </a>
              </div>
            )}
            {currentRecipe.pdfUrl && (
              <div className='mb-6'>
                <h2 className='text-xl font-semibold mb-2'>
                  PDF Instructions:
                </h2>
                <a
                  href={currentRecipe.pdfUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 hover:underline'
                >
                  View PDF Instructions
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
