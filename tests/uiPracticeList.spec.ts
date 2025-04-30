import { expect } from '@playwright/test';
import { test } from '../fixtures/test-options';
import { user } from '../.auth/user';
import { Helper } from '../utils/Helper';
import path from 'path';
import fs from 'fs';

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

test('Test Case 2: Login User with correct email and password', async ({ page, pageManager, createThenDeleteUser }) => {
  const homePage = pageManager.onHome();
  const signPage = pageManager.onSign();
  const headerSection = pageManager.onHeader();

  // 3. Verify that home homePage is visible successfully
  homePage.expectToBeVisible();

  // 4. Click on 'Signup / Login' button
  await pageManager.goto().sign();

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

test('Test Case 3: Login User with incorrect email and password', async ({ page, pageManager }) => {
  const homePage = pageManager.onHome();
  const header = pageManager.onHeader();
  const signPage = pageManager.onSign();

  // 3. Verify that home page is visible successfully
  homePage.expectToBeVisible();

  // 4. Click on 'Signup / Login' button
  pageManager.goto().sign();

  // 5. Verify 'Login to your account' is visible
  await expect(signPage.selectors.loginHeader).toBeVisible();

  // 6. Enter incorrect email address and password
  await signPage.selectors.loginEmail.fill('asdkjahsd@aksdjalksdj.com');
  await signPage.selectors.password.fill('(*!@&#(*!@&#');

  // 7. Click 'login' button
  await signPage.selectors.loginButton.click();

  // 8. Verify error 'Your email or password is incorrect!' is visible
  await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
});

test('Test Case 4: Logout User', async ({ page, pageManager, createThenDeleteUser }) => {
  const { homePage, signPage, header } = pageManager.getStarterPageBundle();

  // 3. Verify that home page is visible successfully
  pageManager.onHome().expectToBeVisible();

  // 4. Click on 'Signup / Login' button
  await pageManager.goto().sign();

  // 5. Verify 'Login to your account' is visible
  await expect(signPage.selectors.loginHeader).toBeVisible();

  // 6. Enter correct email address and password
  await signPage.fillLoginEmail(Helper.getEnvVar('email'));
  await signPage.fillPassword(Helper.getEnvVar('password'));

  // 7. Click 'login' button
  await signPage.selectors.loginButton.click();

  // 8. Verify that 'Logged in as username' is visible
  await expect(header.getLoggedIn(user.name)).toBeVisible();

  // 9. Click 'Logout' button
  await page.getByRole('link', { name: 'Logout' }).click();

  // 10. Verify that user is navigated to login page
  await expect(signPage.selectors.loginHeader).toBeVisible();
});

test('Test Case 5: Register User with existing email', async ({ page, pageManager, createThenDeleteUser }) => {
  const { homePage, signPage, header } = pageManager.getStarterPageBundle();

  // 3. Verify that home page is visible successfully
  pageManager.onHome().expectToBeVisible();

  // 4. Click on 'Signup / Login' button
  await pageManager.goto().sign();

  // 5. Verify 'Login to your account' is visible
  await expect(signPage.selectors.signupHeader).toBeVisible();

  // 6. Enter name and already registered email address
  await signPage.fillSignupEmail(Helper.getEnvVar('email'));
  await signPage.fillSignupName(user.name);

  // 7. Click 'Signup' button
  await signPage.selectors.signupButton.click();

  // 8. Verify error 'Email Address already exist!' is visible
  await expect(page.getByText('Email Address already exist!')).toBeVisible();
});

test('Test Case 6: Contact Us Form', async ({ page, pageManager, startAtHomePage }) => {
  const homePage = pageManager.onHome();
  const header = pageManager.onHeader();
  const contactPage = pageManager.onContact();

  // 3. Verify that home page is visible successfully
  await homePage.expectToBeVisible();

  // 4. Click on 'Contact Us' button
  await header.selectors.contactUs.click();

  // 5. Verify 'GET IN TOUCH' is visible
  await expect(page.getByRole('heading', { name: 'Get In Touch' })).toBeVisible();

  // 6. Enter name, email, subject and message
  await contactPage.fillContactForm();

  // 7. Upload file
  await contactPage.selectors.fileInput.setInputFiles(contactPage.file.path);
  await page.screenshot({ path: path.join(__dirname, '../assets/screenshots/inputUpload.png') });

  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toBe('Press OK to proceed!');
    // 9. Click OK button
    await dialog.accept();
  });

  // !! JS binding mess up when accessing page through UI rather than URL, so this wait is to make sure thinks load again
  // 8. Click 'Submit' button
  await contactPage.selectors.submitButton.waitFor({state: 'visible'});
  await contactPage.selectors.submitButton.click();

  // 10. Verify success message 'Success! Your details have been submitted successfully.' is visible
  await expect(contactPage.selectors.successMessage).toBeVisible();

  // 11. Click 'Home' button and verify that landed to home page successfully
  // TODO find a better locator for the home button
  await contactPage.selectors.homeButton.click();
  await homePage.expectToBeVisible();
});

