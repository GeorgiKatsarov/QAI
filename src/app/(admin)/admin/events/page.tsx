export default function AdminEventsPage() {
  return (
    <div className="p-8" data-testid="admin-events-page">
      <h1 className="text-2xl font-bold mb-2">Events</h1>
      <p className="text-muted-foreground mb-8">
        Manage all published and archived events.
      </p>

      <div className="rounded-xl border border-border" data-testid="admin-events-table">
        <div className="p-6 text-sm text-muted-foreground" data-testid="admin-events-empty">
          No events yet. Events will appear here once the data model is connected.
        </div>
      </div>
    </div>
  );
}
