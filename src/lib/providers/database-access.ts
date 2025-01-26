import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Query,
  DocumentData,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  setDoc,
  documentId,
} from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { Ingredient, MealPlan, PlanningDocument, Recipe } from '@/model/models';
import { RecipeFilterValues } from '@/app/hooks/useRecipes';

export const getRecipes = async (
  filter: RecipeFilterValues,
): Promise<Recipe[]> => {
  const recipesCollection = collection(db, 'recipes');
  let recipesQuery: Query<DocumentData> = recipesCollection;

  if (filter === 'Own') {
    recipesQuery = query(
      recipesCollection,
      where('ownerId', '==', auth.currentUser?.uid),
    );
  } else {
    recipesQuery = query(recipesCollection, where('isPrivate', '==', false));
  }

  const recipesSnapshot = await getDocs(recipesQuery);
  let recipesList = recipesSnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Recipe,
  );

  if (filter !== 'Own') {
    const privateRecipesQuery = query(
      recipesCollection,
      where('ownerId', '==', auth.currentUser?.uid),
      where('isPrivate', '==', true),
    );
    const privateRecipesSnapshot = await getDocs(privateRecipesQuery);
    const privateRecipesList = privateRecipesSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Recipe,
    );
    recipesList = [...recipesList, ...privateRecipesList];
  }

  return recipesList;
};

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  const recipeDoc = await getDoc(doc(db, 'recipes', id));
  if (recipeDoc.exists()) {
    return { id: recipeDoc.id, ...recipeDoc.data() } as Recipe;
  }
  return null;
};

/**
 * This function reads receipe ids from firebase.
 * Because it's only possible to read a maximum of 10 documents we need to split it up in chunks and read it
 * @param ids receipe ids
 * @returns receipes with the given ids
 */
const fetchDocumentsByIdsInChunks = async (
  ids: string[],
): Promise<Recipe[]> => {
  try {
    const chunkSize: number = 10;
    const chunkedIds = [];
    for (let i = 0; i < ids.length; i += chunkSize) {
      chunkedIds.push(ids.slice(i, i + chunkSize));
    }

    const documentPromises = chunkedIds.map(async (chunk) => {
      const q = query(
        collection(db, 'recipes'),
        where(documentId(), 'in', chunk),
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Recipe,
      );
    });

    const documents = (await Promise.all(documentPromises)).flat();

    return documents;
  } catch (error) {
    console.error('Error fetching documents by IDs:', error);
    throw error;
  }
};

export const getRecipeByIds = async (ids: string[]): Promise<Recipe[] | []> => {
  return await fetchDocumentsByIdsInChunks(ids);
};

export const saveRecipeToDatabase = async (
  recipe: Recipe,
  userId: string,
): Promise<void> => {
  const { id, ...recipeData } = recipe;
  if (id) {
    await updateDoc(doc(db, 'recipes', id), recipeData);
  } else {
    recipeData.ownerId = userId;
    await addDoc(collection(db, 'recipes'), recipeData);
  }
};

export const getIngredients = async (): Promise<Ingredient[]> => {
  const ingredientsCollection = collection(db, 'ingredients');
  const ingredientsSnapshot = await getDocs(ingredientsCollection);
  return ingredientsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ingredientId: doc.id,
    name: doc.data().name,
    amount: '',
    category: doc.data().category,
    aliases: doc.data().aliases,
  }));
};

export const saveIngredient = async (
  ingredient: Ingredient,
): Promise<Ingredient> => {
  // at the moment amound is saved as well, should be changed
  const docRef = await addDoc(collection(db, 'ingredients'), {
    name: ingredient.name,
    category: ingredient.category,
    aliases: ingredient.aliases,
  });

  ingredient.id = docRef.id;
  ingredient.ingredientId = docRef.id;

  return ingredient;
};

export const updateIngredient = async (
  ingredientId: string,
  updatedFields: Partial<Ingredient>,
): Promise<void> => {
  const docRef = doc(db, 'ingredients', ingredientId);

  // at the moment amound is saved as well, should be changed
  await updateDoc(docRef, {
    ...updatedFields,
  });
};

export const getCurrentMealPlan = async (
  userId: string,
): Promise<PlanningDocument | null> => {
  const planningCollection = collection(db, 'planning');
  const currentPlanQuery = query(
    planningCollection,
    where('userId', '==', userId),
    where('isCurrent', '==', true),
    orderBy('createdAt', 'desc'),
    limit(1),
  );

  const querySnapshot = await getDocs(currentPlanQuery);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as PlanningDocument;
  }

  return null;
};

export const getPreviousMealPlan = async (
  userId: string,
): Promise<PlanningDocument | null> => {
  const planningCollection = collection(db, 'planning');
  const previousPlanQuery = query(
    planningCollection,
    where('userId', '==', userId),
    where('isCurrent', '==', false),
    orderBy('createdAt', 'desc'),
    limit(1),
  );

  const querySnapshot = await getDocs(previousPlanQuery);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      mealPlan: doc.data().mealPlan,
      ...doc.data(),
    };
  }

  return null;
};

export const savePlanningDocument = async (
  userId: string,
  planningDocument: PlanningDocument,
): Promise<string> => {
  const planRef = planningDocument.id
    ? doc(db, 'planning', planningDocument.id)
    : doc(collection(db, 'planning'));

  if (!planningDocument.id) {
    planningDocument.createdAt = new Date();
    planningDocument.userId = userId;
  }

  await setDoc(planRef, planningDocument, { merge: true });

  return planRef.id;
};

export const createNewMealPlan = async (
  userId: string,
  mealPlan: MealPlan,
): Promise<PlanningDocument> => {
  const newPlanRef = doc(collection(db, 'planning'));
  const planningDocument: PlanningDocument = {
    userId: userId,
    mealPlan: mealPlan,
    createdAt: new Date(),
    isCurrent: true,
  };

  await setDoc(newPlanRef, planningDocument);

  planningDocument.id = newPlanRef.id;

  return planningDocument;
};

export const setMealPlanInactive = async (planId: string): Promise<void> => {
  await updateDoc(doc(db, 'planning', planId), {
    isCurrent: false,
  });
};
