"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminSubmissionActions({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function run(action: "approve" | "reject") {
    setLoading(true);
    await fetch(`/api/admin/submissions/${id}/${action}`, { method: "POST" });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        className="rounded border px-2 py-1 text-xs"
        data-testid={`approve-button-${id}`}
        disabled={loading}
        onClick={() => run("approve")}
      >
        Одобри
      </button>
      <button
        className="rounded border px-2 py-1 text-xs"
        data-testid={`reject-button-${id}`}
        disabled={loading}
        onClick={() => run("reject")}
      >
        Отхвърли
      </button>
    </div>
  );
}
