import { test, expect } from '@playwright/test';

/**
 * for this test their needs to be an existing public receipe which looks like this:
 *
 * Name: Chorizo-Tomatenrisotto
 * Servings: 2
 * Ingredients:
 * 50g Zwiebel (veg)
 * 100g Chorizo (Meat)
 * 150g Risottoreis (Grain) Alias: Risotto
 * 300g Tomate (Veg) Alias: Tomate
 * 75g Frischkäse mit Knoblauch und Kräutern (Dairy)
 */
test('Happy Flow', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await expect(page).toHaveTitle('FooList');
  await expect(
    page.getByRole('heading', { name: 'FooList - Your Meal Planner' }),
  ).toBeVisible();

  // login
  await page.getByText('Sign in to create, plan, and').click();
  await page.getByRole('link', { name: 'Sign in to get started' }).click();
  await page.getByRole('button', { name: 'Use Anonymously' }).click();

  // change settings
  await page.getByRole('button', { name: 'Open user menu' }).click();
  await page.getByRole('menuitem', { name: 'Settings' }).click();
  await page.getByLabel('Manage Lunch').click();
  await page.getByRole('main').getByRole('button').first().click();
  await page.getByRole('main').getByRole('button').nth(1).click();
  await page.getByRole('spinbutton').click();
  await page.getByRole('button', { name: 'Save Settings' }).click();
  await page.getByLabel('Notifications (F8)').getByRole('button').click();

  // create private recipe
  await page.getByRole('link', { name: 'Recipes' }).click();
  await page.getByRole('button', { name: 'Add New Recipe' }).click();
  await page.getByPlaceholder('Enter recipe name').fill('My E2E Test Receipe');
  await page
    .getByPlaceholder('https://example.com/recipe')
    .fill('https://playwright.dev/');
  await page.getByLabel('Number of Servings').fill('2');
  await page.getByRole('button', { name: 'Fast' }).click();
  await page.getByLabel('Private Recipe').click();
  await page.getByPlaceholder('Paste your ingredient list').fill('5 Gurke');
  await page.getByRole('button', { name: 'Analyze Ingredients' }).click();

  await expect(page.getByText('Existing')).toBeVisible();

  await page.getByRole('button', { name: 'Save Recipe' }).click();

  // open created recipe
  await page.getByPlaceholder('Search recipes...').fill('E2E');
  await page.getByRole('link', { name: 'My E2E Test Receipe My E2E' }).click();

  // bookmark created recipe
  await page.getByRole('link', { name: 'Recipes' }).click();
  await page.getByPlaceholder('Search recipes...').fill('E2E');

  // click bookmark icon
  await page
    .getByRole('link', { name: 'My E2E Test Receipe My E2E' })
    .getByRole('button')
    .nth(1)
    .click();
  await page.getByRole('link', { name: 'Week Planning' }).click();

  await expect(page.getByText('Create new meal plan (1 noted')).toBeVisible();
  // use create meal (with 1 noted receipe)
  await page
    .getByRole('button', { name: 'Create new meal plan (1 noted' })
    .click();
  await expect(page.getByText('Monday')).toBeVisible();

  // this test expects the noted receipe to not get assigned on Tuesday (at the moment the first one is always Monday)
  await page
    .locator('div')
    .filter({ hasText: /^TuesdaydinnerNo meal assigned Add Recipe Random$/ })
    .getByRole('button')
    .first()
    .click();
  await page.getByLabel('Receipe').click();
  await page.getByPlaceholder('Search recipes...').fill('Chorizo');

  await page.getByRole('option', { name: 'Chorizo-Tomatenrisotto' }).click();
  await page.getByRole('button', { name: 'Save' }).click();

  // check shopping list
  await page.getByRole('link', { name: 'Shopping List' }).click();
  await expect(page.getByText('Tomaten300 gTu')).toBeVisible();

  await expect(page.getByText('MeatChorizo100 gTu')).toBeVisible();
});
