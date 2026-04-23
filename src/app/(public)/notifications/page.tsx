import { BellRing, MailCheck, SlidersHorizontal, Sparkles } from "lucide-react";
import { NotificationSubscriptionForm } from "@/components/notifications/NotificationSubscriptionForm";

const benefits = [
  {
    icon: SlidersHorizontal,
    title: "Tune your filters",
    body: "Choose cities, categories, budget, and whether you only want free events.",
  },
  {
    icon: BellRing,
    title: "Pick your cadence",
    body: "Get a daily stream or a quieter weekly roundup depending on how often you browse.",
  },
  {
    icon: MailCheck,
    title: "Stay in control",
    body: "Every subscription is confirmed by email and can be changed or removed later.",
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
              Personalized notifications
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground">
              Get better event emails with less noise
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-muted-foreground">
              Subscribe once and let Roamer filter Bulgaria&apos;s event stream into something more
              useful: the right places, the right categories, and a delivery schedule that fits how
              often you actually want updates.
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
