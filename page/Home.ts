import { Page, Locator, expect } from '@playwright/test';

export class Home {
  readonly page: Page;
  readonly selectors: { [key: string]: Locator };

  constructor(page: Page) {
    this.page = page;
    this.selectors = {
      sliderTitle: this.page.getByRole('heading', { name: 'AutomationExercise' }),
      sliderSubtitle: this.page.getByRole('heading', {
        name: 'Full-Fledged practice website for Automation Engineers',
      }),
      homeMainCategory: this.page.getByRole('heading', { name: 'Features Items' }),
      carouselImage: this.page.getByRole('img', { name: 'demo website for practice' }),
    };
  }

  async goto() {
    await this.page.goto('http://automationexercise.com/');
  }

  async expectToBeVisible() {
    await expect(this.page).toHaveTitle('Automation Exercise');
    await expect(this.selectors.sliderTitle).toBeVisible();
    await expect(this.selectors.sliderSubtitle).toBeVisible();
    await expect(this.selectors.homeMainCategory).toBeVisible();
    // await expect(this.selectors.carouselImage).toBeVisible();
  }
}
