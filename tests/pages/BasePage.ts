import { Page } from "@playwright/test";
import { NavbarComponent } from "./NavbarComponent";

export class BasePage {
  readonly navbar: NavbarComponent;

  constructor(protected readonly page: Page) {
    this.navbar = new NavbarComponent(page);
  }
}
