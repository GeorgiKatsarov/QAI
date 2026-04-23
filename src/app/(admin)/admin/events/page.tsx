export default function AdminEventsPage() {
  return (
    <div className="p-8" data-testid="admin-events-page">
      <h1 className="text-2xl font-bold mb-2">Събития</h1>
      <p className="text-muted-foreground mb-8">
        Управлявайте всички публикувани и архивирани събития.
      </p>

      <div className="rounded-xl border border-border" data-testid="admin-events-table">
        <div className="p-6 text-sm text-muted-foreground" data-testid="admin-events-empty">
          Все още няма събития. Те ще се появят тук, след като моделът за данни бъде свързан.
        </div>
      </div>
    </div>
  );
}
