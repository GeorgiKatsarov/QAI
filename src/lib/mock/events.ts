export type MockEvent = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description?: string;
  city: string;
  venueName: string;
  startDateTime: string;
  latitude?: number;
  longitude?: number;
  category: { slug: string; name: string };
  source?: { name: string; url?: string };
  imageUrl?: string;
  isFree: boolean;
};

export const mockEvents: MockEvent[] = [
  {
    id: "evt-sofia-jazz",
    slug: "sofia-jazz-festival-2026",
    title: "София Джаз Фестивал 2026",
    summary: "Три дни с джаз от световна класа в НДК.",
    city: "София",
    venueName: "Национален дворец на културата",
    startDateTime: "2026-05-12T19:00:00.000Z",
    latitude: 42.685311,
    longitude: 23.319941,
    category: { slug: "music", name: "Музика" },
    source: { name: "Ръчно добавяне" },
    isFree: false,
  },
  {
    id: "evt-plovdiv-creative",
    slug: "kapana-creative-festival-plovdiv-2026",
    title: "Капана Крийейтив Фестивал Пловдив 2026",
    summary: "Изкуство, дизайн и пърформанси в квартал Капана.",
    city: "Пловдив",
    venueName: "Квартал Капана",
    startDateTime: "2026-05-21T10:00:00.000Z",
    latitude: 42.149085,
    longitude: 24.749579,
    category: { slug: "art", name: "Изкуство и изложби" },
    source: { name: "grabo.bg", url: "https://grabo.bg" },
    isFree: true,
  },
  {
    id: "evt-varna-marathon",
    slug: "black-sea-marathon-varna-2026",
    title: "Черноморски маратон Варна 2026",
    summary: "Пълен маратон, полумаратон и 10 км по крайбрежието.",
    city: "Варна",
    venueName: "Морската градина",
    startDateTime: "2026-06-01T08:00:00.000Z",
    latitude: 43.21405,
    longitude: 27.953809,
    category: { slug: "sports", name: "Спорт" },
    source: { name: "Ръчно добавяне" },
    isFree: false,
  },
];
