export default function AdminDashboardPage() {
  return (
    <div className="p-8" data-testid="admin-dashboard-page">
      <h1 className="text-2xl font-bold mb-2">Административно табло</h1>
      <p className="text-muted-foreground mb-8">
        Преглед на чакащите действия и активността в платформата.
      </p>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5" data-testid="admin-stat-submissions">
          <p className="text-sm text-muted-foreground">Чакащи предложения</p>
          <p className="text-3xl font-bold mt-1">—</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5" data-testid="admin-stat-events">
          <p className="text-sm text-muted-foreground">Публикувани събития</p>
          <p className="text-3xl font-bold mt-1">—</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5" data-testid="admin-stat-sources">
          <p className="text-sm text-muted-foreground">Активни източници</p>
          <p className="text-3xl font-bold mt-1">—</p>
        </div>
      </div>
    </div>
  );
}
