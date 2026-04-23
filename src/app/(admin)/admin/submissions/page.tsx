import { AdminSubmissionActions } from "@/components/events/AdminSubmissionActions";
import { listPendingSubmissions } from "@/lib/services/submissions";

export default async function AdminSubmissionsPage() {
  const submissions = await listPendingSubmissions();

  return (
    <div className="p-8" data-testid="admin-submissions-page">
      <h1 className="text-2xl font-bold mb-2">Submissions</h1>
      <p className="text-muted-foreground mb-8">Review and moderate user-submitted events.</p>

      <div className="rounded-xl border border-border" data-testid="submissions-table">
        {!submissions.length ? (
          <div className="p-6 text-sm text-muted-foreground" data-testid="submissions-empty">
            No pending submissions. Submitted events will appear here for review.
          </div>
        ) : (
          <ul>
            {submissions.map((submission) => (
              <li
                key={submission.id}
                className="flex items-center justify-between border-b px-4 py-3 last:border-none"
                data-testid={`submission-row-${submission.id}`}
              >
                <div>
                  <p className="font-medium">{String((submission.eventDraftData as { title?: string }).title ?? "Untitled")}</p>
                  <p className="text-xs text-muted-foreground">{submission.submitterEmail}</p>
                </div>
                <AdminSubmissionActions id={submission.id} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
