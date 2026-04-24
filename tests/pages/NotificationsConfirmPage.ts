import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class NotificationsConfirmPage extends BasePage {
  readonly container: Locator;
  readonly successMessage: Locator;
  readonly invalidMessage: Locator;
  readonly backLink: Locator;

  constructor(page: Page) {
    super(page);
    this.container = page.getByTestId("notifications-confirm-page");
    this.successMessage = page.getByTestId("subscription-confirm-success");
    this.invalidMessage = page.getByTestId("subscription-confirm-invalid");
    this.backLink = page.getByTestId("subscription-confirm-back-link");
  }

  async goto(token: string) {
    await this.page.goto(`/notifications/confirm?token=${token}`);
  }
}
