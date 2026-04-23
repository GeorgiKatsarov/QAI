import { NextResponse } from "next/server";
import { confirmNotificationSubscription } from "@/lib/services/subscriptions";

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as { token?: string };
    const confirmed = await confirmNotificationSubscription(payload.token ?? "");

    if (!confirmed) {
      return NextResponse.json({ ok: false, error: "Invalid or expired token" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 },
    );
  }
}
