import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

export interface UserProperties {
  manageLunch: boolean;
  manageDinner: boolean;
  favoriteRecipes: string[];
  notedRecipesForNextPlanning: string[];
  defaultServings: number;
}

interface UserState {
  user: User | null;
  properties: UserProperties;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  fetchSettings: () => Promise<void>;
  updateSettings: (updates: Partial<UserProperties>) => Promise<void>;
  addNotedRecipe: (recipeId: string) => Promise<void>;
  removeNotedRecipe: (recipeId: string) => Promise<void>;
  toggleNotedRecipe: (recipeId: string) => Promise<void>;
  addFavoriteRecipe: (recipeId: string) => Promise<void>;
  removeFavoriteRecipe: (recipeId: string) => Promise<void>;
  toggleFavorite: (recipeId: string) => Promise<void>;
}

const DEFAULT_PROPERTIES: UserProperties = {
  manageLunch: true,
  manageDinner: true,
  favoriteRecipes: [],
  notedRecipesForNextPlanning: [],
  defaultServings: 2,
};

export const useUserStore = create<UserState>()(
  // since the last pnpm up --latest VS Code isn't happy with the typing of persist...
  // this is ugly but it does not affect the app and the checks have no issue, that's why we keep it like this for the moment
  // all other dependencies are happier with the official react 19 release and so on
  persist(
    (set, get) => ({
      user: null,
      properties: DEFAULT_PROPERTIES,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, properties: DEFAULT_PROPERTIES }),
      fetchSettings: async () => {
        const { user } = get();
        if (!db || !user) {
          set({ error: 'Firestore or user is not initialized.' });
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            set({ properties: userDoc.data() as UserProperties });
          } else {
            await setDoc(userRef, DEFAULT_PROPERTIES);
            set({ properties: DEFAULT_PROPERTIES });
          }
        } catch (error) {
          set({
            error: (error as Error).message || 'An unknown error occurred.',
          });
        } finally {
          set({ isLoading: false });
        }
      },
      updateSettings: async (updates) => {
        const { user, properties } = get();
        if (!db || !user) {
          set({ error: 'Firestore or user is not initialized.' });
          return;
        }

        try {
          const userRef = doc(db, 'users', user.uid);
          const updatedSettings = { ...properties, ...updates };

          await updateDoc(userRef, updates);
          set({ properties: updatedSettings });
        } catch (error) {
          set({
            error: (error as Error).message || 'An unknown error occurred.',
          });
        }
      },
      addNotedRecipe: async (recipeId) => {
        const { properties } = get();
        if (!properties.notedRecipesForNextPlanning.includes(recipeId)) {
          await get().updateSettings({
            notedRecipesForNextPlanning: [
              ...properties.notedRecipesForNextPlanning,
              recipeId,
            ],
          });
        }
      },
      removeNotedRecipe: async (recipeId) => {
        const { properties } = get();
        const updatedNotedRecipes =
          properties.notedRecipesForNextPlanning.filter(
            (id) => id !== recipeId,
          );
        await get().updateSettings({
          notedRecipesForNextPlanning: updatedNotedRecipes,
        });
      },
      toggleNotedRecipe: async (recipeId) => {
        const { properties } = get();
        if (!properties.notedRecipesForNextPlanning.includes(recipeId)) {
          await get().updateSettings({
            notedRecipesForNextPlanning: [
              ...properties.notedRecipesForNextPlanning,
              recipeId,
            ],
          });
        } else {
          const updatedNotedRecipes =
            properties.notedRecipesForNextPlanning.filter(
              (id) => id !== recipeId,
            );
          await get().updateSettings({
            notedRecipesForNextPlanning: updatedNotedRecipes,
          });
        }
      },
      addFavoriteRecipe: async (recipeId) => {
        const { properties } = get();
        if (!properties.favoriteRecipes.includes(recipeId)) {
          await get().updateSettings({
            favoriteRecipes: [...properties.favoriteRecipes, recipeId],
          });
        }
      },
      removeFavoriteRecipe: async (recipeId) => {
        const { properties } = get();
        const updatedFavorites = properties.favoriteRecipes.filter(
          (id) => id !== recipeId,
        );
        await get().updateSettings({ favoriteRecipes: updatedFavorites });
      },
      toggleFavorite: async (recipeId) => {
        const { properties } = get();
        if (!properties.favoriteRecipes.includes(recipeId)) {
          await get().updateSettings({
            favoriteRecipes: [...properties.favoriteRecipes, recipeId],
          });
        } else {
          const updatedFavorites = properties.favoriteRecipes.filter(
            (id) => id !== recipeId,
          );
          await get().updateSettings({ favoriteRecipes: updatedFavorites });
        }
      },
    }),
    {
      name: 'user-storage',
    },
  ),
);
