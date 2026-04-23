export default function AdminDashboardPage() {
  return (
    <div className="p-8 text-white" data-testid="admin-dashboard-page">
      <h1 className="mb-2 text-3xl font-bold">Административно табло</h1>
      <p className="mb-8 text-lg">
        Преглед на чакащите действия и активността в платформата.
      </p>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5" data-testid="admin-stat-submissions">
          <p className="text-base">Чакащи предложения</p>
          <p className="mt-1 text-4xl font-bold">—</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5" data-testid="admin-stat-events">
          <p className="text-base">Публикувани събития</p>
          <p className="mt-1 text-4xl font-bold">—</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5" data-testid="admin-stat-sources">
          <p className="text-base">Активни източници</p>
          <p className="mt-1 text-4xl font-bold">—</p>
        </div>
      </div>
    </div>
  );
}
