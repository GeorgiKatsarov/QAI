import Link from "next/link";
import { unsubscribeNotificationSubscription } from "@/lib/services/subscriptions";

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";

  const isValidToken = token.length > 0;
  const unsubscribed = isValidToken ? await unsubscribeNotificationSubscription(token) : false;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10" data-testid="notifications-unsubscribe-page">
      <h1 className="text-2xl font-bold">Manage subscription</h1>

      {unsubscribed ? (
        <p className="mt-3 text-green-700" data-testid="subscription-unsubscribe-success">
          You have been unsubscribed from event notifications.
        </p>
      ) : (
        <p className="mt-3 text-destructive" data-testid="subscription-unsubscribe-invalid">
          This unsubscribe link is invalid or expired.
        </p>
      )}

      <Link href="/notifications" className="mt-6 inline-block text-sm underline" data-testid="subscription-unsubscribe-back-link">
        Return to notifications
      </Link>
    </div>
  );
}
