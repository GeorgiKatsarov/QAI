import Link from "next/link";
import { Map, Calendar, Send, Bell } from "lucide-react";

const cards = [
  {
    href: "/map",
    testId: "home-cta-map",
    icon: Map,
    label: "Map View",
    sub: "Browse by location",
    gradient: "from-[#4A9ADE] to-[#7BBDE8]",
  },
  {
    href: "/calendar",
    testId: "home-cta-calendar",
    icon: Calendar,
    label: "Calendar View",
    sub: "Browse by date",
    gradient: "from-[#6BB5E8] to-[#A8D8F5]",
  },
  {
    href: "/submit",
    testId: "home-cta-submit",
    icon: Send,
    label: "Submit an Event",
    sub: "Add your event",
    gradient: "from-[#D778B8] to-[#F0A7D0]",
  },
  {
    href: "/notifications",
    testId: "home-cta-notifications",
    icon: Bell,
    label: "Get Notified",
    sub: "Event digests by email",
    gradient: "from-[#B07FD8] to-[#D4A8F0]",
  },
];

export default function HomePage() {
  return (
    <div
      className="container mx-auto px-4 py-20 flex flex-col items-center"
      data-testid="home-page"
    >
      {/* Hero */}
      <div className="text-center max-w-xl space-y-4 mb-14">
        <div
          className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-2"
          style={{ background: "#FCE8F4", color: "#B0539A" }}
        >
          ✨ Bulgaria&apos;s event discovery platform
        </div>
        <h1
          className="text-5xl font-extrabold leading-tight"
          style={{ color: "#1A4068" }}
        >
          Find your next
          <span
            className="block"
            style={{
              background: "linear-gradient(90deg, #4A9ADE, #B07FD8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            favourite event
          </span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Concerts, exhibitions, markets and more — all across Bulgaria.
        </p>
      </div>

      {/* CTA grid */}
      <div className="grid grid-cols-2 gap-5 w-full max-w-lg">
        {cards.map(({ href, testId, icon: Icon, label, sub, gradient }) => (
          <Link
            key={href}
            href={href}
            data-testid={testId}
            className={`bg-gradient-to-br ${gradient} flex flex-col items-center gap-3 p-7 rounded-2xl text-white text-center shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all`}
          >
            <span className="flex items-center justify-center size-11 rounded-xl bg-white/25">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="font-bold text-base">{label}</p>
              <p className="text-sm opacity-80">{sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
