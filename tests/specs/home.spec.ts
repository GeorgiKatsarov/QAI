import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

test.describe("Home Page", () => {
  test("home page container is visible", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.container).toBeVisible();
  });

  test("all four CTA cards are present", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.ctaMap).toBeVisible();
    await expect(home.ctaCalendar).toBeVisible();
    await expect(home.ctaSubmit).toBeVisible();
    await expect(home.ctaNotifications).toBeVisible();
  });

  test("map CTA navigates to /map", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.ctaMap.click();
    await expect(page).toHaveURL("/map");
  });

  test("calendar CTA navigates to /calendar", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.ctaCalendar.click();
    await expect(page).toHaveURL("/calendar");
  });

  test("submit CTA navigates to /submit", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.ctaSubmit.click();
    await expect(page).toHaveURL("/submit");
  });

  test("notifications CTA navigates to /notifications", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.ctaNotifications.click();
    await expect(page).toHaveURL("/notifications");
  });
});
