export type MockEvent = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  city: string;
  venueName: string;
  startDateTime: string;
  category: { slug: string; name: string };
  source?: { name: string; url?: string };
  isFree: boolean;
};

export const mockEvents: MockEvent[] = [
  {
    id: "evt-sofia-jazz",
    slug: "sofia-jazz-festival-2026",
    title: "Sofia Jazz Festival 2026",
    summary: "Three days of world-class jazz at NDK.",
    city: "Sofia",
    venueName: "National Palace of Culture",
    startDateTime: "2026-05-12T19:00:00.000Z",
    category: { slug: "music", name: "Music" },
    source: { name: "Manual Submission" },
    isFree: false,
  },
  {
    id: "evt-plovdiv-creative",
    slug: "kapana-creative-festival-plovdiv-2026",
    title: "Капана Крийейтив Фестивал Пловдив 2026",
    summary: "Art, design, and performances in Kapana district.",
    city: "Plovdiv",
    venueName: "Kapana District",
    startDateTime: "2026-05-21T10:00:00.000Z",
    category: { slug: "art", name: "Art & Exhibitions" },
    source: { name: "grabo.bg", url: "https://grabo.bg" },
    isFree: true,
  },
  {
    id: "evt-varna-marathon",
    slug: "black-sea-marathon-varna-2026",
    title: "Black Sea Marathon Varna 2026",
    summary: "Full marathon, half marathon, and 10K along the seaside.",
    city: "Varna",
    venueName: "Varna Sea Gardens",
    startDateTime: "2026-06-01T08:00:00.000Z",
    category: { slug: "sports", name: "Sports" },
    source: { name: "Manual Submission" },
    isFree: false,
  },
];
