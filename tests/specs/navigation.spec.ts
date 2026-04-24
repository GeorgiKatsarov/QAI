import { test, expect } from "@playwright/test";
import { NavbarComponent } from "../pages/NavbarComponent";

// The navbar is intentionally hidden on "/" (home page) — test from inner pages.
test.describe("Navigation", () => {
  test("navbar is visible on inner pages", async ({ page }) => {
    await page.goto("/map");
    const navbar = new NavbarComponent(page);
    await expect(navbar.navbar).toBeVisible();
    await expect(navbar.logo).toBeVisible();
    await expect(navbar.links).toBeVisible();
  });

  test("all nav links are present", async ({ page }) => {
    await page.goto("/map");
    const navbar = new NavbarComponent(page);
    await expect(navbar.linkMap).toBeVisible();
    await expect(navbar.linkCalendar).toBeVisible();
    await expect(navbar.linkSubmit).toBeVisible();
    await expect(navbar.linkNotifications).toBeVisible();
  });

  test("map link navigates to /map", async ({ page }) => {
    await page.goto("/calendar");
    const navbar = new NavbarComponent(page);
    await navbar.navigateToMap();
    await expect(page).toHaveURL("/map");
  });

  test("calendar link navigates to /calendar", async ({ page }) => {
    await page.goto("/map");
    const navbar = new NavbarComponent(page);
    await navbar.navigateToCalendar();
    await expect(page).toHaveURL("/calendar");
  });

  test("submit link navigates to /submit", async ({ page }) => {
    await page.goto("/map");
    const navbar = new NavbarComponent(page);
    await navbar.navigateToSubmit();
    await expect(page).toHaveURL("/submit");
  });

  test("notifications link navigates to /notifications", async ({ page }) => {
    await page.goto("/map");
    const navbar = new NavbarComponent(page);
    await navbar.navigateToNotifications();
    await expect(page).toHaveURL("/notifications");
  });

  test("logo links back to home from an inner page", async ({ page }) => {
    await page.goto("/map");
    const navbar = new NavbarComponent(page);
    await navbar.logo.click();
    await expect(page).toHaveURL("/");
  });

  test("navbar is present on all non-home pages", async ({ page }) => {
    for (const path of ["/map", "/calendar", "/submit", "/notifications"]) {
      await page.goto(path);
      const navbar = new NavbarComponent(page);
      await expect(navbar.navbar).toBeVisible();
    }
  });
});
