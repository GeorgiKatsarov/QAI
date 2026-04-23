import { NextResponse } from "next/server";
import { createNotificationSubscription } from "@/lib/services/subscriptions";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const subscription = await createNotificationSubscription(payload);

    return NextResponse.json({
      ok: true,
      subscriptionId: subscription.id,
      confirmationToken: subscription.confirmationToken,
      unsubscribeToken: subscription.unsubscribeToken,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 },
    );
  }
}
