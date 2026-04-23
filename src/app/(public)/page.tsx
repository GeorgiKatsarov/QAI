import Link from "next/link";
import { Map, Calendar, Send, Bell } from "lucide-react";
import { listPublicEvents } from "@/lib/services/events";

const cards = [
  {
    href: "/map",
    testId: "home-cta-map",
    icon: Map,
    label: "Карта",
    sub: "Разгледай по локация",
  },
  {
    href: "/calendar",
    testId: "home-cta-calendar",
    icon: Calendar,
    label: "Календар",
    sub: "Разгледай по дата",
  },
  {
    href: "/submit",
    testId: "home-cta-submit",
    icon: Send,
    label: "Добави събитие",
    sub: "Изпрати ново събитие",
  },
  {
    href: "/notifications",
    testId: "home-cta-notifications",
    icon: Bell,
    label: "Известия",
    sub: "Имейл бюлетини за събития",
  },
];

const fallbackSlides = [
  "https://festivali.eu/wp-content/uploads/2026/04/%D0%9A%D1%83%D0%BB%D0%B8%D0%BD%D0%B0%D1%80%D0%B5%D0%BD-%D0%BF%D1%80%D0%B0%D0%B7%D0%BD%D0%B8%D0%BA-%D0%A7%D0%BE%D1%80%D0%B1%D0%B0-%D0%BE%D1%82-%D0%B0%D0%B3%D0%BD%D0%B5%D1%88%D0%BA%D0%B8-%D1%87%D1%80%D0%B5%D0%B2%D1%86%D0%B0-%D0%B8-%D0%90%D0%B3%D0%BD%D0%B5%D1%88%D0%BA%D0%B8-%D0%B5%D0%B7%D0%B8%D1%87%D0%B5%D1%82%D0%B0-%D0%B2-%D1%81%D0%B5%D0%BB%D1%81%D0%BA%D0%BE-%D1%85%D0%BB%D0%B5%D0%B1%D1%87%D0%B5.jpg",
  "https://festivali.eu/wp-content/uploads/2026/04/%D0%9F%D1%80%D0%B0%D0%B7%D0%BD%D0%B8%D0%BA-%D0%BD%D0%B0-%D0%97%D0%B5%D0%BB%D0%BD%D0%B8%D0%BA%D0%B0-%D0%B8-%D0%A1%D0%BB%D0%B0%D0%B4%D0%BA%D0%B8%D1%82%D0%B5-%D0%B8%D0%B7%D0%BA%D1%83%D1%88%D0%B5%D0%BD%D0%B8%D1%8F-2026-%D0%B2-%D1%81.-%D0%96%D0%B0%D0%B1%D0%BE%D0%BA%D1%80%D1%8A%D1%82.jpg",
  "https://festivali.eu/wp-content/uploads/2026/03/%D0%9C%D0%BB%D0%B0%D0%B4%D0%B5%D0%B6%D0%BA%D0%B0-%D0%9A%D1%83%D0%BB%D0%B8%D0%BD%D0%B0%D1%80%D0%BD%D0%B0-%D1%81%D1%86%D0%B5%D0%BD%D0%B0-%D0%B2-%D0%9C%D0%BE%D0%BC%D1%87%D0%B8%D0%BB%D0%B3%D1%80%D0%B0%D0%B4-2026.jpg",
  "https://festivali.eu/wp-content/uploads/2026/03/%D0%9A%D1%83%D0%BB%D0%B8%D0%BD%D0%B0%D1%80%D0%BD%D0%BE-%D1%84%D0%BE%D0%BB%D0%BA%D0%BB%D0%BE%D1%80%D0%B5%D0%BD-%D0%BF%D1%80%D0%B0%D0%B7%D0%BD%D0%B8%D0%BA-%D0%9A%D0%B0%D1%87%D0%B0%D0%BC%D0%B0%D0%BA-%D0%B8-%D0%A8%D0%BE%D0%BF%D1%81%D0%BA%D0%B0-%D1%82%D0%BE%D0%BF%D0%B5%D0%BD%D0%B8%D1%86%D0%B0.jpg",
  "https://festivali.eu/wp-content/uploads/2025/02/%D0%A4%D0%B5%D1%81%D1%82%D0%B8%D0%B2%D0%B0%D0%BB-%D0%BD%D0%B0-%D0%B7%D0%B0%D0%BD%D0%B0%D1%8F%D1%82%D0%B8%D1%82%D0%B5-%D0%B8-%D0%B8%D0%B7%D0%BA%D1%83%D1%81%D1%82%D0%B2%D0%B0%D1%82%D0%B0-%E2%80%93-%D0%94%D0%BE%D0%B1%D1%80%D0%B8%D1%87-2025.jpg",
];

export default async function HomePage() {
  const events = await listPublicEvents({ page: 1, pageSize: 24 });
  const eventSlides = [...new Set(events.items.map((event) => event.imageUrl).filter(Boolean))] as string[];
  const slides = eventSlides.length >= 3 ? eventSlides.slice(0, 8) : fallbackSlides;

  return (
    <div
      className="relative min-h-[calc(100vh-80px)] overflow-hidden"
      data-testid="home-page"
    >
      <div className="pointer-events-none absolute inset-0">
        {slides.map((imageUrl, slideIndex) => (
          <div
            key={`${imageUrl}-${slideIndex}`}
            className="absolute inset-0 home-photo-slide"
            style={{
              animationDelay: `${slideIndex * 5}s`,
              backgroundImage: `url(${imageUrl})`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-[#10253f]/45 backdrop-blur-md" />

      <div className="absolute inset-0 bg-[#d8e8e2]/38 backdrop-blur-[1.5px]" />

      <div className="relative z-10 container mx-auto flex min-h-screen flex-col items-center justify-center px-4 text-white">
        <div className="grid w-full max-w-lg grid-cols-2 gap-5">
          {cards.map(({ href, testId, icon: Icon, label, sub }) => (
            <Link
              key={href}
              href={href}
              data-testid={testId}
              className="flex flex-col items-center gap-3 rounded-2xl border border-white/70 bg-white/42 p-7 text-center text-white shadow-xl shadow-[#4b6660]/20 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/52 hover:shadow-2xl"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-white/25">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-base font-bold">{label}</p>
                <p className="text-sm text-white/90">{sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
