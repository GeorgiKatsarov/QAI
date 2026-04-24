import { test, expect } from "@playwright/test";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { AdminEventsPage } from "../pages/AdminEventsPage";
import { AdminSubmissionsPage } from "../pages/AdminSubmissionsPage";
import { AdminSourcesPage } from "../pages/AdminSourcesPage";

test.describe("Admin Dashboard", () => {
  test("admin dashboard page is accessible", async ({ page }) => {
    const adminDashboard = new AdminDashboardPage(page);
    await adminDashboard.goto();
    await expect(adminDashboard.container).toBeVisible();
  });

  test("all three stat cards are present", async ({ page }) => {
    const adminDashboard = new AdminDashboardPage(page);
    await adminDashboard.goto();
    await expect(adminDashboard.statSubmissions).toBeVisible();
    await expect(adminDashboard.statEvents).toBeVisible();
    await expect(adminDashboard.statSources).toBeVisible();
  });
});

test.describe("Admin Events Page", () => {
  test("admin events page is accessible", async ({ page }) => {
    const adminEvents = new AdminEventsPage(page);
    await adminEvents.goto();
    await expect(adminEvents.container).toBeVisible();
  });

  test("events table or empty state is displayed", async ({ page }) => {
    const adminEvents = new AdminEventsPage(page);
    await adminEvents.goto();
    const hasTable = await adminEvents.table.isVisible();
    const hasEmpty = await adminEvents.emptyState.isVisible();
    expect(hasTable || hasEmpty).toBe(true);
  });
});

test.describe("Admin Submissions Page", () => {
  test("admin submissions page is accessible", async ({ page }) => {
    const adminSubmissions = new AdminSubmissionsPage(page);
    await adminSubmissions.goto();
    await expect(adminSubmissions.container).toBeVisible();
  });

  test("submissions table or empty state is displayed", async ({ page }) => {
    const adminSubmissions = new AdminSubmissionsPage(page);
    await adminSubmissions.goto();
    const hasTable = await adminSubmissions.table.isVisible();
    const hasEmpty = await adminSubmissions.emptyState.isVisible();
    expect(hasTable || hasEmpty).toBe(true);
  });

  test("submission rows have approve and reject buttons when submissions exist", async ({ page }) => {
    const adminSubmissions = new AdminSubmissionsPage(page);
    await adminSubmissions.goto();
    const rows = page.locator('[data-testid^="submission-row-"]');
    const rowCount = await rows.count();
    if (rowCount === 0) {
      test.skip();
      return;
    }
    const firstRowTestId = await rows.first().getAttribute("data-testid");
    const submissionId = firstRowTestId?.replace("submission-row-", "") ?? "";
    await expect(adminSubmissions.approveButton(submissionId)).toBeVisible();
    await expect(adminSubmissions.rejectButton(submissionId)).toBeVisible();
  });
});

test.describe("Admin Sources Page", () => {
  test("admin sources page is accessible", async ({ page }) => {
    const adminSources = new AdminSourcesPage(page);
    await adminSources.goto();
    await expect(adminSources.container).toBeVisible();
  });

  test("sources table or empty state is displayed", async ({ page }) => {
    const adminSources = new AdminSourcesPage(page);
    await adminSources.goto();
    const hasTable = await adminSources.table.isVisible();
    const hasEmpty = await adminSources.emptyState.isVisible();
    expect(hasTable || hasEmpty).toBe(true);
  });
});
