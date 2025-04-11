import { test, expect } from '@playwright/test';
import { HTTP } from '../utils/http-status';

import { productMatcher } from '../matchers/productMatcher';
import { brandMatcher } from '../matchers/brandMatcher';

import { timedRequest } from '../utils/timedRequest';
import { Helper } from '../utils/Helper';
import { user } from '../.auth/user.ts';

test.use({ baseURL: 'https://automationexercise.com/api/' });

// TODO timedRequest KISS

test('API 1: Get All Products List', async ({ request }) => {
  const { response, duration } = await timedRequest(() => request.get('productsList'));

  expect(response.status()).toBe(HTTP.STATUS.OK);
  expect(duration).toBeLessThan(HTTP.RESPONSE_TIME);

  const responseBody = await response.json();
  const productsLength = responseBody.products.length;

  // Validate a random product while checking structure
  const randomProduct = Helper.getRandomItem(responseBody.products);

  expect(productsLength).toBeGreaterThan(0);
  expect(Array.isArray(responseBody.products)).toBeTruthy();

  expect(responseBody.responseCode).toBe(HTTP.STATUS.OK);

  expect(randomProduct).toMatchObject(productMatcher);
  // TODO negative tests with invalid endpoint = response shouldn't be 200
});

test('API 2: POST To All Products List', async ({ request }) => {
  // TODO tag negative test
  const response = await request.post('productsList');
  const responseBody = await response.json();

  expect(response.status()).toBe(HTTP.STATUS.OK);
  expect(responseBody.responseCode).toBe(HTTP.STATUS.NOT_SUPPORTED);
  expect(responseBody.message).toBe('This request method is not supported.');
});

test('API 3: Get All Brands List', async ({ request }) => {
  // TODO tag negative test
  const response = await request.get('brandsList');
  const responseBody = await response.json();
  const randomBrand = Helper.getRandomItem(responseBody.brands);

  expect(response.status()).toBe(HTTP.STATUS.OK);
  expect(responseBody.responseCode).toBe(HTTP.STATUS.OK);

  expect(responseBody.brands.length).toBeGreaterThan(0);
  expect(randomBrand).toMatchObject(brandMatcher);
});

test('API 4: PUT To All Brands List', async ({ request }) => {
  const response = await request.put('brandsList');
  const responseBody = await response.json();

  expect(response.status()).toBe(HTTP.STATUS.OK);
  expect(responseBody.responseCode).toBe(HTTP.STATUS.NOT_SUPPORTED);
  expect(responseBody.message).toBe('This request method is not supported.');
});

test('API 5: POST To Search Product', async ({ request }) => {
  // ! This fails due to weid API composition, like product "Sleeves Top and Short - Blue & Pink" in category "Dress"
  // TODO divide responsibilities on the test

  let response, responseBody, products, matchPattern;

  const getAllProductsResponse = await request.get('productsList');
  const getAllProductsResponseBody = await getAllProductsResponse.json();

  const allProducts = getAllProductsResponseBody.products;
  const allCategories: string[] = allProducts.map((p) => p.category.category);
  const uniqueCategories = [...new Set(allCategories)];

  const categoryKeywords = {
    Tops: /top/i,
    'Tops & Shirts': /top|shirt/i,
    Tshirts: /t-shirt|t shirt|tshirt/i,
  };

  for (let category of uniqueCategories) {
    response = await request.post('searchProduct', {
      form: {
        search_product: category,
      },
    });
    responseBody = await response.json();
    products = responseBody.products;

    expect(products.length).toBeGreaterThan(0);
    expect(response.status()).toBe(HTTP.STATUS.OK);
    expect(responseBody.responseCode).toBe(HTTP.STATUS.OK);

    for (let product of products) {
      test.step(`Asserting products for category: ${category}`, async () => {
        const matchPattern = categoryKeywords[category] || new RegExp(category, 'i');

        expect.soft(product.name, `Product: ${product.name} in ${category}`).toMatch(matchPattern);
        expect(product.category.category).toMatch(matchPattern);
      });
    }
  }
});

