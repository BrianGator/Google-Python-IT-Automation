import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly starButton: Locator;
  readonly unstarButton: Locator;
  readonly profileButton: Locator;
  readonly exploreLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.locator("input[placeholder*='Search']");
    this.starButton = page.locator("button:has-text('Star')");
    this.unstarButton = page.locator("button:has-text('Unstar')");
    this.profileButton = page.locator('img.avatar');
    this.exploreLink = page.locator("a:has-text('Explore')");
  }

  async navigate(): Promise<void> {
    await this.page.goto('https://github.com', { waitUntil: 'networkidle' });
  }

  async searchRepo(query: string): Promise<void> {
    await this.searchBox.fill(query);
    await this.page.keyboard.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }
}
