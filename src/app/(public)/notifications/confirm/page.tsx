import Link from "next/link";
import { CheckCircle2, MailWarning } from "lucide-react";
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
    <div className="container mx-auto max-w-3xl px-4 py-12" data-testid="notifications-confirm-page">
      <div className="rounded-[2rem] border border-border/70 bg-white/85 p-8 shadow-[0_24px_80px_rgba(74,154,222,0.14)]">
        <div
          className={`inline-flex size-14 items-center justify-center rounded-2xl ${
            confirmed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
          }`}
        >
          {confirmed ? <CheckCircle2 className="size-7" /> : <MailWarning className="size-7" />}
        </div>

        <h1 className="mt-5 text-3xl font-extrabold tracking-tight">Confirm your subscription</h1>

        {confirmed ? (
          <div data-testid="subscription-confirm-success" className="mt-4 space-y-3 text-emerald-700">
            <p className="text-base font-semibold">Your email is confirmed.</p>
            <p className="leading-7 text-emerald-800/85">
              Your digest is now active and future matching events will be sent based on the
              preferences you selected.
            </p>
          </div>
        ) : (
          <div data-testid="subscription-confirm-invalid" className="mt-4 space-y-3 text-destructive">
            <p className="text-base font-semibold">This confirmation link is invalid or expired.</p>
            <p className="leading-7 text-destructive/85">
              If needed, go back and create a new subscription so a fresh confirmation link can be
              generated.
            </p>
          </div>
        )}

        <Link
          href="/notifications"
          className="mt-8 inline-flex rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold hover:bg-muted"
          data-testid="subscription-confirm-back-link"
        >
          Return to notifications
        </Link>
      </div>
    </div>
  );
}
