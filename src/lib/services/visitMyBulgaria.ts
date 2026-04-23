import type { EventCardDto } from "@/lib/mappers/events";

type KnownLocation = {
  city: string;
  venueName: string;
  latitude: number;
  longitude: number;
  categorySlug: string;
  category: string;
};

const sourceUrl = "https://visitmybulgaria.com/events-and-festivals/";
const fallbackTitles = [
  { title: "Meadows in the Mountains", summary: "Фестивал за музика и изкуства в планината." },
  { title: "Dunav Ultra", summary: "Вело маратон от Дунав до Черно море." },
  { title: "Smilyan Beans Festival", summary: "Фестивал, посветен на прочутия смилянски фасул." },
  { title: "Pirin Ultra", summary: "Скайрънинг маратон в Пирин." },
  { title: "Zheravna Festival", summary: "Фолклорен фестивал с народни носии и танци." },
  { title: "Beglika Festival", summary: "Алтернативен музикален и артистичен фестивал край язовир Беглика." },
];

const knownLocations: Record<string, KnownLocation> = {
  "meadows in the mountains": {
    city: "Полковник Серафимово",
    venueName: "Родопите",
    latitude: 41.565,
    longitude: 24.741,
    categorySlug: "music",
    category: "Музика",
  },
  "dunav ultra": {
    city: "Видин",
    venueName: "Маршрут Дунав – Черно море",
    latitude: 43.99,
    longitude: 22.872,
    categorySlug: "sports",
    category: "Спорт",
  },
  "smilyan beans festival": {
    city: "Смилян",
    venueName: "с. Смилян",
    latitude: 41.513,
    longitude: 24.695,
    categorySlug: "food",
    category: "Храна",
  },
  "pirin ultra": {
    city: "Банско",
    venueName: "Пирин",
    latitude: 41.838,
    longitude: 23.489,
    categorySlug: "sports",
    category: "Спорт",
  },
  "zheravna festival": {
    city: "Жеравна",
    venueName: "с. Жеравна",
    latitude: 42.849,
    longitude: 26.449,
    categorySlug: "folklore",
    category: "Фолклор",
  },
  "beglika festival": {
    city: "Батак",
    venueName: "яз. Беглика",
    latitude: 41.904,
    longitude: 24.159,
    categorySlug: "music",
    category: "Музика",
  },
};

function cleanText(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function extractPopularEventCards(html: string) {
  const popularStart = html.indexOf("Popular EVENTS");
  const selectedStart = html.indexOf("Selected EXPERIENCES");

  if (popularStart === -1 || selectedStart === -1 || popularStart >= selectedStart) {
    return [] as { title: string; summary: string }[];
  }

  const section = html.slice(popularStart, selectedStart);
  const titleMatches = [...section.matchAll(/<h3[^>]*>(.*?)<\/h3>/gis)];
  const paragraphMatches = [...section.matchAll(/<p[^>]*>(.*?)<\/p>/gis)];

  return titleMatches.map((titleMatch, index) => ({
    title: cleanText(titleMatch[1] ?? ""),
    summary: cleanText(paragraphMatches[index]?.[1] ?? ""),
  }));
}

export async function scrapeVisitMyBulgariaEvents(): Promise<EventCardDto[]> {
  const toEvents = (cards: { title: string; summary: string }[]) =>
    cards
      .map((card) => {
        const normalizedTitle = card.title.toLowerCase();
        const location = knownLocations[normalizedTitle];

        if (!location) {
          return null;
        }

        const slug = `visit-my-bulgaria-${slugify(card.title)}`;
        return {
          id: `scraped-${slug}`,
          slug,
          title: card.title,
          summary: card.summary ?? null,
          description: null,
          city: location.city,
          venueName: location.venueName ?? null,
          startDateTime: new Date().toISOString(),
          latitude: location.latitude,
          longitude: location.longitude,
          category: location.category ?? null,
          categorySlug: location.categorySlug ?? null,
          sourceName: "Visit My Bulgaria",
          sourceUrl: sourceUrl ?? null,
          imageUrl: null,
          isFree: false,
        } as EventCardDto;
      })
      .filter((event): event is EventCardDto => event !== null && event !== undefined);

  try {
    const response = await fetch(sourceUrl, {
      headers: { "User-Agent": "RoamerBot/1.0 (+https://visitmybulgaria.com/events-and-festivals/)" },
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) {
      return [];
    }

    const html = await response.text();
    const cards = extractPopularEventCards(html);
    return toEvents(cards.length ? cards : fallbackTitles);
  } catch {
    return toEvents(fallbackTitles);
  }
}
