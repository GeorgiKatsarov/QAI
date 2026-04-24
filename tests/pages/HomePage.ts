import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  readonly container: Locator;
  readonly ctaMap: Locator;
  readonly ctaCalendar: Locator;
  readonly ctaSubmit: Locator;
  readonly ctaNotifications: Locator;

  constructor(page: Page) {
    super(page);
    this.container = page.getByTestId("home-page");
    this.ctaMap = page.getByTestId("home-cta-map");
    this.ctaCalendar = page.getByTestId("home-cta-calendar");
    this.ctaSubmit = page.getByTestId("home-cta-submit");
    this.ctaNotifications = page.getByTestId("home-cta-notifications");
  }

  async goto() {
    await this.page.goto("/");
  }
}
