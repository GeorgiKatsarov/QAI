import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AdminSourcesPage extends BasePage {
  readonly container: Locator;
  readonly table: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    super(page);
    this.container = page.getByTestId("admin-sources-page");
    this.table = page.getByTestId("admin-sources-table");
    this.emptyState = page.getByTestId("admin-sources-empty");
  }

  async goto() {
    await this.page.goto("/admin/sources");
  }
}
