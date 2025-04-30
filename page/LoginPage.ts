import { expect, Locator, Page } from "@playwright/test";
import { user } from "../.auth/user";

export class LoginPage {
  readonly page: Page;
  readonly selectors: { [key: string]: Locator };
  
  constructor(page: Page) {
    this.page = page;
    this.selectors = {
      loginEmail: page.locator('[data-qa="login-email"]'),
      password: page.getByRole('textbox', { name: 'password' }),
      loginButton: page.getByRole('button', { name: 'Login' }),
      loginHeader: page.getByRole('heading', { name: 'Login to your account' }),
      signupHeader: page.getByRole('heading', { name: 'New User Signup!' }),
      signupButton: page.getByRole('button', { name: 'Signup' }),
      signupEmail: page.getByTestId('signup-email'),
      signupName: page.getByRole('textbox', { name: 'Name' }),
    }
  }

  async fillLoginEmail(email) {
    await this.selectors.loginEmail.fill(email);
  }

  async fillPassword(password) {
    await this.selectors.password.fill(password);
  }

  async fillSignupEmail(email) {
    await this.selectors.signupEmail.fill(email);
  }

  async fillSignupName(name) {
    await this.selectors.signupName.fill(name);
  }

  async assertSuccessfulPageLanding() {
    await expect(this.page).toHaveTitle('Automation Exercise - Signup / Login');
    await expect(this.page).toHaveURL('/login');
    await expect(this.selectors.signupHeader).toBeVisible();
    await expect(this.selectors.loginHeader).toBeVisible();
  }

  async fillNewUserSignUpAndSubmit() {
    await this.selectors.signupName.fill(user.name);
    await this.selectors.signupEmail.fill(process.env.EMAIL as string);
    await this.selectors.signupButton.click();
  }  
}