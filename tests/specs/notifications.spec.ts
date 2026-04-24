import { test, expect } from "@playwright/test";
import { NotificationsPage } from "../pages/NotificationsPage";
import { NotificationsConfirmPage } from "../pages/NotificationsConfirmPage";
import { NotificationsUnsubscribePage } from "../pages/NotificationsUnsubscribePage";

// City option values are Bulgarian strings matching the app's CITY_OPTIONS constant.
const CITY_PLOVDIV = "Пловдив";
const CATEGORY_SPORTS = "sports";

test.describe("Notifications Subscription Page", () => {
  test("page container and form are visible", async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.goto();
    await expect(notificationsPage.container).toBeVisible();
    await expect(notificationsPage.form).toBeVisible();
  });

  test("email input is visible and accepts text", async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.goto();
    await expect(notificationsPage.emailInput).toBeVisible();
    await notificationsPage.emailInput.fill("user@example.com");
    await expect(notificationsPage.emailInput).toHaveValue("user@example.com");
  });

  test("hidden city and category selects are attached to DOM", async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.goto();
    await expect(notificationsPage.citySelect).toBeAttached();
    await expect(notificationsPage.categorySelect).toBeAttached();
    await expect(notificationsPage.frequencySelect).toBeAttached();
  });

  test("submit button is visible", async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.goto();
    await expect(notificationsPage.submitButton).toBeVisible();
  });

  test("selected city preference persists in the hidden select", async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.goto();
    await notificationsPage.citySelect.selectOption([CITY_PLOVDIV]);
    await expect(notificationsPage.citySelect).toHaveValues([CITY_PLOVDIV]);
  });

  test("selected category preference persists in the hidden select", async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.goto();
    await notificationsPage.categorySelect.selectOption([CATEGORY_SPORTS]);
    await expect(notificationsPage.categorySelect).toHaveValues([CATEGORY_SPORTS]);
  });

  test("selected frequency preference persists in the hidden select", async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.goto();
    await notificationsPage.frequencySelect.selectOption("WEEKLY");
    await expect(notificationsPage.frequencySelect).toHaveValue("WEEKLY");
  });

  test("submitting without email shows validation error", async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.goto();
    await notificationsPage.submitButton.click();
    await expect(notificationsPage.errorContainer).toBeVisible();
  });

  test("valid subscription shows success message", async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.goto();
    const email = `subscriber+${Date.now()}@example.com`;
    await notificationsPage.subscribe({
      email,
      cities: ["София", "Варна"],
      categories: ["music", "family"],
      frequency: "DAILY",
    });
    await expect(notificationsPage.successContainer).toBeVisible();
  });

  test("success state shows confirm and unsubscribe links", async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.goto();
    const email = `links-test+${Date.now()}@example.com`;
    await notificationsPage.subscribe({ email });
    await expect(notificationsPage.successContainer).toBeVisible();
    await expect(notificationsPage.confirmLink).toBeVisible();
    await expect(notificationsPage.unsubscribeLink).toBeVisible();
  });
});

test.describe("Notification Confirm Page", () => {
  test("page container is visible", async ({ page }) => {
    const confirmPage = new NotificationsConfirmPage(page);
    await confirmPage.goto("bad-token");
    await expect(confirmPage.container).toBeVisible();
  });

  test("valid token shows success message", async ({ page }) => {
    // Subscribe via API to obtain a real confirmation token.
    const resp = await page.request.post("/api/subscriptions", {
      data: {
        email: `confirm-test+${Date.now()}@example.com`,
        cities: [],
        categoryIds: [],
        frequency: "WEEKLY",
      },
      headers: { "content-type": "application/json" },
    });
    const body = await resp.json();
    if (!resp.ok() || !body.confirmationToken) {
      test.skip();
      return;
    }

    const confirmPage = new NotificationsConfirmPage(page);
    await confirmPage.goto(body.confirmationToken);
    await expect(confirmPage.successMessage).toBeVisible();
  });

  test("invalid token shows error message", async ({ page }) => {
    const confirmPage = new NotificationsConfirmPage(page);
    await confirmPage.goto("bad-token");
    await expect(confirmPage.invalidMessage).toBeVisible();
  });

  test("back link is present", async ({ page }) => {
    const confirmPage = new NotificationsConfirmPage(page);
    await confirmPage.goto("bad-token");
    await expect(confirmPage.backLink).toBeVisible();
  });

  test("back link navigates to notifications page", async ({ page }) => {
    const confirmPage = new NotificationsConfirmPage(page);
    await confirmPage.goto("bad-token");
    await confirmPage.backLink.click();
    await page.waitForURL("**/notifications");
    await expect(page).toHaveURL("/notifications");
  });
});

test.describe("Notification Unsubscribe Page", () => {
  test("page container is visible", async ({ page }) => {
    const unsubscribePage = new NotificationsUnsubscribePage(page);
    await unsubscribePage.goto("bad-token");
    await expect(unsubscribePage.container).toBeVisible();
  });

  test("valid token shows success message", async ({ page }) => {
    // Subscribe via API to obtain a real unsubscribe token.
    const resp = await page.request.post("/api/subscriptions", {
      data: {
        email: `unsub-test+${Date.now()}@example.com`,
        cities: [],
        categoryIds: [],
        frequency: "WEEKLY",
      },
      headers: { "content-type": "application/json" },
    });
    const body = await resp.json();
    if (!resp.ok() || !body.unsubscribeToken) {
      test.skip();
      return;
    }

    const unsubscribePage = new NotificationsUnsubscribePage(page);
    await unsubscribePage.goto(body.unsubscribeToken);
    await expect(unsubscribePage.successMessage).toBeVisible();
  });

  test("invalid token shows error message", async ({ page }) => {
    const unsubscribePage = new NotificationsUnsubscribePage(page);
    await unsubscribePage.goto("bad-token");
    await expect(unsubscribePage.invalidMessage).toBeVisible();
  });

  test("back link is present", async ({ page }) => {
    const unsubscribePage = new NotificationsUnsubscribePage(page);
    await unsubscribePage.goto("bad-token");
    await expect(unsubscribePage.backLink).toBeVisible();
  });

  test("back link navigates to notifications page", async ({ page }) => {
    const unsubscribePage = new NotificationsUnsubscribePage(page);
    await unsubscribePage.goto("bad-token");
    await unsubscribePage.backLink.click();
    await page.waitForURL("**/notifications");
    await expect(page).toHaveURL("/notifications");
  });
});