test('Test Case 7: Verify Test Cases Page', async ({ page, pageManager, startAtHomePage }) => {
  // 3. Verify that home page is visible successfully
  await pageManager.onHome().expectToBeVisible();

  // 4. Click on 'Test Cases' button
  const header = pageManager.onHeader();
  await header.selectors.testCases.click();

  // 5. Verify user is navigated to test cases page successfully
  await expect(page.getByRole('heading', { name: 'Test Cases', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Test Case 1: Register User' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Test Case 13: Verify Product quantity in Cart' })).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: "Test Case 26: Verify Scroll Up without 'Arrow' button and Scroll Down functionality",
    })
  ).toBeVisible();
});

test('Test Case 8: Verify All Products and product detail page', async ({ page, pageManager, startAtHomePage }) => {
  const homePage = pageManager.onHome();
  const header = pageManager.onHeader();
  // 3. Verify that home page is visible successfully
  homePage.expectToBeVisible();

  // 4. Click on 'Products' button
  await header.selectors.products.click();

  // 5. Verify user is navigated to ALL PRODUCTS page successfully
  await expect(page.getByRole('img', { name: 'Website for practice' })).toBeVisible();
  expect(page.url()).toContain('/products');

  // 6. The products list is visible
  await expect(page.getByRole('heading', { name: 'All Products' })).toBeVisible();
  await expect(page.locator('div.features_items')).toBeVisible();

  // 7. Click on 'View Product' of first product
  await page
    .locator('div', { has: page.locator('div.single-products') })
    .getByText('View Product')
    .first()
    .click();
  // 8. User is landed to product detail page
  expect(page.url()).toContain('/product_details/1');

  // 9. Verify that detail detail is visible: product name, category, price, availability, condition, brand
  const productInfo = page.locator('.product-information');
  // await expect(productInfo.filter({has}))
  await expect(productInfo.getByRole('heading', { name: 'Blue Top' })).toBeVisible();

  await expect(productInfo.getByText('Rs. 500', { exact: true })).toBeVisible();

  await expect(productInfo.locator('p', { hasText: 'Category:' })).toContainText('Category: Women > Tops');
  await expect(productInfo.locator('p', { hasText: 'Availability:' })).toContainText('Availability: In Stock');
  await expect(productInfo.locator('p', { hasText: 'Condition:' })).toContainText('Condition: New');
  await expect(productInfo.locator('p', { hasText: 'Brand:' })).toContainText('Brand: Polo');
});

test('Test Case 9: Search Product', async ({ page, pageManager, startAtHomePage }) => {
  const homePage = pageManager.onHome();
  const header = pageManager.onHeader();
  const product = pageManager.onProduct();

  // 3. Verify that home page is visible successfully
  await homePage.expectToBeVisible();

  // 4. Click on 'Products' button
  await header.selectors.products.click();

  // 5. Verify user is navigated to ALL PRODUCTS page successfully
  await product.expectToBeVisible();

  // 6. Enter product name in search input and click search button
  await page.getByRole('textbox', { name: 'Search Product' }).fill('Lace Top');
  await page.locator('#submit_search').click();

  // 7. Verify 'SEARCHED PRODUCTS' is visible
  await expect(page.getByRole('heading', { name: 'Searched Products' })).toBeVisible();

  // 8. Verify all the products related to search are visible
  expect(await page.locator('div.single-products p').allTextContents()).toContain('Lace Top For Women');
});

test('Test Case 10: Verify Subscription in home page', async ({ page, pageManager, startAtHomePage }) => {
  const homePage = pageManager.onHome();
  const header = pageManager.onHeader();
  const product = pageManager.onProduct();

  // 3. Verify that home page is visible successfully
  await homePage.expectToBeVisible();

  // 4. Scroll down to footer

  // 5. Verify deliveryAddress 'SUBSCRIPTION
  await expect(page.getByRole('heading', { name: 'Subscription' })).toBeVisible();

  // 6. Enter email address in input and click arrow button
  await page.getByRole('textbox', { name: 'Your email address' }).fill(user.email);
  await page.locator('#subscribe').click();

  // 7. Verify success message 'You have been successfully subscribed!' is visible
  await expect(page.getByText('You have been successfully subscribed!')).toBeVisible();
});

