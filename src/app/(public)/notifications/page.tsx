import { BellRing, MailCheck, SlidersHorizontal, Sparkles } from "lucide-react";
import { NotificationSubscriptionForm } from "@/components/notifications/NotificationSubscriptionForm";

const benefits = [
  {
    icon: SlidersHorizontal,
    title: "Настрой предпочитанията си",
    body: "Избери градове, категории, бюджет и дали искаш само безплатни събития.",
  },
  {
    icon: BellRing,
    title: "Избери честота",
    body: "Получавай ежедневен поток или по-спокойно седмично обобщение според навиците си.",
  },
  {
    icon: MailCheck,
    title: "Остани в контрол",
    body: "Всеки абонамент се потвърждава по имейл и може да бъде променян или премахнат по-късно.",
  },
];

export default function NotificationsPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-10" data-testid="notifications-page">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-border/70 bg-gradient-to-br from-[#F6FBFF] via-white to-[#FFF3F9] p-7 shadow-[0_20px_70px_rgba(74,154,222,0.12)]">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              <Sparkles className="size-3.5" />
              Персонализирани известия
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground">
              Получавай по-добри имейли за събития с по-малко шум
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-muted-foreground">
              Абонирай се веднъж и остави Roamer да филтрира потока от събития в България до
              нещо по-полезно: правилните места, правилните категории и честота на изпращане,
              която отговаря на това колко често реално искаш обновления.
            </p>
          </div>

          <div className="grid gap-4">
            {benefits.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-[1.5rem] border border-border/70 bg-white/80 p-5 shadow-[0_10px_35px_rgba(74,154,222,0.08)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#EAF5FF] text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">{title}</h2>
                    <p className="mt-1 text-sm leading-7 text-muted-foreground">{body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <NotificationSubscriptionForm />
      </div>
    </div>
  );
}
