import { expect, Locator, Page } from '@playwright/test';
import { user } from '../.auth/user';
import { Helper } from '../utils/Helper';

export class SignUpPage {
  readonly page: Page;
  readonly selectors: { [key: string]: Locator };

  constructor(page: Page) {
    this.page = page;

    this.selectors = {
      accountDeleted: page.getByText('Account Deleted!'),
      accountInformationHeader: page.getByText('Enter Account Information'),
    };
  }

  async fillFormAndSubmit() {
      // 9. Fill details: Title, Name, Email, Password, Date of birth
      await this.page.getByRole('radio', { name: 'Mr.', exact: true }).click();
      await this.page.getByRole('textbox', { name: 'Name *', exact: true }).fill(user.name);
      await expect(this.page.getByRole('textbox', { name: 'Email *', exact: true })).toHaveValue(Helper.getEnvVar('email'));
      await this.page.getByRole('textbox', { name: 'Password *', exact: true }).fill(Helper.getEnvVar('password'));
      await this.page.locator('[data-qa="days"]').selectOption(user.birth_date);
      await this.page.locator('[data-qa="months"]').selectOption(user.birth_month);
      await this.page.locator('[data-qa="years"]').selectOption(user.birth_year);
    
      // 10. Select checkbox 'Sign up for our newsletter!'
      await this.page.getByRole('checkbox', { name: 'Sign up for our newsletter!' }).check();
    
      // 11. Select checkbox 'Receive special offers from our partners!'
      await this.page.getByRole('checkbox', { name: 'Receive special offers from our partners!' }).check();
    
      // 12. Fill details: First name, Last name, Company, Address, Address2, Country, State, City, Zipcode, Mobile Number
      await this.page.getByRole('textbox', { name: 'First name *' }).fill(user.firstname);
      await this.page.getByRole('textbox', { name: 'Last name *' }).fill(user.lastname);
      await this.page.getByRole('textbox', { name: 'Company', exact: true }).fill(user.company);
      await this.page.getByRole('textbox', { name: 'Address *' }).fill(user.address1);
      await this.page.getByRole('textbox', { name: 'Address 2' }).fill(user.address2);
    
      await this.page.getByLabel('Country *').selectOption('United States');
    
      await this.page.getByRole('textbox', { name: 'State *' }).fill(user.state);
      await this.page.getByRole('textbox', { name: 'City *' }).fill(user.city);
      await this.page.locator('[data-qa="zipcode"]').fill(user.zipcode);
      await this.page.getByRole('textbox', { name: 'Mobile Number *' }).fill(user.mobile_number);
    
      // 13. Click 'Create Account button'
      await this.page.getByRole('button', { name: 'Create Account' }).click();
  }

  async assertSuccessfulPageLanding() {
    await expect(this.page).toHaveURL('/signup');
    await expect(this.page).toHaveTitle('Automation Exercise - Signup');
    await expect(this.selectors.accountInformationHeader).toBeVisible();
  }
}
