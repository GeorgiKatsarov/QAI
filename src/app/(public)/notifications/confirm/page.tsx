import Link from "next/link";
import { confirmNotificationSubscription } from "@/lib/services/subscriptions";

export default async function ConfirmSubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";

  const isValidToken = token.length > 0;
  const confirmed = isValidToken ? await confirmNotificationSubscription(token) : false;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10" data-testid="notifications-confirm-page">
      <h1 className="text-2xl font-bold">Confirm your subscription</h1>

      {confirmed ? (
        <p className="mt-3 text-green-700" data-testid="subscription-confirm-success">
          Your email is confirmed. You will now receive event notifications.
        </p>
      ) : (
        <p className="mt-3 text-destructive" data-testid="subscription-confirm-invalid">
          This confirmation link is invalid or expired.
        </p>
      )}

      <Link href="/notifications" className="mt-6 inline-block text-sm underline" data-testid="subscription-confirm-back-link">
        Return to notifications
      </Link>
    </div>
  );
}
