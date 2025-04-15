import { Locator, Page } from '@playwright/test';

export class Navigation {
  readonly page: Page;
  readonly selectors: { [key: string]: Locator };

  constructor(page: Page) {
    this.page = page;
    this.selectors = {
      signUpAndLogin: this.page.getByRole('link', { name: 'Signup / Login' }),
    }
  }

  async home() {
    await this.page.goto('http://automationexercise.com/');
  }

  async sign() {
    await this.selectors.signUpAndLogin.click();
  }
}
