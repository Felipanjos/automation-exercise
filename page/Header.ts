import { Locator, Page } from "@playwright/test";

export class Header {
  readonly page: Page;
  readonly selectors: {[key: string]: Locator}

  constructor(page: Page) {
    this.page = page;

    this.selectors = {
      deleteAccount: this.page.getByRole('link', { name: 'Delete Account' }),
    }
  }

  getLoggedIn(name) {
    return this.page.getByText(`Logged in as ${name}`);
  }
}