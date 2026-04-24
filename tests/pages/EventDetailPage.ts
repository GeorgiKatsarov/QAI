import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class EventDetailPage extends BasePage {
  readonly container: Locator;
  readonly title: Locator;
  readonly date: Locator;
  readonly venue: Locator;
  readonly sourceLink: Locator;

  constructor(page: Page) {
    super(page);
    this.container = page.getByTestId("event-details-page");
    this.title = page.getByTestId("event-title");
    this.date = page.getByTestId("event-date");
    this.venue = page.getByTestId("event-venue");
    this.sourceLink = page.getByTestId("event-source-link");
  }

  async goto(slug: string) {
    await this.page.goto(`/events/${slug}`);
  }
}
