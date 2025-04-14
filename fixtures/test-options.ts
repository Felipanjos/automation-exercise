import { APIResponse, test as base, expect, Page } from '@playwright/test';
import { HTTP } from '../utils/http-status';
import { user } from '../.auth/user';

export type TestOptions = {
  deleteUser: void;
  ensureCleanUser: void;
  createUser: void;
  homePage: Page;
};

export const test = base.extend<TestOptions>({
  createUser: async ({ request }, use) => {
    await request.post('createAccount', { form: user });
    await use();
  },

  ensureCleanUser: async ({ request }, use) => {
    await request.delete('deleteAccount', {
      form: {
        email: process.env.EMAIL as string,
        password: process.env.password as string,
      },
    });
    await use();
  },

  deleteUser: async ({ request }, use) => {
    await use();
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
  },

  homePage: async ({ page }, use) => {
    await page.goto('https://automationexercise.com/');
    await use(page);
  },
});
