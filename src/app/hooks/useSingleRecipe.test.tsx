import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getIngredients,
  saveRecipeToDatabase,
} from '@/lib/providers/database-access';
import { toast } from '@/hooks/use-toast';
import { useSingleRecipe } from './useSingleRecipe';
import { act, renderHook } from '@testing-library/react';
import { IngredientCategory } from '@/model/models';

vi.mock('@/lib/providers/database-access');
vi.mock('@/hooks/use-toast');
vi.mock('@/app/store/userStore', () => ({
  useUserStore: () => ({ user: { uid: 'test-user-id' } }),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    currentUser: { uid: 'test-user-id' },
  })),
}));

describe('useSingleRecipe', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getIngredients).mockResolvedValue([
      {
        id: '1',
        amount: '',
        ingredientId: '1',
        name: 'flour',
        category: IngredientCategory.Grain,
        aliases: ['all-purpose flour'],
      },
      {
        id: '2',
        amount: '',
        ingredientId: '2',
        name: 'egg',
        category: IngredientCategory.Dairy,
        aliases: ['eggs'],
      },
      {
        id: '3',
        amount: '',
        ingredientId: '3',
        name: 'milk',
        category: IngredientCategory.Dairy,
        aliases: [],
      },
    ]);
  });

  it('should initialize with empty recipe object state', () => {
    const { result } = renderHook(() => useSingleRecipe());
    expect(result.current.currentRecipe).toEqual({
      name: '',
      link: '',
      servings: 1,
      description: '',
      analyzedIngredients: [],
      ownerId: '',
      isPrivate: false,
      categories: [],
    });
  });

  it('should update choosen attribute of current recipe', () => {
    const { result } = renderHook(() => useSingleRecipe());
    act(() => {
      result.current.updateCurrentRecipe('name', 'Test Recipe');
    });
    expect(result.current.currentRecipe.name).toBe('Test Recipe');
  });

  it('should analyze ingredients correctly', () => {
    const { result } = renderHook(() => useSingleRecipe());
    act(() => {
      result.current.analyzeIngredients('100g flour\n2 eggs\n50ml milk');
    });
    expect(result.current.currentRecipe.analyzedIngredients).toHaveLength(3);
    expect(result.current.currentRecipe.analyzedIngredients[0]).toEqual(
      expect.objectContaining({
        amount: '100g',
        name: 'flour',
      }),
    );
    expect(result.current.currentRecipe.analyzedIngredients[1]).toEqual(
      expect.objectContaining({
        amount: '2',
        name: 'eggs',
      }),
    );
    expect(result.current.currentRecipe.analyzedIngredients[2]).toEqual(
      expect.objectContaining({
        amount: '50ml',
        name: 'milk',
      }),
    );
  });

  it('should use the first space to seperate amount and name of analyzed ingredients', () => {
    const { result } = renderHook(() => useSingleRecipe());
    act(() => {
      result.current.analyzeIngredients(
        '100g my ultra special secret ingredient\n2 second special ingredient',
      );
    });
    expect(result.current.currentRecipe.analyzedIngredients).toHaveLength(2);
    expect(result.current.currentRecipe.analyzedIngredients[0]).toEqual(
      expect.objectContaining({
        amount: '100g',
        name: 'my ultra special secret ingredient',
      }),
    );
    expect(result.current.currentRecipe.analyzedIngredients[1]).toEqual(
      expect.objectContaining({
        amount: '2',
        name: 'second special ingredient',
      }),
    );
  });

  it('should trim the name of analyzed ingredients', () => {
    const { result } = renderHook(() => useSingleRecipe());
    act(() => {
      result.current.analyzeIngredients('100g trimmed result ');
    });
    expect(result.current.currentRecipe.analyzedIngredients).toHaveLength(1);
    expect(result.current.currentRecipe.analyzedIngredients[0]).toEqual(
      expect.objectContaining({
        amount: '100g',
        name: 'trimmed result',
      }),
    );
  });

  it('should save recipe', async () => {
    const { result } = renderHook(() => useSingleRecipe());
    await act(async () => {
      await result.current.saveRecipe();
    });
    expect(saveRecipeToDatabase).toHaveBeenCalled();
  });

  it('should handle save recipe error with toast', async () => {
    vi.mocked(saveRecipeToDatabase).mockRejectedValue(new Error('Save failed'));
    const { result } = renderHook(() => useSingleRecipe());
    await act(async () => {
      await result.current.saveRecipe();
    });
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'destructive',
        title: 'Error on saving',
        description: 'Was not able to save the receipe!',
      }),
    );
  });
});
