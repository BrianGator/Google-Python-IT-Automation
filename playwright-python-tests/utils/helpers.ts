import { Page } from '@playwright/test';

export async function loginToGithub(page: Page, user: string, pass: string): Promise<void> {
  await page.goto('https://github.com/login', { waitUntil: 'networkidle' });
  await page.fill('#login_field', user);
  await page.fill('#password', pass);
  await page.click("input[type='submit']");
}

export async function clearInput(page: Page, selector: string): Promise<void> {
  await page.locator(selector).fill('');
}
