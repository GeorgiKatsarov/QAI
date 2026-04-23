import { NextResponse } from "next/server";
import { createSubmission } from "@/lib/services/submissions";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const submission = await createSubmission(payload);
    return NextResponse.json({ ok: true, submissionId: submission.id });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 }
    );
  }
}
