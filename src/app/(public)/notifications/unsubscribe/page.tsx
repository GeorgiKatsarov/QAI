import Link from "next/link";
import { BellOff, CircleAlert } from "lucide-react";
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
    <div className="container mx-auto max-w-3xl px-4 py-12" data-testid="notifications-unsubscribe-page">
      <div className="rounded-[2rem] border border-border/70 bg-white/85 p-8 shadow-[0_24px_80px_rgba(74,154,222,0.14)]">
        <div
          className={`inline-flex size-14 items-center justify-center rounded-2xl ${
            unsubscribed ? "bg-sky-100 text-sky-700" : "bg-rose-100 text-rose-700"
          }`}
        >
          {unsubscribed ? <BellOff className="size-7" /> : <CircleAlert className="size-7" />}
        </div>

        <h1 className="mt-5 text-3xl font-extrabold tracking-tight">Управлявай абонамента си</h1>

        {unsubscribed ? (
          <div
            className="mt-4 space-y-3 text-sky-700"
            data-testid="subscription-unsubscribe-success"
          >
            <p className="text-base font-semibold">Абонаментът е прекратен.</p>
            <p className="leading-7 text-sky-800/85">
              Повече няма да получаваш бюлетини за този абонамент. Можеш да създадеш нов по всяко време
              с различни предпочитания.
            </p>
          </div>
        ) : (
          <div
            className="mt-4 space-y-3 text-destructive"
            data-testid="subscription-unsubscribe-invalid"
          >
            <p className="text-base font-semibold">Този линк за отписване е невалиден или е изтекъл.</p>
            <p className="leading-7 text-destructive/85">
              Ако все още искаш да спреш тези имейли, използвай валиден линк за отписване от получен бюлетин.
            </p>
          </div>
        )}

        <Link
          href="/notifications"
          className="mt-8 inline-flex rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold hover:bg-muted"
          data-testid="subscription-unsubscribe-back-link"
        >
          Назад към известията
        </Link>
      </div>
    </div>
  );
}
