import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AdminSubmissionsPage extends BasePage {
  readonly container: Locator;
  readonly table: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    super(page);
    this.container = page.getByTestId("admin-submissions-page");
    this.table = page.getByTestId("submissions-table");
    this.emptyState = page.getByTestId("submissions-empty");
  }

  async goto() {
    await this.page.goto("/admin/submissions");
  }

  submissionRow(id: string) {
    return this.page.getByTestId(`submission-row-${id}`);
  }

  approveButton(id: string) {
    return this.page.getByTestId(`approve-button-${id}`);
  }

  rejectButton(id: string) {
    return this.page.getByTestId(`reject-button-${id}`);
  }
}
