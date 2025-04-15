import { Locator, Page } from '@playwright/test';
import { user } from '../.auth/user';
import path from 'path';

export class Contact {
  readonly page: Page;
  readonly selectors: { [key: string]: Locator };
  readonly file;

  constructor(page: Page) {
    this.page = page;
    this.selectors = {
      name: page.getByRole('textbox', { name: 'Name' }),
      email: page.getByRole('textbox', { name: 'Email', exact: true }),
      subject: page.getByRole('textbox', { name: 'Subject' }),
      message: page.getByRole('textbox', { name: 'Your Message Here' }),
      fileInput: page.locator('input[name="upload_file"]'),
      submitButton: page.getByRole('button', { name: 'Submit' }),
      okButton: page.getByRole('button', { name: 'Ok' }),
      successMessage: page.locator('div.contact-form', {
        hasText: 'Success! Your details have been submitted successfully.',
      }),
      homeButton: page.getByRole('link', { name: ' Home' }),
    };
    this.file = {
      path: path.join(__dirname, '../assets/samplefile.txt'),
      name: 'samplefile.txt',
    };
  }

  async fillContactForm() {
    await this.selectors.name.fill(user.name);
    await this.selectors.email.fill(user.email);
    await this.selectors.subject.fill('Super Lorem Ipsum');
    await this.selectors.message.fill('Super Lorem Ipsum');
  }
}
