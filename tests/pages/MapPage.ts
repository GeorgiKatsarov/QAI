import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class MapPage extends BasePage {
  readonly container: Locator;
  readonly filterControls: Locator;
  readonly searchInput: Locator;
  readonly cityFilter: Locator;
  readonly categoryFilter: Locator;
  readonly proximityControls: Locator;
  readonly locationButton: Locator;
  readonly radiusFilter: Locator;
  readonly locationStatus: Locator;
  readonly mapContainer: Locator;
  readonly resultsList: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    super(page);
    this.container = page.getByTestId("map-page");
    this.filterControls = page.getByTestId("map-filter-controls");
    this.searchInput = page.getByTestId("map-search-input");
    this.cityFilter = page.getByTestId("map-filter-city");
    this.categoryFilter = page.getByTestId("map-filter-category");
    this.proximityControls = page.getByTestId("map-proximity-controls");
    this.locationButton = page.getByTestId("map-location-button");
    this.radiusFilter = page.getByTestId("map-radius-filter");
    this.locationStatus = page.getByTestId("map-location-status");
    this.mapContainer = page.getByTestId("map-container");
    this.resultsList = page.getByTestId("map-results-list");
    this.emptyState = page.getByTestId("map-empty-state");
  }

  async goto() {
    await this.page.goto("/map");
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

  eventCards() {
    return this.resultsList.locator('[data-testid^="event-card-"]');
  }

  eventCard(eventId: string) {
    return this.page.getByTestId(`event-card-${eventId}`);
  }
}
