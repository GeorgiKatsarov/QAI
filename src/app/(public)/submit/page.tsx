import { CalendarClock, Mail, MapPinned, ShieldCheck, Sparkles } from "lucide-react";
import { SubmitEventForm } from "@/components/submit/SubmitEventForm";

const benefits = [
  {
    icon: CalendarClock,
    title: "Share the essentials",
    body: "Title, timing, city, and category are enough to get a strong submission started.",
  },
  {
    icon: ShieldCheck,
    title: "Reviewed before publishing",
    body: "Every event is checked before it goes live, so the public feed stays cleaner and more reliable.",
  },
  {
    icon: Mail,
    title: "Easy follow-up if needed",
    body: "If something is missing, the review team can reach out to the contact email you provide.",
  },
];

export default function SubmitPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-10" data-testid="submit-event-page">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-border/70 bg-gradient-to-br from-[#F6FBFF] via-white to-[#FFF3F9] p-7 shadow-[0_20px_70px_rgba(74,154,222,0.12)]">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              <Sparkles className="size-3.5" />
              Create an event listing
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground">
              Submit a new event in a format that is easy to review
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-muted-foreground">
              If you are organizing, promoting, or helping with an event, send it here. The team
              will review the submission before publishing it to the public event feed.
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

          <div className="rounded-[1.5rem] border border-border/70 bg-white/80 p-5">
            <div className="flex items-start gap-3">
              <MapPinned className="mt-1 size-5 text-primary" />
              <div>
                <h2 className="text-base font-bold text-foreground">Before you submit</h2>
                <p className="mt-1 text-sm leading-7 text-muted-foreground">
                  If the event has a strong description, exact timing, and a clear city, it is much
                  more likely to be approved quickly without follow-up questions.
                </p>
              </div>
            </div>
          </div>
        </section>

        <SubmitEventForm />
      </div>
    </div>
  );
}
