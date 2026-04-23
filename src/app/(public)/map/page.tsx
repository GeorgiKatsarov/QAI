import { listPublicEvents } from "@/lib/services/events";
import { scrapeVisitMyBulgariaEvents } from "@/lib/services/visitMyBulgaria";
import { MapProximityView } from "@/components/map/MapProximityView";
import type { EventCardDto } from "@/lib/mappers/events";

function filterEvents(
  events: EventCardDto[],
  params: Record<string, string | string[] | undefined>
) {
  const search = typeof params.search === "string" ? params.search.toLowerCase() : "";
  const city = typeof params.city === "string" ? params.city.toLowerCase() : "";
  const category = typeof params.category === "string" ? params.category : "";
  const freeOnly = params.freeOnly === "true";

  return events.filter((event) => {
    if (search) {
      const haystack = [event.title, event.summary, event.city, event.venueName].join(" ").toLowerCase();
      if (!haystack.includes(search)) {
        return false;
      }
    }
    if (city && event.city.toLowerCase() !== city) {
      return false;
    }
    if (category && event.categorySlug !== category) {
      return false;
    }
    if (freeOnly && !event.isFree) {
      return false;
    }
    return true;
  });
}

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const result = await listPublicEvents({
    search: typeof params.search === "string" ? params.search : undefined,
    city: typeof params.city === "string" ? params.city : undefined,
    category: typeof params.category === "string" ? params.category : undefined,
    freeOnly: params.freeOnly === "true" || params.freeOnly === "false" ? params.freeOnly : undefined,
  });
  const scrapedEvents = await scrapeVisitMyBulgariaEvents();
  const merged = [...result.items];
  for (const event of scrapedEvents) {
    if (!merged.some((item) => item.slug === event.slug)) {
      merged.push(event);
    }
  }
  const filteredItems = filterEvents(merged, params);
  const cityOptions = Array.from(new Set(merged.map((event) => event.city))).sort((a, b) => a.localeCompare(b));

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]" data-testid="map-page">
      <form className="border-b border-border px-4 py-3 flex items-center gap-3" data-testid="map-filter-controls">
        <input
          name="search"
          defaultValue={typeof params.search === "string" ? params.search : ""}
          type="text"
          placeholder="Search events..."
          className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm placeholder:text-muted-foreground"
          data-testid="map-search-input"
        />
        <select
          name="city"
          defaultValue={typeof params.city === "string" ? params.city : ""}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          data-testid="map-filter-city"
        >
          <option value="">All cities</option>
          {cityOptions.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <select
          name="category"
          defaultValue={typeof params.category === "string" ? params.category : ""}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          data-testid="map-filter-category"
        >
          <option value="">All categories</option>
          <option value="music">Music</option>
          <option value="art">Art</option>
          <option value="food">Food</option>
          <option value="sports">Sports</option>
          <option value="family">Family</option>
        </select>
        <button className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground">Apply</button>
      </form>

      <MapProximityView events={filteredItems} />
    </div>
  );
}
