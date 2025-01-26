import { UserProperties } from '../store/userStore';

export const isFavorite = (settings: UserProperties, recipeId: string) => {
  return settings.favoriteRecipes.includes(recipeId);
};

export const isNoted = (settings: UserProperties, recipeId: string) => {
  return settings.notedRecipesForNextPlanning.includes(recipeId);
};