test('Test Case 11: Verify Subscription in Cart page', async ({ page, pageManager, startAtHomePage }) => {
  const homePage = pageManager.onHome();
  const header = pageManager.onHeader();
  const product = pageManager.onProduct();

  // 3. Verify that home page is visible successfully
  await homePage.expectToBeVisible();

  // 4. Click 'Cart' button
  await header.selectors.cart.click();

  // 5. Scroll down to footer
  // 6. Verify deliveryAddress 'SUBSCRIPTIONtoHaveText
  await expect(page.getByRole('heading', { name: 'Subscription' })).toBeVisible();

  // 7. Enter email address in input and click arrow button
  await page.getByRole('textbox', { name: 'Your email address' }).fill(user.email);
  await page.locator('#subscribe').click();

  // 8. Verify success message 'You have been successfully subscribed!' is visible
  await expect(page.getByText('You have been successfully subscribed!')).toBeVisible();
});

test('Test Case 12: Add Products in Cart', async ({ page, pageManager, startAtHomePage }) => {
  const homePage = pageManager.onHome();
  const header = pageManager.onHeader();
  const product = pageManager.onProduct();

  // 3. Verify that home page is visible successfully
  await homePage.expectToBeVisible();

  // 4. Click 'Products' button
  await header.selectors.products.click();

  // 5. Hover over first product and click 'Add to cart'
  const productCards = page.locator('div.single-products');
  const firstProduct = productCards.first();
  const addFirstProduct = firstProduct.locator('.overlay-content > a[data-product-id="1"]');

  await firstProduct.hover();
  await addFirstProduct.waitFor({ state: 'attached' });
  await addFirstProduct.click();

  // 6. Click 'Continue Shopping' button
  await page.getByRole('button', { name: 'Continue Shopping' }).click();

  // 7. Hover over second product and click 'Add to cart'
  const secondProduct = productCards.filter({ has: page.locator('.productinfo > a[data-product-id="2"]') });
  const addSecondProduct = secondProduct.locator('.overlay-content > a[data-product-id="2"]');
  await secondProduct.hover();
  await addSecondProduct.waitFor({ state: 'attached' });
  await addSecondProduct.click();

  // 8. Click 'View Cart' button
  await page.getByRole('link', { name: 'View Cart' }).click();

  // 9. Verify both products are added to Cart
  await expect(page.getByRole('table').locator('#product-1').locator('.cart_description')).toContainText('Blue Top');
  await expect(page.getByRole('table').locator('#product-2').locator('.cart_description')).toContainText('Men Tshirt');

  // 10. Verify their prices, quantity and total price
  await expect(page.getByRole('table').locator('#product-1').locator('.cart_price')).toContainText('Rs. 500');
  await expect(page.getByRole('table').locator('#product-1').locator('.cart_quantity')).toContainText('1');
  await expect(page.getByRole('table').locator('#product-1').locator('.cart_total')).toContainText('Rs. 500');

  await expect(page.getByRole('table').locator('#product-2').locator('.cart_price')).toContainText('Rs. 400');
  await expect(page.getByRole('table').locator('#product-2').locator('.cart_quantity')).toContainText('1');
  await expect(page.getByRole('table').locator('#product-2').locator('.cart_total')).toContainText('Rs. 400');
});

test('Test Case 13: Verify Product quantity in Cart', async ({ page, pageManager, startAtHomePage }) => {
  const homePage = pageManager.onHome();
  const header = pageManager.onHeader();
  const product = pageManager.onProduct();

  // 3. Verify that home page is visible successfully
  await homePage.expectToBeVisible();

  // 4. Click 'View Product' for any product on home page
  await page
    .locator('div', { has: page.locator('div.single-products') })
    .getByText('View Product')
    .first()
    .click();

  // 5. Verify product detail is opened
  expect(page.url()).toContain('/product_details/1');

  // 6. Increase quantity to 4
  await page.getByRole('spinbutton').fill('4');

  // 7. Click 'Add to cart' button
  await page.getByRole('button', { name: 'Add to cart' }).click();

  // 8. Click 'View Cart' button
  await page.getByRole('link', { name: 'View Cart' }).click();

  // 9. Verify that product is displayed in cart page with exact quantity
  await expect(page.getByRole('table').locator('#product-1').locator('.cart_quantity')).toContainText('4');
  await expect(page.getByRole('table').locator('#product-1').locator('.cart_total')).toContainText(`Rs. ${500 * 4}`);
});

