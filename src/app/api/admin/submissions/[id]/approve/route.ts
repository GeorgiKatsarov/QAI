import { NextResponse } from "next/server";
import { approveSubmission } from "@/lib/services/submissions";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await approveSubmission(id);
  return NextResponse.json({ ok: true });
}
