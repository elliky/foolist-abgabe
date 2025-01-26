import { ExtendedIngredient, Ingredient, WeekDays } from '@/model/models';

/**
 * Adds or updates an ingredient in the calculatedIngredients array.
 * @param calculatedIngredients The array of calculated ingredients.
 * @param ingredient The ingredient to add or update.
 * @param servings The number of servings for the meal.
 */
export const addOrUpdateIngredient = function addOrUpdateIngredient(
  calculatedIngredients: ExtendedIngredient[],
  ingredient: Ingredient,
  servings: number,
  amount: string,
  day: WeekDays,
) {
  const existingIng = calculatedIngredients.find(
    (i) => i.ingredientId === ingredient.ingredientId,
  );

  if (existingIng && existingIng.unit === getUnitOutIngredientAmount(amount)) {
    existingIng.amount = `${
      parseFloat(existingIng.amount) + parseFloat(amount) * servings
    }`;

    existingIng.usedOnDays.add(day);
  } else {
    calculatedIngredients.push({
      ...ingredient,
      amount: `${getAmountOutIngredientAmount(amount) * servings}`,
      unit: getUnitOutIngredientAmount(amount),
      usedOnDays: new Set<WeekDays>([day]),
    });
  }
};

function getAmountOutIngredientAmount(ingredientAmount: string): number {
  // return number amound or 1 if value would be "little" or something like this
  return parseFloat(ingredientAmount) || 1;
}

function getUnitOutIngredientAmount(ingredientAmount: string): string {
  return ingredientAmount.replace(/[\d.\s]/g, '').trim();
}
