import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getCurrentMealPlan,
  getRecipeByIds,
} from '@/lib/providers/database-access';
import { useUserStore } from '@/app/store/userStore';
import {
  Ingredient,
  IngredientCategory,
  MealType,
  Recipe,
} from '@/model/models';
import { renderHook, waitFor } from '@testing-library/react';
import { useMealPlan } from './usePlanning';

vi.mock('@/lib/providers/database-access');
vi.mock('@/app/store/userStore');

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    currentUser: { uid: 'test-user-id' },
  })),
}));

describe('useMealPlan', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock user store
    vi.mocked(useUserStore).mockReturnValue({
      user: { uid: 'test-user-id' },
      properties: { manageDinner: true, manageLunch: true },
    });

    // Mock getCurrentMealPlan
    vi.mocked(getCurrentMealPlan).mockResolvedValue({
      mealPlan: {
        Monday: {
          lunch: { name: 'recipe1', servings: 2, id: 'id1' },
          dinner: { name: 'recipe2', servings: 4, id: 'id2' },
        },
        Tuesday: {
          [MealType.Lunch]: { name: 'recipe3', servings: 2, id: 'id3' },
          [MealType.Dinner]: { name: 'recipe4', servings: 3, id: 'id4' },
        },
      },
    });

    const ingredientFlour: Ingredient = {
      id: '1',
      amount: '200g',
      ingredientId: '1',
      name: 'Flour',
      category: IngredientCategory.Grain,
      aliases: [],
    };

    const ingredientWholemealFlour: Ingredient = {
      id: '1',
      amount: '100g',
      ingredientId: '1',
      name: 'Wholemeal flour',
      category: IngredientCategory.Grain,
      aliases: [],
    };

    const recipeDough: Recipe = {
      id: 'id1',
      name: 'Normal Dough',
      link: '',
      servings: 1,
      description: '',
      analyzedIngredients: [ingredientFlour],
      ownerId: '',
      isPrivate: false,
      categories: [],
    };

    const recipeWholemealFlourDough: Recipe = {
      id: 'id2',
      name: 'Wholemeal flour dough',
      link: '',
      servings: 1,
      description: '',
      analyzedIngredients: [ingredientWholemealFlour],
      ownerId: '',
      isPrivate: false,
      categories: [],
    };

    // Mock getRecipeByIds
    vi.mocked(getRecipeByIds).mockResolvedValue([
      recipeDough,
      recipeWholemealFlourDough,
    ]);
  });

  it('should fetch meal plan and recipes', async () => {
    const { result } = renderHook(() => useMealPlan());

    // Initial state
    expect(result.current.loading).toBe(true);

    // After fetching
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.mealPlan).toBeTruthy();

      // there is no error when receipe id isn't found that's why we have 2
      expect(result.current.recipes).toHaveLength(2);
      expect(result.current.mealsWithRecipes).toHaveLength(2);
    });
  });

  it('should handle error when fetching fails', async () => {
    vi.mocked(getCurrentMealPlan).mockRejectedValue(new Error('Fetch failed'));
    const { result } = renderHook(() => useMealPlan());

    waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(
        'Failed to fetch meal plan or recipes.',
      );
      expect(result.current.mealPlan).toBeNull();
      expect(result.current.recipes).toBeNull();
      expect(result.current.mealsWithRecipes).toBeNull();
    });
  });
  it('should return empty arrays when no meal plan exists', async () => {
    vi.mocked(getCurrentMealPlan).mockResolvedValue(null);
    const { result } = renderHook(() => useMealPlan());

    waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.mealPlan).toBeNull();
      expect(result.current.recipes).toEqual([]);
      expect(result.current.mealsWithRecipes).toEqual([]);
    });
  });

  it('should filter meals based on user properties', async () => {
    vi.mocked(useUserStore).mockReturnValue({
      user: { uid: 'test-user-id' },
      properties: { manageDinner: true, manageLunch: false },
    });
    const { result } = renderHook(() => useMealPlan());

    waitFor(() => {
      expect(result.current.mealsWithRecipes).toHaveLength(2);
      expect(
        result.current.mealsWithRecipes?.every(
          (meal) => meal.mealType === MealType.Dinner,
        ),
      ).toBe(true);
    });
  });
  it('should not fetch when user is not logged in', async () => {
    vi.mocked(useUserStore).mockReturnValue({
      user: null,
      properties: { manageDinner: true, manageLunch: true },
    });
    const { result } = renderHook(() => useMealPlan());
    expect(result.current.loading).toBe(false);
    expect(result.current.mealPlan).toBeNull();
    expect(result.current.recipes).toBeNull();
    expect(result.current.mealsWithRecipes).toBeNull();
    expect(getCurrentMealPlan).not.toHaveBeenCalled();
    expect(getRecipeByIds).not.toHaveBeenCalled();
  });
});
