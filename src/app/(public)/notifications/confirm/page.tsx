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

        <h1 className="mt-5 text-3xl font-extrabold tracking-tight">Потвърди абонамента си</h1>

        {confirmed ? (
          <div data-testid="subscription-confirm-success" className="mt-4 space-y-3 text-emerald-700">
            <p className="text-base font-semibold">Имейлът ти е потвърден.</p>
            <p className="leading-7 text-emerald-800/85">
              Абонаментът вече е активен и бъдещи събития, които съвпадат с предпочитанията ти,
              ще бъдат изпращани по имейл.
            </p>
          </div>
        ) : (
          <div data-testid="subscription-confirm-invalid" className="mt-4 space-y-3 text-destructive">
            <p className="text-base font-semibold">Този линк за потвърждение е невалиден или е изтекъл.</p>
            <p className="leading-7 text-destructive/85">
              Ако е нужно, върни се и създай нов абонамент, за да получиш нов линк за потвърждение.
            </p>
          </div>
        )}

        <Link
          href="/notifications"
          className="mt-8 inline-flex rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold hover:bg-muted"
          data-testid="subscription-confirm-back-link"
        >
          Назад към известията
        </Link>
      </div>
    </div>
  );
}
