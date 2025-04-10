import { test, expect } from '@playwright/test';
import { HTTP } from '../utils/http-status';
import { productMatcher } from '../matchers/productMatcher';
import { timedRequest } from '../utils/timedRequest';

test.use({ baseURL: 'https://automationexercise.com/api/' });

test('API 1: Get All Products List', async ({ request }) => {
  const { response: productsResponse, duration } = await timedRequest(() => request.get('productsList'));

  expect(productsResponse.status()).toBe(HTTP.STATUS.OK);
  expect(duration).toBeLessThan(HTTP.RESPONSE_TIME);

  const body = await productsResponse.json();

  // Validate a random product while checking structure
  const randomProduct = body.products[Math.floor(Math.random() * body.products.length)];

  expect(Object.keys(body).length).toBeGreaterThan(0);
  expect(body.products.length).toBeGreaterThan(0);
  expect(body).toHaveProperty('responseCode');
  expect(body.responseCode).toBe(HTTP.STATUS.OK);
  expect(Array.isArray(body.products)).toBeTruthy();
  expect(randomProduct).toMatchObject(productMatcher);
});

// TODO negative tests with invalid endpoint = response shouldn't be 200
