import { expect, Page } from "@playwright/test";

export class Product {
  readonly page: Page;

  constructor(page) {
    this.page = page;
  }

  async expectToBeVisible() {
      await expect(this.page.getByRole('img', { name: 'Website for practice' })).toBeVisible();
      expect(this.page.url()).toContain('/products');
  }
}