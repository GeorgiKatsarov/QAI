import Link from "next/link";
import { Map, Calendar, Send, Bell } from "lucide-react";

const cards = [
  {
    href: "/map",
    testId: "home-cta-map",
    icon: Map,
    label: "Map View",
    sub: "Browse by location",
  },
  {
    href: "/calendar",
    testId: "home-cta-calendar",
    icon: Calendar,
    label: "Calendar View",
    sub: "Browse by date",
  },
  {
    href: "/submit",
    testId: "home-cta-submit",
    icon: Send,
    label: "Submit an Event",
    sub: "Add your event",
  },
  {
    href: "/notifications",
    testId: "home-cta-notifications",
    icon: Bell,
    label: "Get Notified",
    sub: "Event digests by email",
  },
];

const collageSlides = [
  [
    "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1400&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1472653431158-6364773b2a56?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1496024840928-4c417adf211d?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1475727946784-2890d7678af1?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1400&q=80",
  ],
];

const tileLayout = [
  "col-span-4 row-span-3",
  "col-span-4 row-span-2",
  "col-span-4 row-span-4",
  "col-span-5 row-span-3",
  "col-span-3 row-span-4",
  "col-span-4 row-span-2",
];

export default function HomePage() {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      data-testid="home-page"
    >
      <div className="pointer-events-none absolute inset-0">
        {collageSlides.map((slide, slideIndex) => (
          <div
            key={slide[0]}
            className="absolute inset-0 home-collage-slide"
            style={{ animationDelay: `${slideIndex * 8}s` }}
          >
            <div className="grid h-full grid-cols-12 grid-rows-6 gap-3 p-4 md:p-8">
              {slide.map((imageUrl, imageIndex) => (
                <div
                  key={imageUrl}
                  className={`${tileLayout[imageIndex]} rounded-3xl border border-white/20 bg-cover bg-center shadow-lg`}
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-[#0f2740]/35 backdrop-blur-sm" />

      <div className="relative z-10 container mx-auto flex min-h-screen flex-col items-center justify-center px-4 text-white">
        <div className="grid w-full max-w-lg grid-cols-2 gap-5">
          {cards.map(({ href, testId, icon: Icon, label, sub }) => (
            <Link
              key={href}
              href={href}
              data-testid={testId}
              className="flex flex-col items-center gap-3 rounded-2xl border border-white/30 bg-[#4a8ccf]/85 p-7 text-center text-white shadow-lg shadow-[#0f2740]/40 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-[#5b9fe3]/90 hover:shadow-xl"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-white/25">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-base font-bold">{label}</p>
                <p className="text-sm opacity-80">{sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
