import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class NotificationsUnsubscribePage extends BasePage {
  readonly container: Locator;
  readonly successMessage: Locator;
  readonly invalidMessage: Locator;
  readonly backLink: Locator;

  constructor(page: Page) {
    super(page);
    this.container = page.getByTestId("notifications-unsubscribe-page");
    this.successMessage = page.getByTestId("subscription-unsubscribe-success");
    this.invalidMessage = page.getByTestId("subscription-unsubscribe-invalid");
    this.backLink = page.getByTestId("subscription-unsubscribe-back-link");
  }

  async goto(token: string) {
    await this.page.goto(`/notifications/unsubscribe?token=${token}`);
  }
}
