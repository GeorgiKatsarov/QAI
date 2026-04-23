import { test, expect } from "@playwright/test";

test.describe("App loads", () => {
  test("home page loads and shows hero content", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("home-page")).toBeVisible();
    await expect(page.getByTestId("navbar")).toBeVisible();
    await expect(page.getByTestId("nav-logo")).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("navbar links are present", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("nav-links")).toBeVisible();
    await expect(page.getByTestId("nav-link-map")).toBeVisible();
    await expect(page.getByTestId("nav-link-calendar")).toBeVisible();
    await expect(page.getByTestId("nav-link-submit-event")).toBeVisible();
    await expect(page.getByTestId("nav-link-notifications")).toBeVisible();
  });

  test("navigates to map page", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("nav-link-map").click();
    await expect(page).toHaveURL("/map");
    await expect(page.getByTestId("map-page")).toBeVisible();
    await expect(page.getByTestId("map-container")).toBeVisible();
    await expect(page.getByTestId("map-search-input")).toBeVisible();
  });

  test("navigates to calendar page", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("nav-link-calendar").click();
    await expect(page).toHaveURL("/calendar");
    await expect(page.getByTestId("calendar-page")).toBeVisible();
    await expect(page.getByTestId("calendar-container")).toBeVisible();
  });

  test("navigates to submit page", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("nav-link-submit-event").click();
    await expect(page).toHaveURL("/submit");
    await expect(page.getByTestId("submit-event-page")).toBeVisible();
    await expect(page.getByTestId("submit-event-form")).toBeVisible();
  });

  test("navigates to notifications page", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("nav-link-notifications").click();
    await expect(page).toHaveURL("/notifications");
    await expect(page.getByTestId("notifications-page")).toBeVisible();
    await expect(page.getByTestId("subscription-form")).toBeVisible();
  });
});

test.describe("Admin routes", () => {
  test("admin dashboard is accessible at /admin", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByTestId("admin-dashboard-page")).toBeVisible();
    await expect(page.getByTestId("admin-sidebar")).toBeVisible();
  });

  test("admin events page is accessible", async ({ page }) => {
    await page.goto("/admin/events");
    await expect(page.getByTestId("admin-events-page")).toBeVisible();
  });

  test("admin submissions page is accessible", async ({ page }) => {
    await page.goto("/admin/submissions");
    await expect(page.getByTestId("admin-submissions-page")).toBeVisible();
  });

  test("admin sources page is accessible", async ({ page }) => {
    await page.goto("/admin/sources");
    await expect(page.getByTestId("admin-sources-page")).toBeVisible();
  });
});

test.describe("Home page CTAs", () => {
  test("map CTA navigates to map", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("home-cta-map").click();
    await expect(page).toHaveURL("/map");
  });

  test("calendar CTA navigates to calendar", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("home-cta-calendar").click();
    await expect(page).toHaveURL("/calendar");
  });

  test("submit CTA navigates to submit", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("home-cta-submit").click();
    await expect(page).toHaveURL("/submit");
  });

  test("notifications CTA navigates to notifications", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("home-cta-notifications").click();
    await expect(page).toHaveURL("/notifications");
  });
});

test.describe("Map page filter controls", () => {
  test("search input and filters are present", async ({ page }) => {
    await page.goto("/map");
    await expect(page.getByTestId("map-search-input")).toBeVisible();
    await expect(page.getByTestId("map-filter-city")).toBeVisible();
    await expect(page.getByTestId("map-filter-category")).toBeVisible();
    await expect(page.getByTestId("map-results-list")).toBeVisible();
  });
});

test.describe("Calendar page filter controls", () => {
  test("search input and filters are present", async ({ page }) => {
    await page.goto("/calendar");
    await expect(page.getByTestId("calendar-search-input")).toBeVisible();
    await expect(page.getByTestId("calendar-filter-city")).toBeVisible();
    await expect(page.getByTestId("calendar-filter-category")).toBeVisible();
  });
});

