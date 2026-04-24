import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CalendarPage extends BasePage {
  readonly container: Locator;
  readonly filterControls: Locator;
  readonly searchInput: Locator;
  readonly cityFilter: Locator;
  readonly categoryFilter: Locator;
  readonly calendarContainer: Locator;
  readonly monthView: Locator;
  readonly prevMonthButton: Locator;
  readonly currentMonth: Locator;
  readonly nextMonthButton: Locator;
  readonly proximityControls: Locator;
  readonly locationButton: Locator;
  readonly radiusFilter: Locator;
  readonly locationStatus: Locator;
  readonly grid: Locator;

  constructor(page: Page) {
    super(page);
    this.container = page.getByTestId("calendar-page");
    this.filterControls = page.getByTestId("calendar-filter-controls");
    this.searchInput = page.getByTestId("calendar-search-input");
    this.cityFilter = page.getByTestId("calendar-filter-city");
    this.categoryFilter = page.getByTestId("calendar-filter-category");
    this.calendarContainer = page.getByTestId("calendar-container");
    this.monthView = page.getByTestId("calendar-month-view");
    this.prevMonthButton = page.getByTestId("calendar-prev-month");
    this.currentMonth = page.getByTestId("calendar-current-month");
    this.nextMonthButton = page.getByTestId("calendar-next-month");
    this.proximityControls = page.getByTestId("calendar-proximity-controls");
    this.locationButton = page.getByTestId("calendar-location-button");
    this.radiusFilter = page.getByTestId("calendar-radius-filter");
    this.locationStatus = page.getByTestId("calendar-location-status");
    this.grid = page.getByTestId("calendar-grid");
  }

  async goto() {
    await this.page.goto("/calendar");
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async filterByCity(city: string) {
    await this.cityFilter.selectOption(city);
  }

  async filterByCategory(category: string) {
    await this.categoryFilter.selectOption(category);
  }

  async goToPrevMonth() {
    await this.prevMonthButton.click();
  }

  async goToNextMonth() {
    await this.nextMonthButton.click();
  }

  dayCell(dateKey: string) {
    return this.page.getByTestId(`calendar-day-${dateKey}`);
  }

  eventCards() {
    return this.grid.locator('[data-testid^="event-card-"]');
  }
}
