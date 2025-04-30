import { Locator, Page } from '@playwright/test';

export class Navigation {
  readonly page: Page;
  readonly selectors: { [key: string]: Locator };

  constructor(page: Page) {
    this.page = page;
    this.selectors = {
      signUpAndLogin: this.page.getByRole('link', { name: 'Signup / Login' }),
      deleteAccount: page.getByRole('link', { name: 'Delete Account' }),
      contactUs: page.getByRole('link', { name: 'Contact us' }),
      home: page.getByRole('link', { name: 'Home' }),
      testCases: page.getByRole('listitem').filter({has: page.getByRole('link', { name: 'Test Cases' })}),
      products: page.getByRole('listitem').filter({has: page.getByRole('link', { name: 'Products' })}),
      cart: page.getByRole('listitem').filter({has: page.getByRole('link', { name: 'Cart' })}),
    }
  }

  async home() {
    await this.page.goto('http://automationexercise.com/');
  }

  async loginPage() {
    await this.selectors.signUpAndLogin.click();
  }

  async sign() {
    await this.selectors.signUpAndLogin.click();
  }

  getLoggedIn(name) {
    return this.page.getByText(`Logged in as ${name}`);
  }
}
