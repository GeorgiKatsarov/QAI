import { test, expect } from "@playwright/test";
import { CalendarPage } from "../pages/CalendarPage";

test.describe("Calendar Page", () => {
  test("calendar page container is visible", async ({ page }) => {
    const calendarPage = new CalendarPage(page);
    await calendarPage.goto();
    await expect(calendarPage.container).toBeVisible();
  });

  test("filter controls are present", async ({ page }) => {
    const calendarPage = new CalendarPage(page);
    await calendarPage.goto();
    await expect(calendarPage.filterControls).toBeVisible();
    await expect(calendarPage.searchInput).toBeVisible();
    await expect(calendarPage.cityFilter).toBeVisible();
    await expect(calendarPage.categoryFilter).toBeVisible();
  });

  test("calendar container and month view are rendered", async ({ page }) => {
    const calendarPage = new CalendarPage(page);
    await calendarPage.goto();
    await expect(calendarPage.calendarContainer).toBeVisible();
    await expect(calendarPage.monthView).toBeVisible();
  });

  test("month navigation controls are present", async ({ page }) => {
    const calendarPage = new CalendarPage(page);
    await calendarPage.goto();
    await expect(calendarPage.prevMonthButton).toBeVisible();
    await expect(calendarPage.currentMonth).toBeVisible();
    await expect(calendarPage.nextMonthButton).toBeVisible();
  });

  test("calendar grid renders 42 day cells (6-week view)", async ({ page }) => {
    const calendarPage = new CalendarPage(page);
    await calendarPage.goto();
    await expect(calendarPage.grid).toBeVisible();
    await expect(calendarPage.grid.locator('[data-testid^="calendar-day-"]')).toHaveCount(42);
  });

  test("next month button changes the displayed month", async ({ page }) => {
    const calendarPage = new CalendarPage(page);
    await calendarPage.goto();
    const initialMonth = await calendarPage.currentMonth.textContent();
    await calendarPage.goToNextMonth();
    const newMonth = await calendarPage.currentMonth.textContent();
    expect(newMonth).not.toBe(initialMonth);
  });

  test("prev month button changes the displayed month", async ({ page }) => {
    const calendarPage = new CalendarPage(page);
    await calendarPage.goto();
    const initialMonth = await calendarPage.currentMonth.textContent();
    await calendarPage.goToPrevMonth();
    const newMonth = await calendarPage.currentMonth.textContent();
    expect(newMonth).not.toBe(initialMonth);
  });

  test("next then prev month returns to the original month", async ({ page }) => {
    const calendarPage = new CalendarPage(page);
    await calendarPage.goto();
    const initialMonth = await calendarPage.currentMonth.textContent();
    await calendarPage.goToNextMonth();
    await calendarPage.goToPrevMonth();
    const restoredMonth = await calendarPage.currentMonth.textContent();
    expect(restoredMonth).toBe(initialMonth);
  });

  test("search input accepts text", async ({ page }) => {
    const calendarPage = new CalendarPage(page);
    await calendarPage.goto();
    await calendarPage.search("festival");
    await expect(calendarPage.searchInput).toHaveValue("festival");
  });

  test("proximity controls are present", async ({ page }) => {
    const calendarPage = new CalendarPage(page);
    await calendarPage.goto();
    await expect(calendarPage.proximityControls).toBeVisible();
    await expect(calendarPage.locationButton).toBeVisible();
    await expect(calendarPage.radiusFilter).toBeVisible();
  });

  test("city filter has selectable options", async ({ page }) => {
    const calendarPage = new CalendarPage(page);
    await calendarPage.goto();
    const options = await calendarPage.cityFilter.locator("option").count();
    expect(options).toBeGreaterThanOrEqual(1);
  });

  test("category filter has selectable options", async ({ page }) => {
    const calendarPage = new CalendarPage(page);
    await calendarPage.goto();
    const options = await calendarPage.categoryFilter.locator("option").count();
    expect(options).toBeGreaterThanOrEqual(1);
  });
});
