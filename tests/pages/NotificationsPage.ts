import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class NotificationsPage extends BasePage {
  readonly container: Locator;
  readonly form: Locator;
  readonly emailInput: Locator;
  readonly citySelect: Locator;
  readonly categorySelect: Locator;
  readonly frequencySelect: Locator;
  readonly submitButton: Locator;
  readonly successContainer: Locator;
  readonly confirmLink: Locator;
  readonly unsubscribeLink: Locator;
  readonly errorContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.container = page.getByTestId("notifications-page");
    this.form = page.getByTestId("subscription-form");
    this.emailInput = page.getByTestId("subscription-email-input");
    this.citySelect = page.getByTestId("subscription-city-select");
    this.categorySelect = page.getByTestId("subscription-category-select");
    this.frequencySelect = page.getByTestId("subscription-frequency-select");
    this.submitButton = page.getByTestId("subscription-submit-button");
    this.successContainer = page.getByTestId("subscription-success");
    this.confirmLink = page.getByTestId("subscription-confirm-link");
    this.unsubscribeLink = page.getByTestId("subscription-unsubscribe-link");
    this.errorContainer = page.getByTestId("subscription-error");
  }

  async goto() {
    await this.page.goto("/notifications");
  }

  async subscribe(data: {
    email: string;
    cities?: string[];
    categories?: string[];
    frequency?: string;
  }) {
    await this.emailInput.fill(data.email);
    if (data.cities) await this.citySelect.selectOption(data.cities);
    if (data.categories) await this.categorySelect.selectOption(data.categories);
    if (data.frequency) await this.frequencySelect.selectOption(data.frequency);
    await this.submitButton.click();
  }
}
