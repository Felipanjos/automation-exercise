import { test, expect } from '@playwright/test';
import { HTTP_STATUS as STATUS } from '../utils/http-status';
import { productMatcher } from '../matchers/productMatcher';

test.use({ baseURL: 'https://automationexercise.com/api/' });

test('API 1: Get All Products List', async ({ request }) => {
  const start = Date.now();
  const productsResponse = await request.get('productsList');
  const duration = Date.now() - start;
  
  expect(productsResponse.status()).toEqual(STATUS.OK);
  expect(duration).toBeLessThan(2000);
  
  const body = await productsResponse.json();
  const randomProduct = body.products[Math.floor(Math.random() * body.products.length)]

  expect(Array.isArray(body.products)).toBeTruthy();
  expect(body.products.length).toBeGreaterThan(0);

  expect(randomProduct).toMatchObject(productMatcher);
});

// TODO negative tests with invalid endpoint = response shouldn't be 200
