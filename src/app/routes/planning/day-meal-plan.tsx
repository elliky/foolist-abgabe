import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MealPlan, MealType } from '@/model/models';
import { useUserStore } from '@/app/store/userStore';
import { MealSection } from './meal-section';

interface DailyMealCardProps {
  day: string;
  mealPlan: MealPlan;
  assignMeal: (
    day: string,
    mealType: MealType,
    recipeId: string,
    recipeName: string,
    servings: number,
  ) => void;
  assignRandomMeal: (day: string, mealType: MealType) => void;
}

export function DailyMealCard({
  day,
  mealPlan,
  assignMeal,
  assignRandomMeal,
}: DailyMealCardProps) {
  const { properties } = useUserStore();

  return (
    <Card className='shadow-lg rounded-lg overflow-hidden'>
      <CardHeader className='py-3'>
        <CardTitle className='text-lg font-semibold text-center'>
          {day}
        </CardTitle>
      </CardHeader>
      <CardContent className='flex-grow space-y-4 p-4'>
        {properties.manageLunch && (
          <MealSection
            mealType={MealType.Lunch}
            meal={mealPlan[day].lunch}
            day={day}
            assignMeal={assignMeal}
            assignRandomMeal={assignRandomMeal}
          />
        )}
        {properties.manageDinner && (
          <MealSection
            mealType={MealType.Dinner}
            meal={mealPlan[day].dinner}
            day={day}
            assignMeal={assignMeal}
            assignRandomMeal={assignRandomMeal}
          />
        )}
      </CardContent>
    </Card>
  );
}
