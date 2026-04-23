export default function AdminSubmissionsPage() {
  return (
    <div className="p-8" data-testid="admin-submissions-page">
      <h1 className="text-2xl font-bold mb-2">Submissions</h1>
      <p className="text-muted-foreground mb-8">
        Review and moderate user-submitted events.
      </p>

      <div className="rounded-xl border border-border" data-testid="submissions-table">
        <div className="p-6 text-sm text-muted-foreground" data-testid="submissions-empty">
          No pending submissions. Submitted events will appear here for review.
        </div>
      </div>
    </div>
  );
}
