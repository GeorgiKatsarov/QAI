export default function CalendarPage() {
  return (
    <div className="container mx-auto px-4 py-6" data-testid="calendar-page">
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search events..."
          className="flex-1 max-w-xs rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          data-testid="calendar-search-input"
        />
        <select
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          data-testid="calendar-filter-city"
        >
          <option value="">All cities</option>
          <option value="sofia">Sofia</option>
          <option value="plovdiv">Plovdiv</option>
          <option value="varna">Varna</option>
        </select>
        <select
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          data-testid="calendar-filter-category"
        >
          <option value="">All categories</option>
          <option value="music">Music</option>
          <option value="art">Art</option>
          <option value="food">Food</option>
        </select>
      </div>

      <div
        className="rounded-xl border border-border bg-card p-6 min-h-96 flex items-center justify-center text-muted-foreground"
        data-testid="calendar-container"
      >
        <p className="text-sm" data-testid="calendar-empty-state">
          Calendar will be rendered here once FullCalendar is integrated.
        </p>
      </div>
    </div>
  );
}
