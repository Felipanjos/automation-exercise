import { Locator, Page } from '@playwright/test';

export class Header {
  readonly page: Page;
  readonly selectors: { [key: string]: Locator };

  constructor(page: Page) {
    this.page = page;

    this.selectors = {
      deleteAccount: page.getByRole('link', { name: 'Delete Account' }),
      contactUs: page.getByRole('link', { name: 'Contact us' }),
      home: page.getByRole('link', { name: 'Home' }),
      testCases: page.getByRole('listitem').filter({has: page.getByRole('link', { name: 'Test Cases' })}),
      products: page.getByRole('listitem').filter({has: page.getByRole('link', { name: 'Products' })}),
      cart: page.getByRole('listitem').filter({has: page.getByRole('link', { name: 'Cart' })}),
    };
  }

  getLoggedIn(name) {
    return this.page.getByText(`Logged in as ${name}`);
  }
}