test('Test Case 14: Place Order: Register while Checkout', async ({
  page,
  pageManager,
  startAtHomePage,
  ensureCleanUser,
}) => {
  const homePage = pageManager.onHome();
  const header = pageManager.onHeader();
  const product = pageManager.onProduct();
  const signPage = pageManager.onSign();

  // 3. Verify that home page is visible successfully
  await homePage.expectToBeVisible();

  // 4. Add products to cart
  await page
    .locator('div', { has: page.locator('div.single-products') })
    .getByText('View Product')
    .first()
    .click();
  await page.getByRole('spinbutton').fill('4');
  await page.getByRole('button', { name: 'Add to cart' }).click();

  // 5. Click 'Cart' button
  await page.getByRole('link', { name: 'View Cart' }).click();

  // 6. Verify that cart page is displayed
  await expect(page.getByRole('table')).toBeVisible();
  await expect(page.getByText('Shopping Cart')).toBeVisible();

  // 7. Click Proceed To Checkout
  await page.getByText('Proceed To Checkout').click();

  // 8. Click 'Register / Login' button
  await page.getByRole('link', { name: 'Register / Login' }).click();

  // 9. Fill all details in Signup and create account
  await signPage.signUp();

  // 10. Verify 'ACCOUNT CREATED!' and click 'Continue' button
  await expect(page.getByText('Account Created!')).toBeVisible();
  await page.getByRole('link', { name: 'Continue' }).click();

  // 11. Verify ' Logged in as username' at top
  await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();

  // 12.Click 'Cart' button
  await header.selectors.cart.click();

  // 13. Click 'Proceed To Checkout' button
  await page.getByText('Proceed To Checkout').click();

  // 14. Verify Address Details and Review Your Order
  const deliveryAddress = page.locator('#address_delivery');
  await expect(deliveryAddress).toContainText(`${user.title}. ${user.name}`);
  await expect(deliveryAddress).toContainText(user.company);
  await expect(deliveryAddress).toContainText(user.address1);
  await expect(deliveryAddress).toContainText(user.address2);
  await expect(deliveryAddress).toContainText(`${user.state} ${user.city}`);
  await expect(deliveryAddress).toContainText(user.zipcode);
  await expect(deliveryAddress).toContainText(user.country);
  await expect(deliveryAddress).toContainText(user.mobile_number);

  // 15. Enter description in comment text area and click 'Place Order'
  await page.getByText('Place Order').click();

  // 16. Enter payment details: Name on Card, Card Number, CVC, Expiration date
  await page.getByTestId('name-on-card').fill('John Doe');
  await page.getByTestId('card-number').fill('8888444488884444');
  await page.getByTestId('cvc').fill('876');
  await page.getByTestId('expiry-month').fill('10');
  await page.getByTestId('expiry-year').fill('2030');

  // 17. Click 'Pay and Confirm Order' button
  await page.getByRole('button', { name: 'Pay and Confirm Order' }).click();

  // 18. Verify success message 'Your order has been placed successfully!'
  await expect(page.getByText('Congratulations! Your order has been confirmed!')).toBeVisible();

  // 19. Click 'Delete Account' button
  await page.getByRole('link', { name: 'Delete Account' }).click();

  // 20. Verify 'ACCOUNT DELETED!' and click 'Continue' button
  await expect(page.getByText('Account Deleted!')).toBeVisible();
  await page.getByRole('link', { name: 'Continue' }).click();
});

