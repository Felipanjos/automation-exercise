import { Locator, Page } from "@playwright/test";

export class Header {
  readonly page: Page;
  readonly selectors: {[key: string]: Locator}

  constructor(page: Page) {
    this.page = page;

    this.selectors = {
      deleteAccount: page.getByRole('link', { name: 'Delete Account' }),
      contactUs: page.getByRole('link', { name: 'Contact us' }),
      home: page.getByRole('link', { name: 'Home' }),
    }
  }

  getLoggedIn(name) {
    return this.page.getByText(`Logged in as ${name}`);
  }
}