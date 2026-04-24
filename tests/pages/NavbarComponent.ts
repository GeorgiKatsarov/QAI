import { Page, Locator } from "@playwright/test";

export class NavbarComponent {
  readonly navbar: Locator;
  readonly logo: Locator;
  readonly links: Locator;
  readonly linkMap: Locator;
  readonly linkCalendar: Locator;
  readonly linkSubmit: Locator;
  readonly linkNotifications: Locator;

  constructor(private readonly page: Page) {
    this.navbar = page.getByTestId("navbar");
    this.logo = page.getByTestId("nav-logo");
    this.links = page.getByTestId("nav-links");
    this.linkMap = page.getByTestId("nav-link-map");
    this.linkCalendar = page.getByTestId("nav-link-calendar");
    this.linkSubmit = page.getByTestId("nav-link-submit-event");
    this.linkNotifications = page.getByTestId("nav-link-notifications");
  }

  async navigateToMap() {
    await this.linkMap.click();
  }

  async navigateToCalendar() {
    await this.linkCalendar.click();
  }

  async navigateToSubmit() {
    await this.linkSubmit.click();
  }

  async navigateToNotifications() {
    await this.linkNotifications.click();
  }
}
