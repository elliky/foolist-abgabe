// Because there weren't too many model interfaces, enums, etc. I decided to manage them all in one file
// If new features are added with a lot of interfaces, etc. this should get split up.

// This object has 2 id's because it's also used in analyzedIngredients, where it gets an own generated id which is ignored
// This is something that should be refactored to seperate the Ingredient in Recipe and the one which is saved on the ingredients collection
export interface Ingredient {
  id: string; // this is the id for working with the object (e.g. when a ingredient doesn't exist yet we need a id for updating the ingredient)
  ingredientId?: string; // ingredient's database ID for referencing (optional, because it's only set when saved on the database)
  name: string;
  amount: string; // this isn't used in ingredients itself. Only in analysed ingredients in recipe
  category: IngredientCategory;
  aliases: string[] | undefined;
}

export interface Recipe {
  id?: string;
  name: string;
  description?: string;
  link: string;
  servings: number;
  analyzedIngredients: Ingredient[];
  imageUrl?: string;
  pdfUrl?: string;
  ownerId: string;
  isPrivate: boolean;
  categories: string[];
}

export interface Meal {
  id: string;
  name: string;
  servings: number;
}

export interface MealPlanDay {
  lunch: Meal | null;
  dinner: Meal | null;
}

// we could use a type instead of an interface with "key in WeekDays"
// but this would also mean that the list has to have every entry on every init, which we don't do at the moment
export interface MealPlan {
  [weekDay: string]: MealPlanDay;
}

export interface PlanningDocument {
  id?: string;
  userId?: string;
  mealPlan: MealPlan;
  createdAt?: Date;
  isCurrent?: boolean;
}

export enum MealType {
  Lunch = 'lunch',
  Dinner = 'dinner',
}

export enum IngredientCategory {
  Vegetables = 'Vegetables',
  Meat = 'Meat',
  Dairy = 'Dairy',
  Grain = 'Grain',
  Others = 'Others',
}

export enum FoodCategories {
  Healthy = 'Healthy',
  Soulfood = 'Soulfood',
  Fast = 'Fast',
  CookTogether = 'Cook Together',
  Vegetarian = 'Vegetarian',
  Vegan = 'Vegan',
  GlutenFree = 'Gluten-Free',
  LowCarb = 'Low-Carb',
  Meat = 'Meat',
}

export enum WeekDays {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export const PlanningDays: WeekDays[] = Object.values(WeekDays);

// Extended type for the shopping list calculation
export type ExtendedIngredient = Ingredient & {
  usedOnDays: Set<WeekDays>;
  unit: string;
};

export type GroupedIngredients = {
  [key in IngredientCategory]: ExtendedIngredient[];
};
