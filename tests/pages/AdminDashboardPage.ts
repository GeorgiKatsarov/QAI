import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AdminDashboardPage extends BasePage {
  readonly container: Locator;
  readonly statSubmissions: Locator;
  readonly statEvents: Locator;
  readonly statSources: Locator;

  constructor(page: Page) {
    super(page);
    this.container = page.getByTestId("admin-dashboard-page");
    this.statSubmissions = page.getByTestId("admin-stat-submissions");
    this.statEvents = page.getByTestId("admin-stat-events");
    this.statSources = page.getByTestId("admin-stat-sources");
  }

  async goto() {
    await this.page.goto("/admin");
  }
}
