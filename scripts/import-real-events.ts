import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, EventStatus, TrustLevel } from "../src/generated/prisma";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as never);

const categorySeeds = {
  music: { name: "Music", color: "#7c3aed" },
  art: { name: "Art & Exhibitions", color: "#db2777" },
  food: { name: "Food & Drink", color: "#ea580c" },
  other: { name: "Other", color: "#6b7280" },
} as const;

const sourceSeeds = {
  visitPlovdiv: {
    name: "visitplovdiv.com",
    baseUrl: "https://www.visitplovdiv.com",
    trustLevel: TrustLevel.HIGH,
  },
  visitVarna: {
    name: "visit.varna.bg",
    baseUrl: "https://www.visit.varna.bg",
    trustLevel: TrustLevel.HIGH,
  },
  sofiaLiveFest: {
    name: "sofialivefest.com",
    baseUrl: "https://sofialivefest.com",
    trustLevel: TrustLevel.HIGH,
  },
  sofiaAmf: {
    name: "sofiaamf.com",
    baseUrl: "https://www.sofiaamf.com",
    trustLevel: TrustLevel.HIGH,
  },
} as const;

const tagNames = ["festival", "live-music", "food-market", "outdoor"] as const;

const realEvents = [
  {
    slug: "bulgarian-folklore-festival-plovdiv-2026",
    title: "Bulgarian Folklore Festival - Plovdiv 2026",
    summary:
      "Three days of Bulgarian songs, dances, crafts, and customs in Lauta Park.",
    description:
      "One of Bulgaria's largest folklore festivals returns to Plovdiv with three stages, thousands of performers from across the country, and a city-scale celebration of traditional music, dance, and craft culture. The event is part of Plovdiv's official Cultural Calendar for 2026.",
    startDateTime: "2026-05-15T10:00:00+03:00",
    endDateTime: "2026-05-17T22:00:00+03:00",
    venueName: "Lauta Park",
    address: "Lauta Park, Plovdiv",
    city: "Plovdiv",
    latitude: 42.1356,
    longitude: 24.7688,
    categorySlug: "art",
    sourceKey: "visitPlovdiv",
    sourceUrl: "https://www.visitplovdiv.com/en/node/14931",
    imageUrl:
      "https://www.visitplovdiv.com/sites/default/files/cropped-2026-business-cover-image-1.png",
    isFree: true,
    isOutdoor: true,
    featured: true,
    tags: ["festival"],
  },
  {
    slug: "wine-and-gourmet-festival-plovdiv-2026",
    title: "Wine and Gourmet Festival 2026",
    summary:
      "Bulgarian wines, artisan food, and tastings across Plovdiv's Old Town.",
    description:
      "Historic houses and courtyards in the Old Town of Plovdiv turn into tasting rooms for Bulgarian wineries, artisan food producers, and gourmet showcases. The festival is positioned as a sensory encounter with local wine and cuisine and is part of Plovdiv's 2026 tourism program.",
    startDateTime: "2026-05-08T11:00:00+03:00",
    endDateTime: "2026-05-10T22:00:00+03:00",
    venueName: "Old Town of Plovdiv",
    address: "Old Town, Plovdiv",
    city: "Plovdiv",
    latitude: 42.1497,
    longitude: 24.7534,
    categorySlug: "food",
    sourceKey: "visitPlovdiv",
    sourceUrl: "https://www.visitplovdiv.com/en/node/15503",
    imageUrl:
      "https://www.visitplovdiv.com/sites/default/files/658970568_1535765885216599_5872406205925990060_n.jpg",
    isFree: false,
    isOutdoor: true,
    featured: true,
    tags: ["festival", "food-market"],
  },
  {
    slug: "fall-of-memories-festival-competition-varna-2026",
    title: "Fall of Memories Festival-Competition 2026",
    summary:
      "A Varna festival celebrating folklore, nostalgic songs, sacred music, and spoken word.",
    description:
      "Founded in 1997, the Fall of Memories festival-competition brings together senior ensembles and performers across categories including urban songs, authentic folklore, arranged folk dance, sacred music, and artistic recitation. It takes place at the Palace of Culture and Sports in Varna with municipal support.",
    startDateTime: "2026-10-17T10:00:00+03:00",
    endDateTime: "2026-10-18T20:00:00+03:00",
    venueName: "Palace of Culture and Sports",
    address: "Palace of Culture and Sports, Varna",
    city: "Varna",
    latitude: 43.2143,
    longitude: 27.9479,
    categorySlug: "music",
    sourceKey: "visitVarna",
    sourceUrl:
      "https://www.visit.varna.bg/en/event/festival-konkurs-listopad-na-spomenite-2026.html",
    imageUrl: "https://www.visit.varna.bg/media/images/58/e8//Listopad.jpg",
    isFree: false,
    featured: false,
    tags: ["festival"],
  },
  {
    slug: "sofia-live-festival-2026",
    title: "Sofia Live Festival 2026",
    summary:
      "A two-day outdoor music festival at Vidas Art Arena in Borisova Garden.",
    description:
      "Sofia Live Festival returns to Vidas Art Arena for two summer days in the heart of Sofia. The official site positions the event as the centerpiece of a broader year-round series, with on-site family programming, a kids zone, graffiti activations, and transport guidance for the Borisova Garden venue.",
    startDateTime: "2026-06-27T17:00:00+03:00",
    endDateTime: "2026-06-28T23:00:00+03:00",
    venueName: "Vidas Art Arena",
    address: "Borisova Gradina, Sofia",
    city: "Sofia",
    latitude: 42.6849,
    longitude: 23.3457,
    categorySlug: "music",
    sourceKey: "sofiaLiveFest",
    sourceUrl: "https://sofialivefest.com/",
    imageUrl: "https://sofialivefest.com/wp-content/uploads/2025/12/social.jpg",
    isFree: false,
    isFamilyFriendly: true,
    isOutdoor: true,
    featured: true,
    tags: ["festival", "live-music", "outdoor"],
  },
  {
    slug: "sofia-art-and-music-festival-2026",
    title: "Sofia Art and Music Festival 2026",
    summary:
      "Two weeks of performances, premieres, and exhibitions centered around Bulgaria Hall.",
    description:
      "The Sofia Art and Music Festival gathers composers, conductors, artists, and performers from around the world for two weeks of rehearsals, premieres, and exhibitions in Sofia. In partnership with the Sofia Philharmonic Orchestra, the program culminates in final concerts at Bulgaria Hall and includes visual art installations across the Bulgaria Concert Complex.",
    startDateTime: "2026-06-29T10:00:00+03:00",
    endDateTime: "2026-07-13T22:00:00+03:00",
    venueName: "Bulgaria Hall",
    address: "1 Aksakov St, Sofia",
    city: "Sofia",
    latitude: 42.6928,
    longitude: 23.3252,
    categorySlug: "music",
    sourceKey: "sofiaAmf",
    sourceUrl: "https://www.sofiaamf.com/",
    imageUrl:
      "https://static.wixstatic.com/media/33a842_eb5d5354955e4d62bde85ad4d9722153~mv2.png/v1/crop/x_284,y_200,w_2680,h_2075/fill/w_599,h_463,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/color.png",
    isFree: false,
    featured: true,
    tags: ["festival", "live-music"],
  },
] as const;