test.describe("Submit form fields", () => {
  test("all required form fields are present", async ({ page }) => {
    await page.goto("/submit");
    await expect(page.getByTestId("submit-title-input")).toBeVisible();
    await expect(page.getByTestId("submit-date-input")).toBeVisible();
    await expect(page.getByTestId("submit-city-input")).toBeVisible();
    await expect(page.getByTestId("submit-category-input")).toBeVisible();
    await expect(page.getByTestId("submit-email-input")).toBeVisible();
    await expect(page.getByTestId("submit-button")).toBeVisible();
  });
});

test.describe("Notification form fields", () => {
  test("all subscription form fields are present", async ({ page }) => {
    await page.goto("/notifications");
    await expect(page.getByTestId("subscription-email-input")).toBeVisible();
    await expect(page.getByTestId("subscription-city-select")).toBeVisible();
    await expect(page.getByTestId("subscription-category-select")).toBeVisible();
    await expect(page.getByTestId("subscription-frequency-select")).toBeVisible();
    await expect(page.getByTestId("subscription-submit-button")).toBeVisible();
  });
});

test.describe("Notification subscription flow", () => {
  test("valid signup succeeds", async ({ page }) => {
    await page.goto("/notifications");
    await page.getByTestId("subscription-email-input").fill("subscriber@example.com");
    await page.getByTestId("subscription-city-select").selectOption(["Sofia", "Varna"]);
    await page.getByTestId("subscription-category-select").selectOption(["music", "family"]);
    await page.getByTestId("subscription-frequency-select").selectOption("DAILY");
    await page.getByTestId("subscription-submit-button").click();

    await expect(page.getByTestId("subscription-success")).toBeVisible();
  });

  test("selected preferences persist in UI", async ({ page }) => {
    await page.goto("/notifications");
    await page.getByTestId("subscription-city-select").selectOption(["Plovdiv"]);
    await page.getByTestId("subscription-category-select").selectOption(["sports"]);
    await page.getByTestId("subscription-frequency-select").selectOption("WEEKLY");

    await expect(page.getByTestId("subscription-city-select")).toHaveValue(["Plovdiv"]);
    await expect(page.getByTestId("subscription-category-select")).toHaveValue(["sports"]);
    await expect(page.getByTestId("subscription-frequency-select")).toHaveValue("WEEKLY");
  });

  test("invalid signup shows validation error", async ({ page }) => {
    await page.goto("/notifications");
    await page.getByTestId("subscription-submit-button").click();
    await expect(page.getByTestId("subscription-error")).toBeVisible();
  });
});


test.describe("Event discovery and details", () => {
  test("map renders seeded/mock event cards", async ({ page }) => {
    await page.goto("/map");
    await expect(page.getByTestId("map-results-list").locator('[data-testid^="event-card-"]')).toHaveCount(3);
  });

  test("event details route opens from map card", async ({ page }) => {
    await page.goto("/map");
    await page.getByTestId("event-card-evt-sofia-jazz").getByRole("link").click();
    await expect(page.getByTestId("event-details-page")).toBeVisible();
    await expect(page.getByTestId("event-title")).toBeVisible();
    await expect(page.getByTestId("event-date")).toBeVisible();
  });
});

test.describe("Submit flow", () => {
  test("valid submission succeeds", async ({ page }) => {
    await page.goto("/submit");
    await page.getByTestId("submit-title-input").fill("Playwright Test Event");
    await page.getByTestId("submit-date-input").fill("2026-05-25T19:30");
    await page.getByTestId("submit-city-input").fill("Sofia");
    await page.getByTestId("submit-category-input").selectOption("music");
    await page.getByTestId("submit-email-input").fill("test@example.com");
    await page.getByTestId("submit-button").click();
    await expect(page.getByTestId("submit-success")).toBeVisible();
  });
});
