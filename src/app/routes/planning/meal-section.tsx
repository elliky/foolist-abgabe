import { Button } from '@/components/ui/button';
import { MealType } from '@/model/models';
import { Shuffle } from 'lucide-react';
import AddMealDialog from './add-meal-dialog';
import ConfirmDialog from '@/app/components/confirm-dialog';

interface MealSectionProps {
  mealType: MealType;
  meal: { id: string; name: string; servings: number } | null;
  day: string;
  assignMeal: (
    day: string,
    mealType: MealType,
    recipeId: string,
    recipeName: string,
    servings: number,
  ) => void;
  assignRandomMeal: (day: string, mealType: MealType) => void;
}

export function MealSection({
  mealType,
  meal,
  day,
  assignMeal,
  assignRandomMeal,
}: MealSectionProps) {
  return (
    <div>
      <h3 className='font-semibold mb-2 capitalize'>{mealType}</h3>
      {meal ? (
        <div>
          <p className='text-sm mb-2'>
            {meal.name} ({meal.servings} ppl.)
          </p>
        </div>
      ) : (
        <p className='text-sm text-gray-500 mb-2'>No meal assigned</p>
      )}
      <div className='grid grid-cols-2 gap-2'>
        <AddMealDialog day={day} mealType={mealType} assignMeal={assignMeal} />
        <ConfirmDialog
          requireConfirmation={!!meal}
          title='Are you sure?'
          description={`This will overwrite the current ${mealType} assignment for ${day}. Are you sure you want to continue?`}
          onConfirm={() => assignRandomMeal(day, mealType)}
        >
          <Button variant='outline' size='sm' className='w-full'>
            <Shuffle /> Random
          </Button>
        </ConfirmDialog>
      </div>
    </div>
  );
}
