export default function AdminSourcesPage() {
  return (
    <div className="p-8" data-testid="admin-sources-page">
      <h1 className="text-2xl font-bold mb-2">Sources</h1>
      <p className="text-muted-foreground mb-8">
        Manage event sources and scraper configurations.
      </p>

      <div className="rounded-xl border border-border" data-testid="admin-sources-table">
        <div className="p-6 text-sm text-muted-foreground" data-testid="admin-sources-empty">
          No sources configured. Sources will be listed here once the scraper framework is set up.
        </div>
      </div>
    </div>
  );
}