test('Test Case 15: Place Order: Register before Checkout', async ({ page, pageManager, startAtHomePage }) => {
  const homePage = pageManager.onHome();
  const header = pageManager.onHeader();
  const product = pageManager.onProduct();
  const signPage = pageManager.onSign();

  // 3. Verify that home page is visible successfully
  await homePage.expectToBeVisible();

  // 4. Click 'Signup / Login' button
  await pageManager.goto().sign();

  // 5. Fill all details in Signup and create account
  await signPage.signUp();

  // 6. Verify 'ACCOUNT CREATED!' and click 'Continue' button
  await expect(page.getByText('Account Created!')).toBeVisible();
  await page.getByRole('link', { name: 'Continue' }).click();

  // 7. Verify ' Logged in as username' at top
  await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();

  // 8. Add products to cart
  await page
    .locator('div', { has: page.locator('div.single-products') })
    .getByText('View Product')
    .first()
    .click();
  await page.getByRole('spinbutton').fill('4');
  await page.getByRole('button', { name: 'Add to cart' }).click();

  // 9. Click 'Cart' button
  await header.selectors.cart.click();

  // 10. Verify that cart page is displayed
  await expect(page.getByRole('table')).toBeVisible();
  await expect(page.getByText('Shopping Cart')).toBeVisible();

  // 11. Click Proceed To Checkout
  await page.getByText('Proceed To Checkout').click();

  // 12. Verify Address Details and Review Your Order
  const deliveryAddress = page.locator('#address_delivery');
  await expect(deliveryAddress).toContainText(`${user.title}. ${user.name}`);
  await expect(deliveryAddress).toContainText(user.company);
  await expect(deliveryAddress).toContainText(user.address1);
  await expect(deliveryAddress).toContainText(user.address2);
  await expect(deliveryAddress).toContainText(`${user.state} ${user.city}`);
  await expect(deliveryAddress).toContainText(user.zipcode);
  await expect(deliveryAddress).toContainText(user.country);
  await expect(deliveryAddress).toContainText(user.mobile_number);

  // 13. Enter description in comment text area and click 'Place Order'
  await page.getByText('Place Order').click();

  // 14. Enter payment details: Name on Card, Card Number, CVC, Expiration date
  await page.getByTestId('name-on-card').fill('John Doe');
  await page.getByTestId('card-number').fill('8888444488884444');
  await page.getByTestId('cvc').fill('876');
  await page.getByTestId('expiry-month').fill('10');
  await page.getByTestId('expiry-year').fill('2030');

  // 15. Click 'Pay and Confirm Order' button
  await page.getByRole('button', { name: 'Pay and Confirm Order' }).click();

  // 16. Verify success message 'Your order has been placed successfully!'
  await expect(page.getByText('Congratulations! Your order has been confirmed!')).toBeVisible();

  // 17. Click 'Delete Account' button
  await page.getByRole('link', { name: 'Delete Account' }).click();

  // 18. Verify 'ACCOUNT DELETED!' and click 'Continue' button
  await page.getByRole('link', { name: 'Continue' }).click();
});

test('Test Case 16: Place Order: Login before Checkout', async ({ page, pageManager, startAtHomePage, createUser }) => {
  const homePage = pageManager.onHome();
  const header = pageManager.onHeader();
  const product = pageManager.onProduct();
  const signPage = pageManager.onSign();

  // 3. Verify that home page is visible successfully
  await homePage.expectToBeVisible();

  // 4. Click 'Signup / Login' button
  await pageManager.goto().sign();

  // 5. Fill email, password and click 'Login' button
  await signPage.selectors.loginEmail.fill(Helper.getEnvVar('email'));
  await signPage.selectors.password.fill(Helper.getEnvVar('password'));
  await signPage.selectors.loginButton.click();

  // 7. Verify ' Logged in as username' at top
  await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();

  // 8. Add products to cart
  await page
    .locator('div', { has: page.locator('div.single-products') })
    .getByText('View Product')
    .first()
    .click();
  await page.getByRole('spinbutton').fill('4');
  await page.getByRole('button', { name: 'Add to cart' }).click();

  // 9. Click 'Cart' button
  await header.selectors.cart.click();

  // 10. Verify that cart page is displayed
  await expect(page.getByRole('table')).toBeVisible();
  await expect(page.getByText('Shopping Cart')).toBeVisible();

  // 11. Click Proceed To Checkout
  await page.getByText('Proceed To Checkout').click();

  // 12. Verify Address Details and Review Your Order
  const deliveryAddress = page.locator('#address_delivery');
  await expect(deliveryAddress).toContainText(`${user.title}. ${user.name}`);
  await expect(deliveryAddress).toContainText(user.company);
  await expect(deliveryAddress).toContainText(user.address1);
  await expect(deliveryAddress).toContainText(user.address2);
  await expect(deliveryAddress).toContainText(`${user.state} ${user.city}`);
  await expect(deliveryAddress).toContainText(user.zipcode);
  await expect(deliveryAddress).toContainText(user.country);
  await expect(deliveryAddress).toContainText(user.mobile_number);

  // 13. Enter description in comment text area and click 'Place Order'
  await page.getByText('Place Order').click();

  // 14. Enter payment details: Name on Card, Card Number, CVC, Expiration date
  await page.getByTestId('name-on-card').fill('John Doe');
  await page.getByTestId('card-number').fill('8888444488884444');
  await page.getByTestId('cvc').fill('876');
  await page.getByTestId('expiry-month').fill('10');
  await page.getByTestId('expiry-year').fill('2030');

  // 15. Click 'Pay and Confirm Order' button
  await page.getByRole('button', { name: 'Pay and Confirm Order' }).click();

  // 16. Verify success message 'Your order has been placed successfully!'
  await expect(page.getByText('Congratulations! Your order has been confirmed!')).toBeVisible();

  // 17. Click 'Delete Account' button
  await page.getByRole('link', { name: 'Delete Account' }).click();

  // 18. Verify 'ACCOUNT DELETED!' and click 'Continue' button
  await page.getByRole('link', { name: 'Continue' }).click();
});

