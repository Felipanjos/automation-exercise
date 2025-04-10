import { test, expect } from '@playwright/test';
import { HTTP } from '../utils/http-status';

import { productMatcher } from '../matchers/productMatcher';
import { brandMatcher } from '../matchers/brandMatcher';

import { timedRequest } from '../utils/timedRequest';
import { Helper } from '../utils/Helper';

test.use({ baseURL: 'https://automationexercise.com/api/' });

// TODO timedRequest KISS

test('API 1: Get All Products List', async ({ request }) => {
  const { response, duration } = await timedRequest(() => request.get('productsList'));

  expect(response.status()).toBe(HTTP.STATUS.OK);
  expect(duration).toBeLessThan(HTTP.RESPONSE_TIME);

  const responseBody = await response.json();
  const productsLength = responseBody.products.length;

  // Validate a random product while checking structure
  const randomProduct = responseBody.products[Helper.getRandomIndexByLength(productsLength)];

  expect(productsLength).toBeGreaterThan(0);
  expect(Array.isArray(responseBody.products)).toBeTruthy();

  expect(responseBody.responseCode).toBe(HTTP.STATUS.OK);

  expect(randomProduct).toMatchObject(productMatcher);
  // TODO negative tests with invalid endpoint = response shouldn't be 200
});

test('API 2: POST To All Products List', async ({ request }) => {
  const response = await request.post('productsList');
  const responseBody = await response.json();

  expect(response.status()).toBe(HTTP.STATUS.OK);
  expect(responseBody.responseCode).toBe(HTTP.STATUS.NOT_SUPPORTED);
  expect(responseBody.message).toBe('This request method is not supported.');
});

test('API 3: Get All Brands List', async ({ request }) => {
  const response = await request.get('brandsList');
  const responseBody = await response.json();
  const randomBrand = responseBody.brands[Helper.getRandomIndexByLength(responseBody.brands.length)];

  expect(response.status()).toBe(HTTP.STATUS.OK);
  expect(responseBody.responseCode).toBe(HTTP.STATUS.OK);

  expect(responseBody.brands.length).toBeGreaterThan(0);
  expect(randomBrand).toMatchObject(brandMatcher);
});
