import { expect } from '@playwright/test';
import { test } from '../fixtures/test-options';
import { user } from '../.auth/user';
import { Helper } from '../utils/Helper';

test.use({ baseURL: 'http://automationexercise.com/' });

test('Test Case 1: Register User', async ({ page }) => {
  // const slider = homePage.locator('#slider-carousel');
  const slider = page.getByRole('heading', { name: 'AutomationExercise' });
  const homeSubtitle = page.getByRole('heading', {
    name: 'Full-Fledged practice website for Automation Engineers',
  });
  const homeMainCategory = page.getByRole('heading', { name: 'Features Items' });
  const carouselImage = page.getByRole('img', { name: 'demo website for practice' });

  // 3. Verify that home page is visible successfully
  await expect(page).toHaveTitle('Automation Exercise');
  await expect(slider).toBeVisible();
  await expect(homeMainCategory).toBeVisible();
  await expect(homeSubtitle).toBeVisible();
  await expect(carouselImage).toBeVisible();

  // 4. Click on 'Signup / Login' button
  await page.getByRole('link', { name: 'Signup / Login' }).click();

  // 5. Verify 'New User Signup!' is visible
  await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();

  const nameField = page.getByRole('textbox', { name: 'Name' });
  const emailAddress = page.locator('[data-qa="signup-email"]');

  // 6. Enter name and email address
  await nameField.fill(user.name);
  await emailAddress.fill(process.env.EMAIL as string);

  // 7. Click 'Signup' button
  await page.getByRole('button', { name: 'Signup' }).click();

  // 8. Verify that 'ENTER ACCOUNT INFORMATION' is visible
  await expect(page.getByText('Enter Account Information')).toBeVisible();

  // 9. Fill details: Title, Name, Email, Password, Date of birth
  await page.getByRole('radio', { name: 'Mr.', exact: true }).click();
  await page.getByRole('textbox', { name: 'Name *', exact: true }).fill(user.name);
  await expect(page.getByRole('textbox', { name: 'Email *', exact: true })).toHaveValue(Helper.getEnvVar('email'));
  await page.getByRole('textbox', { name: 'Password *', exact: true }).fill(Helper.getEnvVar('password'));
  await page.locator('[data-qa="days"]').selectOption(user.birth_date);
  await page.locator('[data-qa="months"]').selectOption(user.birth_month);
  await page.locator('[data-qa="years"]').selectOption(user.birth_year);

  // 10. Select checkbox 'Sign up for our newsletter!'
  await page.getByRole('checkbox', { name: 'Sign up for our newsletter!' }).check();

  // 11. Select checkbox 'Receive special offers from our partners!'
  await page.getByRole('checkbox', { name: 'Receive special offers from our partners!' }).check();

  // 12. Fill details: First name, Last name, Company, Address, Address2, Country, State, City, Zipcode, Mobile Number
  await page.getByRole('textbox', { name: 'First name *' }).fill(user.firstname);
  await page.getByRole('textbox', { name: 'Last name *' }).fill(user.lastname);
  await page.getByRole('textbox', { name: 'Company', exact: true }).fill(user.company);
  await page.getByRole('textbox', { name: 'Address *' }).fill(user.address1);
  await page.getByRole('textbox', { name: 'Address 2' }).fill(user.address2);

  await page.getByLabel('Country *').selectOption('United States');

  await page.getByRole('textbox', { name: 'State *' }).fill(user.state);
  await page.getByRole('textbox', { name: 'City *' }).fill(user.city);
  await page.locator('[data-qa="zipcode"]').fill(user.zipcode);
  await page.getByRole('textbox', { name: 'Mobile Number *' }).fill(user.mobile_number);

  // 13. Click 'Create Account button'
  await page.getByRole('button', { name: 'Create Account' }).click();

  // 14. Verify that 'ACCOUNT CREATED!' is visible
  await expect(page.getByText('Account Created!')).toBeVisible();

  // 15. Click 'Continue' button
  await page.getByRole('link', { name: 'Continue' }).click();

  // 16. Verify that 'Logged in as username' is visible
  await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();

  // 17. Click 'Delete Account' button
  await page.getByRole('link', { name: 'Delete Account' }).click();

  // 18. Verify that 'ACCOUNT DELETED!' is visible and click 'Continue' button
  await expect(page.getByText('Account Deleted!')).toBeVisible();
  await page.getByRole('link', { name: 'Continue' }).click();
});

test('Test Case 2: Login User with correct email and password', async ({ page, manager, createUser }) => {
  const homePage = manager.onHome();
  const signPage = manager.onSign();
  const headerSection = manager.onHeader();

  // 3. Verify that home homePage is visible successfully
  await expect(page).toHaveTitle('Automation Exercise');
  await expect(homePage.selectors.sliderTitle).toBeVisible();
  await expect(homePage.selectors.sliderSubtitle).toBeVisible();
  await expect(homePage.selectors.homeMainCategory).toBeVisible();
  await expect(homePage.selectors.carouselImage).toBeVisible();

  // 4. Click on 'Signup / Login' button
  await manager.goto().sign();

  // 5. Verify 'Login to your account' is visible
  await expect(signPage.selectors.loginHeader).toBeVisible();

  // 6. Enter correct email address and password
  await signPage.selectors.loginEmail.fill(Helper.getEnvVar('email'));
  await signPage.selectors.password.fill(Helper.getEnvVar('password'));

  // 7. Click 'login' button
  await signPage.selectors.loginButton.click();

  // 8. Verify that 'Logged in as username' is visible
  await expect(headerSection.getLoggedIn(user.name)).toBeVisible();

  // 9. Click 'Delete Account' button
  await headerSection.selectors.deleteAccount.click();

  // 10. Verify that 'ACCOUNT DELETED!' is visible
  await expect(signPage.selectors.accountDeleted).toBeVisible();
});