test('Test Case 17: Remove Products From Cart', async ({ page, pageManager, startAtHomePage }) => {
  const homePage = pageManager.onHome();
  const header = pageManager.onHeader();
  const product = pageManager.onProduct();
  const signPage = pageManager.onSign();

  // 3. Verify that home page is visible successfully
  await homePage.expectToBeVisible();
  // 8. Add products to cart
  await page
    .locator('div', { has: page.locator('div.single-products') })
    .getByText('View Product')
    .first()
    .click();
  await page.getByRole('spinbutton').fill('4');
  await page.getByRole('button', { name: 'Add to cart' }).click();

  // 9. Click 'Cart' button
  await page.getByRole('link', { name: 'View Cart' }).click();

  // 10. Verify that cart page is displayed
  await expect(page.getByRole('table')).toBeVisible();
  await expect(page.getByText('Shopping Cart')).toBeVisible();

  // 7. Click 'X' button corresponding to particular product
  await page.locator('[data-product-id="1"]').click();

  // 8. Verify that product is removed from the cart
  await expect(page.getByText('Cart is empty! Click here to buy products.')).toBeVisible();
});

test('Test Case 18: View Category Products', async ({ page, pageManager, startAtHomePage }) => {
  const homePage = pageManager.onHome();
  const header = pageManager.onHeader();
  const product = pageManager.onProduct();
  const signPage = pageManager.onSign();

  // 3. Verify that home page is visible successfully
  await homePage.expectToBeVisible();

  // 4. Click on 'Women' category
  const categoryMenu = page.locator('#accordian');
  await categoryMenu.getByRole('heading', { name: 'Women' }).locator('.pull-right').click();

  // 5. Click on any category link under 'Women' category, for example: Dress
  await page.locator('#Women').waitFor({ state: 'attached' });
  await page.locator('#Women').getByText('Tops').click();

  // 6. Verify that category page is displayed and confirm text 'WOMEN - TOPS PRODUCTS'
  await expect(page.getByRole('heading', { name: 'Women - Tops Products' })).toBeVisible();

  // 7. On left side bar, click on any sub-category link of 'Men' category
  await categoryMenu.locator('a[href="#Men"]').click();
  await page.locator('#Men').waitFor({ state: 'attached' });
  await page.locator('#Men').getByText('Tshirts').click();

  // 8. Verify that user is navigated to that category page
  await expect(page.getByRole('heading', { name: 'Men - Tshirts Products' })).toBeVisible();
});

test('Test Case 19: View & Cart Brand Products', async ({ page, pageManager, startAtHomePage }) => {
  // 3. Click on 'Products' button
  const homePage = pageManager.onHome();
  const header = pageManager.onHeader();
  const product = pageManager.onProduct();
  const signPage = pageManager.onSign();

  // 3. Verify that home page is visible successfully
  await homePage.expectToBeVisible();

  // 4. Verify that Brands are visible on left side bar
  const brandsCard = page.locator('.brands-name');
  await expect(page.getByRole('heading', { name: 'Brands' })).toBeVisible();
  await expect(brandsCard).toBeVisible();

  // 5. Click on any brand name
  await brandsCard.getByRole('link', { name: 'Biba' }).click();

  // 6. Verify that user is navigated to brand page and brand products are displayed
  await expect(page.getByRole('heading', { name: 'Brand - Biba Products' })).toBeVisible();

  // 7. On left side bar, click on any other brand link
  await brandsCard.getByRole('link', { name: 'Madame' }).click();

  // 8. Verify that user is navigated to that brand page and can see products
  await expect(page.getByRole('heading', { name: 'Brand - Madame Products' })).toBeVisible();
});

