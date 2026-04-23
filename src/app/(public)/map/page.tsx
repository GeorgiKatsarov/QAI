import { listPublicEvents } from "@/lib/services/events";
import { EventList } from "@/components/events/EventList";

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
          <option value="Sofia">Sofia</option>
          <option value="Plovdiv">Plovdiv</option>
          <option value="Varna">Varna</option>
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

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 bg-muted flex items-center justify-center text-muted-foreground" data-testid="map-container">
          <p className="text-sm">Interactive map placeholder (markers coming in next chunk).</p>
        </div>

        <aside className="w-96 border-l border-border overflow-y-auto">
          <div className="p-4 space-y-3" data-testid="map-results-list">
            <EventList events={result.items} testIdPrefix="map" />
          </div>
        </aside>
      </div>
    </div>
  );
}
