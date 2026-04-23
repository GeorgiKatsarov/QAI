export default function MapPage() {
  return (
    <div
      className="flex flex-col h-[calc(100vh-3.5rem)]"
      data-testid="map-page"
    >
      <div className="border-b border-border px-4 py-3 flex items-center gap-3">
        <input
          type="text"
          placeholder="Search events..."
          className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          data-testid="map-search-input"
        />
        <select
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          data-testid="map-filter-city"
        >
          <option value="">All cities</option>
          <option value="sofia">Sofia</option>
          <option value="plovdiv">Plovdiv</option>
          <option value="varna">Varna</option>
        </select>
        <select
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          data-testid="map-filter-category"
        >
          <option value="">All categories</option>
          <option value="music">Music</option>
          <option value="art">Art</option>
          <option value="food">Food</option>
        </select>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          className="flex-1 bg-muted flex items-center justify-center text-muted-foreground"
          data-testid="map-container"
        >
          <p className="text-sm">Map will be rendered here</p>
        </div>

        <aside className="w-80 border-l border-border overflow-y-auto">
          <div
            className="p-4 space-y-3"
            data-testid="map-results-list"
          >
            <p className="text-sm text-muted-foreground" data-testid="map-empty-state">
              No events loaded yet. Events will appear here once the data layer is connected.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
