import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/app/components/confirm-dialog';
import { CalendarDays, Shuffle } from 'lucide-react';
import { useUserStore } from '@/app/store/userStore';
import { MealType } from '@/model/models';

interface PlanningActionsProps {
  assignAllRandomMeals: (mealType: MealType) => void;
  showPreviousMealPlan: () => void;
  createNewMealPlan: () => void;
  planningDocumentAvailable: boolean;
}

export function PlanningActions({
  assignAllRandomMeals,
  showPreviousMealPlan,
  createNewMealPlan,
  planningDocumentAvailable,
}: PlanningActionsProps) {
  const { properties } = useUserStore();

  return (
    <section className='mb-8 bg-green-700 text-white rounded-lg shadow-lg p-6'>
      <h2 className='text-2xl font-bold mb-4 flex items-center'>
        <CalendarDays className='mr-2 h-6 w-6' />
        Weekly Meal Planner Actions
      </h2>
      <p className='mb-4'>
        {planningDocumentAvailable
          ? 'Quickly assign meals for the entire week or manage meal plans.'
          : 'There is no current meal plan. Please create one, if you want to plan your meals'}
      </p>
      {planningDocumentAvailable && (
        <div className='flex gap-4 w-full flex-col sm:flex-row'>
          {properties.manageLunch && (
            <ConfirmDialog
              title='Are you sure?'
              description='This will overwrite any existing lunch assignments. Are you sure you want to continue?'
              onConfirm={() => assignAllRandomMeals(MealType.Lunch)}
            >
              <Button className='flex-grow'>
                <Shuffle /> Assign random lunches
              </Button>
            </ConfirmDialog>
          )}
          {properties.manageDinner && (
            <ConfirmDialog
              title='Are you sure?'
              description='This will overwrite any existing dinner assignments. Are you sure you want to continue?'
              onConfirm={() => assignAllRandomMeals(MealType.Dinner)}
            >
              <Button className='flex-grow'>
                <Shuffle /> Assign random dinners
              </Button>
            </ConfirmDialog>
          )}
        </div>
      )}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4'>
        <Button onClick={showPreviousMealPlan} className='w-full'>
          Show previous meal plan
        </Button>
        <ConfirmDialog
          title='Are you sure?'
          description='This will create a new meal plan, and you will not be able to get the shopping list for the previous one anymore.'
          onConfirm={createNewMealPlan}
          requireConfirmation={planningDocumentAvailable}
        >
          <Button className='w-full'>
            {properties.notedRecipesForNextPlanning.length > 0
              ? `Create new meal plan (${properties.notedRecipesForNextPlanning.length} noted recipes)`
              : 'Create new meal plan'}
          </Button>
        </ConfirmDialog>
      </div>
    </section>
  );
}
