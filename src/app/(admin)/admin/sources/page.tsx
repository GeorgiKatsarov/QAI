export default function AdminSourcesPage() {
  return (
    <div className="p-8" data-testid="admin-sources-page">
      <h1 className="text-2xl font-bold mb-2">Източници</h1>
      <p className="text-muted-foreground mb-8">
        Управлявайте източниците на събития и настройките на скрейпърите.
      </p>

      <div className="rounded-xl border border-border" data-testid="admin-sources-table">
        <div className="p-6 text-sm text-muted-foreground" data-testid="admin-sources-empty">
          Няма конфигурирани източници. Те ще бъдат изброени тук, след като рамката за скрейпване бъде настроена.
        </div>
      </div>
    </div>
  );
}
