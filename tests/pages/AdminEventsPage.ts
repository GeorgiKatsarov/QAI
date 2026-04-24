import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AdminEventsPage extends BasePage {
  readonly container: Locator;
  readonly table: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    super(page);
    this.container = page.getByTestId("admin-events-page");
    this.table = page.getByTestId("admin-events-table");
    this.emptyState = page.getByTestId("admin-events-empty");
  }

  async goto() {
    await this.page.goto("/admin/events");
  }
}
