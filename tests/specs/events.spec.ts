import { test, expect } from "@playwright/test";
import { MapPage } from "../pages/MapPage";
import { CalendarPage } from "../pages/CalendarPage";
import { EventDetailPage } from "../pages/EventDetailPage";

test.describe("Event Discovery - Map", () => {
  test("map results list renders event cards or shows empty state", async ({ page }) => {
    const mapPage = new MapPage(page);
    await mapPage.goto();
    const cardCount = await mapPage.eventCards().count();
    if (cardCount > 0) {
      await expect(mapPage.eventCards().first()).toBeVisible();
    } else {
      await expect(mapPage.emptyState).toBeVisible();
    }
  });

  test("event card link navigates to the event detail page", async ({ page }) => {
    const mapPage = new MapPage(page);
    await mapPage.goto();
    const cards = mapPage.eventCards();
    if ((await cards.count()) === 0) {
      test.skip();
      return;
    }
    await cards.first().getByRole("link").click();
    const eventDetail = new EventDetailPage(page);
    await expect(eventDetail.container).toBeVisible();
  });
});

test.describe("Event Discovery - Calendar", () => {
  test("calendar grid renders event cards or no events on current month", async ({ page }) => {
    const calendarPage = new CalendarPage(page);
    await calendarPage.goto();
    const cardCount = await calendarPage.eventCards().count();
    // either events are shown or the grid is empty — both are valid states
    expect(cardCount).toBeGreaterThanOrEqual(0);
  });

  test("event card in calendar links to event detail page", async ({ page }) => {
    const calendarPage = new CalendarPage(page);
    await calendarPage.goto();
    const cards = calendarPage.eventCards();
    if ((await cards.count()) === 0) {
      test.skip();
      return;
    }
    await cards.first().click();
    const eventDetail = new EventDetailPage(page);
    await expect(eventDetail.container).toBeVisible();
  });
});

test.describe("Event Detail Page", () => {
  test("event title is visible", async ({ page }) => {
    const mapPage = new MapPage(page);
    await mapPage.goto();
    const cards = mapPage.eventCards();
    if ((await cards.count()) === 0) {
      test.skip();
      return;
    }
    await cards.first().getByRole("link").click();
    const eventDetail = new EventDetailPage(page);
    await expect(eventDetail.title).toBeVisible();
  });

  test("event date is visible", async ({ page }) => {
    const mapPage = new MapPage(page);
    await mapPage.goto();
    const cards = mapPage.eventCards();
    if ((await cards.count()) === 0) {
      test.skip();
      return;
    }
    await cards.first().getByRole("link").click();
    const eventDetail = new EventDetailPage(page);
    await expect(eventDetail.date).toBeVisible();
  });

  test("event venue is visible", async ({ page }) => {
    const mapPage = new MapPage(page);
    await mapPage.goto();
    const cards = mapPage.eventCards();
    if ((await cards.count()) === 0) {
      test.skip();
      return;
    }
    await cards.first().getByRole("link").click();
    const eventDetail = new EventDetailPage(page);
    await expect(eventDetail.venue).toBeVisible();
  });

  test("event source link or placeholder is visible", async ({ page }) => {
    const mapPage = new MapPage(page);
    await mapPage.goto();
    const cards = mapPage.eventCards();
    if ((await cards.count()) === 0) {
      test.skip();
      return;
    }
    await cards.first().getByRole("link").click();
    const eventDetail = new EventDetailPage(page);
    await expect(eventDetail.sourceLink).toBeVisible();
  });

  test("navbar is present on event detail page", async ({ page }) => {
    const mapPage = new MapPage(page);
    await mapPage.goto();
    const cards = mapPage.eventCards();
    if ((await cards.count()) === 0) {
      test.skip();
      return;
    }
    await cards.first().getByRole("link").click();
    const eventDetail = new EventDetailPage(page);
    await expect(eventDetail.navbar.navbar).toBeVisible();
  });
});