test('API 6: POST To Search Product without search_product parameter', async ({ request }) => {
  // TODO negative tests with blank data = response shouldn't be 200
  const response = await request.post('searchProduct');
  const responseBody = await response.json();

  expect(response.status()).toBe(HTTP.STATUS.OK);
  expect(responseBody.responseCode).toBe(HTTP.STATUS.BAD_REQUEST);
  expect(responseBody.message).toBe('Bad request, search_product parameter is missing in POST request.');
});

test('API 7: POST To Verify Login with valid details', async ({ request }) => {
  const response = await request.post('verifyLogin', {
    form: {
      email: process.env.EMAIL as string,
      password: process.env.PASSWORD as string,
    },
  });
  const responseBody = await response.json();

  expect(response.status()).toBe(HTTP.STATUS.OK);
  expect(responseBody.responseCode).toBe(HTTP.STATUS.OK);
  expect(responseBody.message).toBe('User exists!');
});

test('API 8: POST To Verify Login without email parameter', async ({ request }) => {
  const response = await request.post('verifyLogin', {
    form: {
      password: process.env.PASSWORD as string,
    },
  });
  const responseBody = await response.json();

  expect(response.status()).toBe(HTTP.STATUS.OK);
  expect(responseBody.responseCode).toBe(HTTP.STATUS.BAD_REQUEST);
  expect(responseBody.message).toBe('Bad request, email or password parameter is missing in POST request.');
});

test('API 9: DELETE To Verify Login', async ({ request }) => {
  const response = await request.delete('verifyLogin');
  const responseBody = await response.json();

  expect(response.status()).toBe(HTTP.STATUS.OK);
  expect(responseBody.responseCode).toBe(HTTP.STATUS.NOT_SUPPORTED);
  expect(responseBody.message).toBe('This request method is not supported.');
});

test('API 10: POST To Verify Login with invalid details', async ({ request }) => {
  const response = await request.post('verifyLogin', {
    form: {
      email: 'invalid!@*#(&!@*#&(!*@#&',
      password: 'invalid!@(#)*!@(#*!)@#',
    },
  });
  const responseBody = await response.json();

  expect(response.status()).toBe(HTTP.STATUS.OK);
  expect(responseBody.responseCode).toBe(HTTP.STATUS.NOT_FOUND);
  expect(responseBody.message).toBe('User not found!');
});

test('API 11: POST To Create/Register User Account', async ({ request }) => {
  const response = await request.post('createAccount', { form: user });
  const responseBody = await response.json();

  expect(response.status()).toBe(HTTP.STATUS.OK);
  expect(responseBody.responseCode).toBe(HTTP.STATUS.CREATED);
  expect(responseBody.message).toBe('User created!');
  // TODO use fixtures to teardown user after
});

test('API 12: DELETE METHOD To Delete User Account', async ({ request }) => {
  const response = await request.delete('deleteAccount', {
    form: {
      email: process.env.EMAIL as string,
      password: process.env.password as string,
    },
  });

  const responseBody = await response.json();

  expect(response.status()).toBe(HTTP.STATUS.OK);
  expect(responseBody.responseCode).toBe(HTTP.STATUS.OK);
  expect(responseBody.message).toBe('Account deleted!');
});

test('API 12.5: DELETE METHOD To Delete User Account', async ({ request }) => {
  const response = await request.delete('deleteAccount', {
    form: {
      email: process.env.EMAIL as string,
      password: process.env.password as string,
    },
  });

  const responseBody = await response.json();

  expect(response.status()).toBe(HTTP.STATUS.OK);
  expect(responseBody.responseCode).toBe(HTTP.STATUS.NOT_FOUND);
  expect(responseBody.message).toBe('Account not found!');
});

test('API 14: GET user account detail by email', async ({ request }) => {
  const response = await request.get(`getUserDetailByEmail?email=${process.env.EMAIL}`);
  const responseBody = await response.json();

  expect(response.status()).toBe(HTTP.STATUS.OK);
  expect(responseBody.responseCode).toBe(HTTP.STATUS.OK);
  expect(responseBody.user).toEqual(user);
});
