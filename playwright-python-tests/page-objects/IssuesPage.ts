import { Page, Locator } from '@playwright/test';

export class IssuesPage {
  readonly page: Page;
  readonly titleField: Locator;
  readonly descField: Locator;
  readonly submitIssueBtn: Locator;
  readonly validationWarning: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleField = page.locator('#issue_title');
    this.descField = page.locator('#issue_body');
    this.submitIssueBtn = page.locator("button:has-text('Submit new issue')");
    this.validationWarning = page.locator('.blank-validation-error');
  }

  async submitIssue(title: string, description: string): Promise<void> {
    await this.titleField.fill(title);
    await this.descField.fill(description);
    await this.submitIssueBtn.click();
  }
}
