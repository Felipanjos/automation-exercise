import { expect } from '@playwright/test';

export const brandMatcher = {
  id: expect.any(Number),
  brand: expect.any(String),
};
