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
  { title: "Meadows in the Mountains", summary: "Music and arts festival in the mountains." },
  { title: "Dunav Ultra", summary: "Cycling marathon from the Danube River to the Black Sea." },
  { title: "Smilyan Beans Festival", summary: "Festival celebrating the famous Smilyan bean tradition." },
  { title: "Pirin Ultra", summary: "Skyrunning marathon in the Pirin mountains." },
  { title: "Zheravna Festival", summary: "Folklore festival with traditional costumes and dances." },
  { title: "Beglika Festival", summary: "Alternative music and art event near Beglik Dam." },
];

const knownLocations: Record<string, KnownLocation> = {
  "meadows in the mountains": {
    city: "Polkovnik Serafimovo",
    venueName: "Rhodope Mountains",
    latitude: 41.565,
    longitude: 24.741,
    categorySlug: "music",
    category: "Music",
  },
  "dunav ultra": {
    city: "Vidin",
    venueName: "Danube-to-Black-Sea Route",
    latitude: 43.99,
    longitude: 22.872,
    categorySlug: "sports",
    category: "Sports",
  },
  "smilyan beans festival": {
    city: "Smilyan",
    venueName: "Smilyan Village",
    latitude: 41.513,
    longitude: 24.695,
    categorySlug: "food",
    category: "Food",
  },
  "pirin ultra": {
    city: "Bansko",
    venueName: "Pirin Mountain",
    latitude: 41.838,
    longitude: 23.489,
    categorySlug: "sports",
    category: "Sports",
  },
  "zheravna festival": {
    city: "Zheravna",
    venueName: "Zheravna Village",
    latitude: 42.849,
    longitude: 26.449,
    categorySlug: "folklore",
    category: "Folklore",
  },
  "beglika festival": {
    city: "Batak",
    venueName: "Beglik Dam",
    latitude: 41.904,
    longitude: 24.159,
    categorySlug: "music",
    category: "Music",
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
          city: location.city,
          venueName: location.venueName ?? null,
          startDateTime: new Date().toISOString(),
          latitude: location.latitude,
          longitude: location.longitude,
          category: location.category ?? null,
          categorySlug: location.categorySlug ?? null,
          sourceName: "Visit My Bulgaria",
          sourceUrl: sourceUrl ?? null,
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
