import { test, expect } from "@playwright/test";
import { MapPage } from "../pages/MapPage";

test.describe("Map Page", () => {
  test("map page container is visible", async ({ page }) => {
    const mapPage = new MapPage(page);
    await mapPage.goto();
    await expect(mapPage.container).toBeVisible();
  });

  test("filter controls are present", async ({ page }) => {
    const mapPage = new MapPage(page);
    await mapPage.goto();
    await expect(mapPage.filterControls).toBeVisible();
    await expect(mapPage.searchInput).toBeVisible();
    await expect(mapPage.cityFilter).toBeVisible();
    await expect(mapPage.categoryFilter).toBeVisible();
  });

  test("map container and results list are rendered", async ({ page }) => {
    const mapPage = new MapPage(page);
    await mapPage.goto();
    await expect(mapPage.mapContainer).toBeVisible();
    await expect(mapPage.resultsList).toBeVisible();
  });

  test("proximity controls are present", async ({ page }) => {
    const mapPage = new MapPage(page);
    await mapPage.goto();
    await expect(mapPage.proximityControls).toBeVisible();
    await expect(mapPage.locationButton).toBeVisible();
    await expect(mapPage.radiusFilter).toBeVisible();
  });

  test("search input accepts text input", async ({ page }) => {
    const mapPage = new MapPage(page);
    await mapPage.goto();
    await mapPage.search("jazz festival");
    await expect(mapPage.searchInput).toHaveValue("jazz festival");
  });

  test("clearing search restores previous value", async ({ page }) => {
    const mapPage = new MapPage(page);
    await mapPage.goto();
    await mapPage.search("some query");
    await mapPage.searchInput.clear();
    await expect(mapPage.searchInput).toHaveValue("");
  });

  test("city filter has selectable options", async ({ page }) => {
    const mapPage = new MapPage(page);
    await mapPage.goto();
    const options = await mapPage.cityFilter.locator("option").count();
    expect(options).toBeGreaterThanOrEqual(1);
  });

  test("category filter has selectable options", async ({ page }) => {
    const mapPage = new MapPage(page);
    await mapPage.goto();
    const options = await mapPage.categoryFilter.locator("option").count();
    expect(options).toBeGreaterThanOrEqual(1);
  });

  test("radius filter has distance options", async ({ page }) => {
    const mapPage = new MapPage(page);
    await mapPage.goto();
    const options = await mapPage.radiusFilter.locator("option").count();
    expect(options).toBeGreaterThanOrEqual(1);
  });

  test("results list shows event cards or empty state", async ({ page }) => {
    const mapPage = new MapPage(page);
    await mapPage.goto();
    const cardCount = await mapPage.eventCards().count();
    if (cardCount > 0) {
      await expect(mapPage.eventCards().first()).toBeVisible();
    } else {
      await expect(mapPage.emptyState).toBeVisible();
    }
  });
});