test('Test Case 20: Search Products and Verify Cart After Login', async ({ page, pageManager, startAtHomePage }) => {
  const homePage = pageManager.onHome();
  const header = pageManager.onHeader();
  const product = pageManager.onProduct();
  const signPage = pageManager.onSign();
  // 3. Click on 'Products' button
  await header.selectors.products.click();

  // 4. Verify user is navigated to ALL PRODUCTS page successfully
  await expect(page.getByRole('img', { name: 'Website for practice' })).toBeVisible();
  expect(page.url()).toContain('/products');

  // 5. Enter product name in search input and click search button
  await page.getByRole('textbox', { name: 'Search Product' }).fill('Lace Top');
  await page.locator('#submit_search').click();

  // 6. Verify 'SEARCHED PRODUCTS' is visible
  await expect(page.getByRole('heading', { name: 'Searched Products' })).toBeVisible();

  // 7. Verify all the products related to search are visible
  expect(await page.locator('div.single-products p').allTextContents()).toContain('Lace Top For Women');

  // 8. Add those products to cart
  await page
    .locator('div', { has: page.locator('div.single-products') })
    .getByText('View Product')
    .first()
    .click();
  await page.getByRole('button', { name: 'Add to cart' }).click();

  // 9. Click 'Cart' button and verify that products are visible in cart
  await page.getByRole('link', { name: 'View Cart' }).click();
  await page.getByRole('table').waitFor({ state: 'attached' });
  await expect(page.getByRole('table').locator('tr > .cart_description')).toContainText('Lace Top For Women');

  // 10. Click 'Signup / Login' button and submit login details
  await pageManager.goto().sign();
  await signPage.selectors.loginEmail.fill(Helper.getEnvVar('email'));
  await signPage.selectors.password.fill(Helper.getEnvVar('password'));
  await signPage.selectors.loginButton.click();

  // 11. Again, go to Cart page
  await header.selectors.cart.click();

  // 12. Verify that those products are visible in cart after login as well
  await expect(page.getByRole('table').locator('tr > .cart_description')).toContainText('Lace Top For Women');
});

test('Test Case 21: Add review on product', async ({ page, pageManager, startAtHomePage }) => {
  const homePage = pageManager.onHome();
  const header = pageManager.onHeader();
  const product = pageManager.onProduct();
  const signPage = pageManager.onSign();
  // 3. Click on 'Products' button
  await header.selectors.products.click();

  // 4. Verify user is navigated to ALL PRODUCTS page successfully
  await expect(page.getByRole('img', { name: 'Website for practice' })).toBeVisible();
  expect(page.url()).toContain('/products');

  // 5. Click on 'View Product' button
  await page
    .locator('div', { has: page.locator('div.single-products') })
    .getByText('View Product')
    .first()
    .click();

  // 6. Verify 'Write Your Review' is visible
  await expect(page.getByText('Write Your Review')).toBeVisible();

  // 7. Enter name, email and review
  await page.getByRole('textbox', { name: 'Your Name' }).fill(user.name);
  await page.getByRole('textbox', { name: 'Email Address', exact: true }).fill(user.email);
  await page.getByRole('textbox', { name: 'Add Review Here!' }).fill('Super Lorem Ipsum');

  // 8. Click 'Submit' button
  await page.getByRole('button', { name: 'Submit' }).click();

  // 9. Verify success message 'Thank you for your review.'
  await expect(page.getByText('Thank you for your review.')).toBeVisible();
});

test('Test Case 22: Add to cart from Recommended items', async ({ page, pageManager, startAtHomePage }) => {
  const homePage = pageManager.onHome();
  const header = pageManager.onHeader();
  const product = pageManager.onProduct();
  const signPage = pageManager.onSign();

  // 3. Scroll to bottom of page

  // 4. Verify 'RECOMMENDED ITEMS' are visible
  await expect(page.locator('.recommended_items')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'recommended items' })).toBeVisible();

  // 5. Click on 'Add To Cart' on Recommended product
  const recommendedItemsSlider = page.locator('#recommended-item-carousel');
  await page.locator('#recommended-item-carousel').hover();
  const productDesc = await recommendedItemsSlider.locator('.active p').first().textContent();
  await recommendedItemsSlider.locator('.active :text-is("Add to cart")').first().click();

  // 6. Click on 'View Cart' button
  await page.getByRole('link', { name: 'View Cart' }).click();

  // 7. Verify that product is displayed in cart page
  await expect(page.getByRole('table').locator('tr > .cart_description')).toContainText(productDesc as string);
});

