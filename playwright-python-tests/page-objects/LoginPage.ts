import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly submitBtn: Locator;
  readonly errorMessage: Locator;
  readonly forgotLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.locator('#login_field');
    this.passwordField = page.locator('#password');
    this.submitBtn = page.locator("input[type='submit']");
    this.errorMessage = page.locator('.flash-error');
    this.forgotLink = page.locator("a:has-text('Forgot password?')");
  }

  async navigate(): Promise<void> {
    await this.page.goto('https://github.com/login', { waitUntil: 'networkidle' });
  }

  async login(user: string, pass: string): Promise<void> {
    await this.navigate();
    await this.usernameField.fill(user);
    await this.passwordField.fill(pass);
    await this.submitBtn.click();
  }
}
