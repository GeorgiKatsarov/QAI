import { NextResponse } from "next/server";
import { rejectSubmission } from "@/lib/services/submissions";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await rejectSubmission(id);
  return NextResponse.json({ ok: true });
}
