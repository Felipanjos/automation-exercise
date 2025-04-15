import { test as base, expect, Page } from '@playwright/test';
import { HTTP } from '../utils/http-status';
import { user } from '../.auth/user';
import { PageManager } from '../page/PageManager';
import { Home } from '../page/Home';

export type TestOptions = {
  deleteUser: void;
  ensureCleanUser: void;
  createUser: void;
  manager: PageManager;
  pageManager: PageManager;
  apiURL: string
};

export const test = base.extend<TestOptions>({
  apiURL: ['https://automationexercise.com/api', {option: true}],

  createUser: async ({ request, apiURL }, use) => {
    await request.post(`${apiURL}/createAccount`, { form: user });
    await use();
  },

  ensureCleanUser: async ({ request, apiURL }, use) => {
    await request.delete(`${apiURL}/deleteAccount`, {
      form: {
        email: process.env.EMAIL as string,
        password: process.env.password as string,
      },
    });
    await use();
  },

  deleteUser: async ({ request, apiURL }, use) => {
    await use();
    const response = await request.delete(`${apiURL}/deleteAccount`, {
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

  manager: async ({ page }, use) => {
    const pm = new PageManager(page);
    await pm.goto().home();
    await use(pm);
  },

  pageManager: async ({ page }, use) => {
    await use(new PageManager(page));
  },
});
