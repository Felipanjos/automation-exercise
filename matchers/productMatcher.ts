// types/Product.ts
import { expect } from '@playwright/test';

export const productMatcher = {
  id: expect.any(Number),
  name: expect.any(String),
  price: expect.any(String),
  brand: expect.any(String),
  category: {
    usertype: {
      usertype: expect.any(String),
    },
    category: expect.any(String),
  },
};