test('Test Case 24: Download Invoice after purchase order', async ({
  page,
  pageManager,
  startAtHomePage,
  ensureCleanUser,
}) => {
  // 3. Click on 'Products' button
  const homePage = pageManager.onHome();
  const header = pageManager.onHeader();
  const product = pageManager.onProduct();
  const signPage = pageManager.onSign();

  // 3. Verify that home page is visible successfully
  await homePage.expectToBeVisible();
  // 8. Add products to cart
  await page
    .locator('div', { has: page.locator('div.single-products') })
    .getByText('View Product')
    .first()
    .click();
  await page.getByRole('spinbutton').fill('4');
  await page.getByRole('button', { name: 'Add to cart' }).click();

  // 9. Click 'Cart' button
  await page.getByRole('link', { name: 'View Cart' }).click();

  // 10. Verify that cart page is displayed
  await expect(page.getByRole('table')).toBeVisible();
  await expect(page.getByText('Shopping Cart')).toBeVisible();

  // 11. Click Proceed To Checkout
  await page.getByText('Proceed To Checkout').click();

  // 8. Click 'Register / Login' button
  await page.getByRole('link', { name: 'Register / Login' }).click();

  // 9. Fill all details in Signup and create account
  await signPage.signUp();

  // 14. Verify that 'ACCOUNT CREATED!' is visible
  await expect(page.getByText('Account Created!')).toBeVisible();

  // 15. Click 'Continue' button
  await page.getByRole('link', { name: 'Continue' }).click();

  // 11. Verify ' Logged in as username' at top
  await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();

  // 12.Click 'Cart' button
  await header.selectors.cart.click();

  // 13. Click 'Proceed To Checkout' button
  await page.getByText('Proceed To Checkout').click();

  // 14. Verify Address Details and Review Your Order
  const deliveryAddress = page.locator('#address_delivery');
  await expect(deliveryAddress).toContainText(`${user.title}. ${user.name}`);
  await expect(deliveryAddress).toContainText(user.company);
  await expect(deliveryAddress).toContainText(user.address1);
  await expect(deliveryAddress).toContainText(user.address2);
  await expect(deliveryAddress).toContainText(`${user.state} ${user.city}`);
  await expect(deliveryAddress).toContainText(user.zipcode);
  await expect(deliveryAddress).toContainText(user.country);
  await expect(deliveryAddress).toContainText(user.mobile_number);

  // 13. Enter description in comment text area and click 'Place Order'
  await page.getByText('Place Order').click();

  // 14. Enter payment details: Name on Card, Card Number, CVC, Expiration date
  await page.getByTestId('name-on-card').fill('John Doe');
  await page.getByTestId('card-number').fill('8888444488884444');
  await page.getByTestId('cvc').fill('876');
  await page.getByTestId('expiry-month').fill('10');
  await page.getByTestId('expiry-year').fill('2030');

  // 15. Click 'Pay and Confirm Order' button
  await page.getByRole('button', { name: 'Pay and Confirm Order' }).click();

  // 16. Verify success message 'Your order has been placed successfully!'
  await expect(page.getByText('Congratulations! Your order has been confirmed!')).toBeVisible();

  // 19. Click 'Download Invoice' button and verify invoice is downloaded successfully.
  page.on('download', async (download) => {
    const downloadPath = path.join(`${__dirname}/../assets/`, 'downloads', download.suggestedFilename());
    await download.saveAs(downloadPath);
    expect(fs.existsSync(downloadPath)).toBeTruthy();
  });
  await page.getByText('Download Invoice').click();

  // 20. Click 'Continue' button
  await page.getByRole('link', { name: 'Continue' }).click();

  // 17. Click 'Delete Account' button
  await page.getByRole('link', { name: 'Delete Account' }).click();

  // 18. Verify 'ACCOUNT DELETED!' and click 'Continue' button
  await page.getByRole('link', { name: 'Continue' }).click();
});

test('Test Case 25: Verify Scroll Up using "Arrow" button and Scroll Down functionality', async ({
  page,
  pageManager,
  startAtHomePage,
}) => {
  // 3. Click on 'Products' button
  const homePage = pageManager.onHome();
  const header = pageManager.onHeader();
  const product = pageManager.onProduct();
  const signPage = pageManager.onSign();

  // 3. Verify that home page is visible successfully
  await homePage.expectToBeVisible();

  // 4. Scroll down page to bottom
  await page.getByText('Copyright © 2021 All rights reserved').hover();
  
  // 5. Verify 'SUBSCRIPTION' is visible
  await expect(page.getByRole('heading', { name: 'Subscription' })).toBeVisible();
  
  // 6. Click on arrow at bottom right side to move upward
  await page.locator('#scrollUp').click();
  
  // 7. Verify that page is scrolled up and 'Full-Fledged practice website for Automation Engineers' text is visible on screen
  await expect(homePage.selectors.sliderSubtitle).toBeVisible();
});
