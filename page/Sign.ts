import { Locator, Page } from '@playwright/test';

export class Sign {
  readonly page: Page;
  readonly selectors: { [key: string]: Locator };

  constructor(page: Page) {
    this.page = page;

    this.selectors = {
      accountDeleted: this.page.getByText('Account Deleted!'),
      loginEmail: this.page.locator('[data-qa="login-email"]'),
      password: this.page.getByRole('textbox', { name: 'password' }),
      loginButton: this.page.getByRole('button', { name: 'Login' }),
      loginHeader: page.getByRole('heading', { name: 'Login to your account' })
    };
  }
}
