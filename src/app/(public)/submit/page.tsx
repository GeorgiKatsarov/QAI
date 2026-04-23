import { CalendarClock, Mail, MapPinned, ShieldCheck, Sparkles } from "lucide-react";
import { SubmitEventForm } from "@/components/submit/SubmitEventForm";

const benefits = [
  {
    icon: CalendarClock,
    title: "Сподели най-важното",
    body: "Заглавие, дата, град и категория са достатъчни, за да започне добро предложение.",
  },
  {
    icon: ShieldCheck,
    title: "Преглед преди публикуване",
    body: "Всяко събитие се проверява преди да стане видимо, за да остане публичният поток по-чист и надежден.",
  },
  {
    icon: Mail,
    title: "Лесна връзка при нужда",
    body: "Ако липсва нещо, екипът може да се свърже с теб на посочения имейл.",
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
              Създай обява за събитие
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground">
              Изпрати ново събитие в удобен за преглед формат
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-muted-foreground">
              Ако организираш, промотираш или помагаш за събитие, изпрати го тук. Екипът ще
              прегледа предложението преди то да бъде публикувано в публичния поток.
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
                <h2 className="text-base font-bold text-foreground">Преди да изпратиш</h2>
                <p className="mt-1 text-sm leading-7 text-muted-foreground">
                  Ако събитието има ясно описание, точен час и град, шансът да бъде одобрено
                  бързо без допълнителни въпроси е много по-голям.
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
