import { AdminSubmissionActions } from "@/components/events/AdminSubmissionActions";
import { listPendingSubmissions } from "@/lib/services/submissions";

export default async function AdminSubmissionsPage() {
  const submissions = await listPendingSubmissions();

  return (
    <div className="p-8" data-testid="admin-submissions-page">
      <h1 className="text-2xl font-bold mb-2">Предложения</h1>
      <p className="text-muted-foreground mb-8">Преглеждайте и модерирайте изпратените от потребители събития.</p>

      <div className="rounded-xl border border-border" data-testid="submissions-table">
        {!submissions.length ? (
          <div className="p-6 text-sm text-muted-foreground" data-testid="submissions-empty">
            Няма чакащи предложения. Изпратените събития ще се появят тук за преглед.
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
                  <p className="font-medium">
                    {String((submission.eventDraftData as { title?: string }).title ?? "Без заглавие")}
                  </p>
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
