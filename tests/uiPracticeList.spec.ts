import { expect } from '@playwright/test';
import { test } from '../fixtures/test-options';
import { user } from '../.auth/user';
import { Helper } from '../utils/Helper';

test.use({ baseURL: 'http://automationexercise.com/' });

test('Test Case 1: Register User', async ({ homePage }) => {
  // const slider = homePage.locator('#slider-carousel');
  const slider = homePage.getByRole('heading', { name: 'AutomationExercise' });
  const homeSubtitle = homePage.getByRole('heading', {
    name: 'Full-Fledged practice website for Automation Engineers',
  });
  const homeMainCategory = homePage.getByRole('heading', { name: 'Features Items' });
  const carouselImage = homePage.getByRole('img', { name: 'demo website for practice' });

  // 3. Verify that home homePage is visible successfully
  await expect(homePage).toHaveTitle('Automation Exercise');
  await expect(slider).toBeVisible();
  await expect(homeMainCategory).toBeVisible();
  await expect(homeSubtitle).toBeVisible();
  await expect(carouselImage).toBeVisible();

  // 4. Click on 'Signup / Login' button
  await homePage.getByRole('link', { name: 'Signup / Login' }).click();

  // 5. Verify 'New User Signup!' is visible
  await expect(homePage.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();

  const nameField = homePage.getByRole('textbox', { name: 'Name' });
  const emailAddress = homePage.locator('[data-qa="signup-email"]');

  // 6. Enter name and email address
  await nameField.fill(user.name);
  await emailAddress.fill(process.env.EMAIL as string);

  // 7. Click 'Signup' button
  await homePage.getByRole('button', { name: 'Signup' }).click();

  // 8. Verify that 'ENTER ACCOUNT INFORMATION' is visible
  await expect(homePage.getByText('Enter Account Information')).toBeVisible();

  // 9. Fill details: Title, Name, Email, Password, Date of birth
  await homePage.getByRole('radio', { name: 'Mr.', exact: true }).click();
  await homePage.getByRole('textbox', { name: 'Name *', exact: true }).fill(user.name);
  await expect(homePage.getByRole('textbox', { name: 'Email *', exact: true })).toHaveValue(Helper.getEnvVar('EMAIL'));
  await homePage.getByRole('textbox', { name: 'Password *', exact: true }).fill(Helper.getEnvVar('PASSWORD'));
  await homePage.locator('[data-qa="days"]').selectOption(user.birth_date);
  await homePage.locator('[data-qa="months"]').selectOption(user.birth_month);
  await homePage.locator('[data-qa="years"]').selectOption(user.birth_year);

  // 10. Select checkbox 'Sign up for our newsletter!'
  await homePage.getByRole('checkbox', { name: 'Sign up for our newsletter!' }).check();

  // 11. Select checkbox 'Receive special offers from our partners!'
  await homePage.getByRole('checkbox', { name: 'Receive special offers from our partners!' }).check();

  // 12. Fill details: First name, Last name, Company, Address, Address2, Country, State, City, Zipcode, Mobile Number
  await homePage.getByRole('textbox', { name: 'First name *' }).fill(user.firstname);
  await homePage.getByRole('textbox', { name: 'Last name *' }).fill(user.lastname);
  await homePage.getByRole('textbox', { name: 'Company', exact: true }).fill(user.company);
  await homePage.getByRole('textbox', { name: 'Address *' }).fill(user.address1);
  await homePage.getByRole('textbox', { name: 'Address 2' }).fill(user.address2);

  await homePage.getByLabel('Country *').selectOption('United States');

  await homePage.getByRole('textbox', { name: 'State *' }).fill(user.state);
  await homePage.getByRole('textbox', { name: 'City *' }).fill(user.city);
  await homePage.locator('[data-qa="zipcode"]').fill(user.zipcode);
  await homePage.getByRole('textbox', { name: 'Mobile Number *' }).fill(user.mobile_number);

  // 13. Click 'Create Account button'
  await homePage.getByRole('button', { name: 'Create Account' }).click();

  // 14. Verify that 'ACCOUNT CREATED!' is visible
  await expect(homePage.getByText('Account Created!')).toBeVisible();

  // 15. Click 'Continue' button
  await homePage.getByRole('link', { name: 'Continue' }).click();

  // 16. Verify that 'Logged in as username' is visible
  await expect(homePage.getByText(`Logged in as ${user.name}`)).toBeVisible();

  // 17. Click 'Delete Account' button
  await homePage.getByRole('link', { name: 'Delete Account' }).click();

  // 18. Verify that 'ACCOUNT DELETED!' is visible and click 'Continue' button
  await expect(homePage.getByText('Account Deleted!')).toBeVisible();
  await homePage.getByRole('link', { name: 'Continue' }).click();
});

test('Test Case 2: Login User with correct email and password', async ({ homePage }) => {
  // const slider = homePage.locator('#slider-carousel');
  const slider = homePage.getByRole('heading', { name: 'AutomationExercise' });
  const homeSubtitle = homePage.getByRole('heading', {
    name: 'Full-Fledged practice website for Automation Engineers',
  });
  const homeMainCategory = homePage.getByRole('heading', { name: 'Features Items' });
  const carouselImage = homePage.getByRole('img', { name: 'demo website for practice' });

  // 3. Verify that home homePage is visible successfully
  await expect(homePage).toHaveTitle('Automation Exercise');
  await expect(slider).toBeVisible();
  await expect(homeMainCategory).toBeVisible();
  await expect(homeSubtitle).toBeVisible();
  await expect(carouselImage).toBeVisible();

  // 4. Click on 'Signup / Login' button
  await homePage.getByRole('link', { name: 'Signup / Login' }).click();

  // 5. Verify 'Login to your account' is visible
  await expect(homePage.getByRole('heading', { name: 'Login to your account' })).toBeVisible();

  // 6. Enter correct email address and password
  const nameField = homePage.getByRole('textbox', { name: 'Name' });
  const emailAddress = homePage.locator('[data-qa="signup-email"]');

  // 6. Enter name and email address
  await nameField.fill(user.name);
  await emailAddress.fill(process.env.EMAIL as string);

  // 7. Click 'login' button
  // 8. Verify that 'Logged in as username' is visible
  // 9. Click 'Delete Account' button
  // 10. Verify that 'ACCOUNT DELETED!' is visible
});