async function ensureCategories() {
  const entries = await Promise.all(
    Object.entries(categorySeeds).map(([slug, value]) =>
      prisma.category.upsert({
        where: { slug },
        update: value,
        create: { slug, ...value },
      })
    )
  );

  return Object.fromEntries(entries.map((category) => [category.slug, category]));
}

async function ensureSources() {
  const entries = await Promise.all(
    Object.values(sourceSeeds).map((source) =>
      prisma.source.upsert({
        where: { name: source.name },
        update: {
          baseUrl: source.baseUrl,
          trustLevel: source.trustLevel,
          scrapingEnabled: true,
        },
        create: {
          ...source,
          scrapingEnabled: true,
        },
      })
    )
  );

  return Object.fromEntries(entries.map((source) => [source.name, source]));
}

async function ensureTags() {
  const entries = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  return Object.fromEntries(entries.map((tag) => [tag.name, tag]));
}

async function main() {
  console.log("Importing curated official events...");

  const [categories, sources, tags] = await Promise.all([
    ensureCategories(),
    ensureSources(),
    ensureTags(),
  ]);

  for (const event of realEvents) {
    const source = sources[sourceSeeds[event.sourceKey].name];
    const category = categories[event.categorySlug];

    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {
        title: event.title,
        summary: event.summary,
        description: event.description,
        startDateTime: new Date(event.startDateTime),
        endDateTime: new Date(event.endDateTime),
        venueName: event.venueName,
        address: event.address,
        city: event.city,
        latitude: event.latitude,
        longitude: event.longitude,
        categoryId: category.id,
        sourceId: source.id,
        sourceUrl: event.sourceUrl,
        imageUrl: event.imageUrl,
        isFree: event.isFree,
        isFamilyFriendly: event.isFamilyFriendly ?? false,
        isOutdoor: event.isOutdoor ?? false,
        status: EventStatus.APPROVED,
        featured: event.featured,
        fingerprint: event.sourceUrl,
        tags: {
          set: event.tags.map((name) => ({ id: tags[name].id })),
        },
      },
      create: {
        title: event.title,
        slug: event.slug,
        summary: event.summary,
        description: event.description,
        startDateTime: new Date(event.startDateTime),
        endDateTime: new Date(event.endDateTime),
        venueName: event.venueName,
        address: event.address,
        city: event.city,
        latitude: event.latitude,
        longitude: event.longitude,
        categoryId: category.id,
        sourceId: source.id,
        sourceUrl: event.sourceUrl,
        imageUrl: event.imageUrl,
        isFree: event.isFree,
        isFamilyFriendly: event.isFamilyFriendly ?? false,
        isOutdoor: event.isOutdoor ?? false,
        status: EventStatus.APPROVED,
        featured: event.featured,
        fingerprint: event.sourceUrl,
        tags: {
          connect: event.tags.map((name) => ({ id: tags[name].id })),
        },
      },
    });

    console.log(`Imported ${event.title}`);
  }

  console.log(`Imported ${realEvents.length} official events.`);
}

main()
  .catch((error) => {
    console.error("Failed to import official events:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
