import { EventList } from "@/components/events/EventList";
import { listPublicEvents } from "@/lib/services/events";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const result = await listPublicEvents({
    search: typeof params.search === "string" ? params.search : undefined,
    city: typeof params.city === "string" ? params.city : undefined,
    category: typeof params.category === "string" ? params.category : undefined,
  });

  return (
    <div className="container mx-auto px-4 py-6" data-testid="calendar-page">
      <form className="flex items-center gap-3 mb-6" data-testid="calendar-filter-controls">
        <input
          name="search"
          defaultValue={typeof params.search === "string" ? params.search : ""}
          type="text"
          placeholder="Search events..."
          className="flex-1 max-w-xs rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          data-testid="calendar-search-input"
        />
        <select
          name="city"
          defaultValue={typeof params.city === "string" ? params.city : ""}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          data-testid="calendar-filter-city"
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
          data-testid="calendar-filter-category"
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

      <div className="rounded-xl border border-border bg-card p-6 min-h-96" data-testid="calendar-container">
        <EventList events={result.items} testIdPrefix="calendar" />
      </div>
    </div>
  );
}
