import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class SubmitPage extends BasePage {
  readonly container: Locator;
  readonly form: Locator;
  readonly titleInput: Locator;
  readonly dateInput: Locator;
  readonly cityInput: Locator;
  readonly categoryInput: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.container = page.getByTestId("submit-event-page");
    this.form = page.getByTestId("submit-event-form");
    this.titleInput = page.getByTestId("submit-title-input");
    this.dateInput = page.getByTestId("submit-date-input");
    this.cityInput = page.getByTestId("submit-city-input");
    this.categoryInput = page.getByTestId("submit-category-input");
    this.emailInput = page.getByTestId("submit-email-input");
    this.submitButton = page.getByTestId("submit-button");
    this.successMessage = page.getByTestId("submit-success");
    this.errorMessage = page.getByTestId("submit-error");
  }

  async goto() {
    await this.page.goto("/submit");
  }

  async fillAndSubmit(data: {
    title: string;
    date: string;
    city: string;
    category: string;
    email: string;
  }) {
    await this.titleInput.fill(data.title);
    await this.dateInput.fill(data.date);
    await this.cityInput.fill(data.city);
    await this.categoryInput.selectOption(data.category);
    await this.emailInput.fill(data.email);
    await this.submitButton.click();
  }
}
