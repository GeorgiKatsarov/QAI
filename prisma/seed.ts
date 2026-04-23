import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, EventStatus, TrustLevel, AdminRole } from "../src/generated/prisma";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as never);

async function main() {
  console.log("🌱 Seeding database...");

  // ── Categories ────────────────────────────────────────────────────────────────
  const [music, art, food, sports, family, other] = await Promise.all([
    prisma.category.upsert({
      where: { slug: "music" },
      update: {},
      create: { name: "Music", slug: "music", color: "#7c3aed" },
    }),
    prisma.category.upsert({
      where: { slug: "art" },
      update: {},
      create: { name: "Art & Exhibitions", slug: "art", color: "#db2777" },
    }),
    prisma.category.upsert({
      where: { slug: "food" },
      update: {},
      create: { name: "Food & Drink", slug: "food", color: "#ea580c" },
    }),
    prisma.category.upsert({
      where: { slug: "sports" },
      update: {},
      create: { name: "Sports", slug: "sports", color: "#16a34a" },
    }),
    prisma.category.upsert({
      where: { slug: "family" },
      update: {},
      create: { name: "Family", slug: "family", color: "#0284c7" },
    }),
    prisma.category.upsert({
      where: { slug: "other" },
      update: {},
      create: { name: "Other", slug: "other", color: "#6b7280" },
    }),
  ]);

  console.log("✓ Categories created");

  // ── Tags ──────────────────────────────────────────────────────────────────────
  const tagNames = [
    "outdoor",
    "free",
    "family-friendly",
    "live-music",
    "exhibition",
    "festival",
    "workshop",
    "food-market",
  ];

  const tags = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({ where: { name }, update: {}, create: { name } })
    )
  );

  const tagMap = Object.fromEntries(tags.map((t) => [t.name, t]));
  console.log("✓ Tags created");

  // ── Sources ───────────────────────────────────────────────────────────────────
  const graboBg = await prisma.source.upsert({
    where: { name: "grabo.bg" },
    update: {},
    create: {
      name: "grabo.bg",
      baseUrl: "https://grabo.bg",
      trustLevel: TrustLevel.MEDIUM,
      scrapingEnabled: true,
    },
  });

  const manualSource = await prisma.source.upsert({
    where: { name: "Manual Submission" },
    update: {},
    create: {
      name: "Manual Submission",
      baseUrl: "",
      trustLevel: TrustLevel.HIGH,
      scrapingEnabled: false,
    },
  });

  console.log("✓ Sources created");

  // ── Admin user ────────────────────────────────────────────────────────────────
  await prisma.adminUser.upsert({
    where: { email: "admin@roamer.bg" },
    update: {},
    create: { email: "admin@roamer.bg", role: AdminRole.SUPER_ADMIN },
  });

  console.log("✓ Admin user created");

  // ── Helper ────────────────────────────────────────────────────────────────────
  function makeSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .substring(0, 80);
  }

  const now = new Date();
  function daysFromNow(n: number) {
    const d = new Date(now);
    d.setDate(d.getDate() + n);
    return d;
  }

  // ── Events ────────────────────────────────────────────────────────────────────
  const eventsData = [
    {
      title: "Sofia Jazz Festival 2026",
      summary: "Three days of world-class jazz at the National Palace of Culture.",
      description:
        "The Sofia Jazz Festival returns for its 12th edition, bringing together Bulgarian and international jazz musicians for three unforgettable evenings.",
      startDateTime: new Date(daysFromNow(5).setHours(19, 0, 0, 0)),
      endDateTime: new Date(daysFromNow(7).setHours(23, 0, 0, 0)),
      venueName: "National Palace of Culture",
      address: "Bulgaria Square 1",
      city: "Sofia",
      latitude: 42.6866,
      longitude: 23.3195,
      categoryId: music.id,
      sourceId: manualSource.id,
      priceMin: 25,
      priceMax: 60,
      isFree: false,
      status: EventStatus.APPROVED,
      featured: true,
      tags: ["live-music", "festival"],
    },
    {
      title: "Contemporary Bulgarian Photography Exhibition",
      summary: "Solo exhibition by Georgi Stoev at the Sofia City Gallery.",
      description:
        "Forty photographs documenting life across Bulgaria's rural hinterland over the past decade. Free admission every Tuesday.",
      startDateTime: new Date(daysFromNow(2).setHours(10, 0, 0, 0)),
      endDateTime: new Date(daysFromNow(30).setHours(18, 0, 0, 0)),
      venueName: "Sofia City Gallery",
      address: "General Gurko 1",
      city: "Sofia",
      latitude: 42.6963,
      longitude: 23.3295,
      categoryId: art.id,
      sourceId: manualSource.id,
      priceMin: 0,
      priceMax: 8,
      isFree: false,
      status: EventStatus.APPROVED,
      tags: ["exhibition"],
    },
    {
      title: "Sofia Street Food Festival Spring 2026",
      summary: "40+ food stalls in Borisova Gradina.",
      description:
        "Eat your way through four days of incredible street food. Local chefs, craft beer, live music between sessions.",
      startDateTime: new Date(daysFromNow(10).setHours(11, 0, 0, 0)),
      endDateTime: new Date(daysFromNow(13).setHours(21, 0, 0, 0)),
      venueName: "Borisova Gradina",
      address: "Borisova Gradina Park, Sofia",
      city: "Sofia",
      latitude: 42.6737,
      longitude: 23.3483,
      categoryId: food.id,
      sourceId: graboBg.id,
      sourceUrl: "https://grabo.bg/events/sofia-street-food-2026",
      priceMin: 0,
      priceMax: 0,
      isFree: true,
      isOutdoor: true,
      isFamilyFriendly: true,
      status: EventStatus.APPROVED,
      tags: ["free", "outdoor", "food-market", "family-friendly"],
    },
    {
      title: "Детски театър: Пинокио",
      summary: "Classic children's play at Sofia's Puppet Theatre.",
      description:
        "Beloved puppet adaptation of Pinocchio for children aged 3–10. Weekend morning performances.",
      startDateTime: new Date(daysFromNow(3).setHours(11, 0, 0, 0)),
      endDateTime: new Date(daysFromNow(3).setHours(12, 30, 0, 0)),
      venueName: "Sofia Puppet Theatre",
      address: "General Gurko 14, Sofia",
      city: "Sofia",
      latitude: 42.696,
      longitude: 23.328,
      categoryId: family.id,
      sourceId: manualSource.id,
      priceMin: 8,
      priceMax: 12,
      isFree: false,
      isFamilyFriendly: true,
      status: EventStatus.APPROVED,
      tags: ["family-friendly"],
    },
    {
      title: "Капана Крийейтив Фестивал Пловдив 2026",
      summary: "Art, design, and creative industries in Plovdiv's Kapana district.",
      description:
        "Three days of galleries, pop-up studios, street performances, and workshops celebrating Plovdiv's creative community.",
      startDateTime: new Date(daysFromNow(14).setHours(10, 0, 0, 0)),
      endDateTime: new Date(daysFromNow(16).setHours(22, 0, 0, 0)),
      venueName: "Kapana District",
      address: "Kapana, Plovdiv",
      city: "Plovdiv",
      latitude: 42.1493,
      longitude: 24.7489,
      categoryId: art.id,
      sourceId: graboBg.id,
      sourceUrl: "https://grabo.bg/events/kapana-creative-2026",
      priceMin: 0,
      priceMax: 0,
      isFree: true,
      isOutdoor: true,
      isFamilyFriendly: true,
      status: EventStatus.APPROVED,
      featured: true,
      tags: ["free", "outdoor", "festival", "family-friendly"],
    },
    {
      title: "Ancient Theatre Concert: Lilly Ivanova",
      summary: "An iconic performance at Plovdiv's Roman amphitheatre.",
      description:
        "Pop legend Lilly Ivanova performs under the stars at one of Europe's best-preserved ancient theatres.",
      startDateTime: new Date(daysFromNow(20).setHours(20, 30, 0, 0)),
      endDateTime: new Date(daysFromNow(20).setHours(23, 0, 0, 0)),
      venueName: "Ancient Theatre of Philippopolis",
      address: "Tsar Ivaylo St, Plovdiv",
      city: "Plovdiv",
      latitude: 42.1427,
      longitude: 24.7508,
      categoryId: music.id,
      sourceId: manualSource.id,
      priceMin: 40,
      priceMax: 120,
      isFree: false,
      isOutdoor: true,
      status: EventStatus.APPROVED,
      tags: ["live-music", "outdoor"],
    },
    {
      title: "Black Sea Marathon Varna 2026",
      summary: "Annual marathon along Varna's seaside boulevard.",
      description:
        "Full marathon, half marathon, and 10K race through Varna's sea gardens and along the Black Sea coast.",
      startDateTime: new Date(daysFromNow(25).setHours(8, 0, 0, 0)),
      endDateTime: new Date(daysFromNow(25).setHours(14, 0, 0, 0)),
      venueName: "Varna Sea Gardens",
      address: "Sea Boulevard, Varna",
      city: "Varna",
      latitude: 43.2074,
      longitude: 27.9194,
      categoryId: sports.id,
      sourceId: graboBg.id,
      sourceUrl: "https://grabo.bg/events/black-sea-marathon-2026",
      priceMin: 30,
      priceMax: 50,
      isFree: false,
      isOutdoor: true,
      status: EventStatus.APPROVED,
      tags: ["outdoor"],
    },
    {
      title: "Varna Wine and Cheese Fair 2026",
      summary: "Taste wines and cheeses from Bulgaria's finest producers.",
      description:
        "Over 60 Bulgarian wineries and artisan cheese makers at Euxinograd palace gardens.",
      startDateTime: new Date(daysFromNow(8).setHours(12, 0, 0, 0)),
      endDateTime: new Date(daysFromNow(9).setHours(20, 0, 0, 0)),
      venueName: "Euxinograd Palace",
      address: "Euxinograd, Varna",
      city: "Varna",
      latitude: 43.256,
      longitude: 27.8736,
      categoryId: food.id,
      sourceId: manualSource.id,
      priceMin: 15,
      priceMax: 20,
      isFree: false,
      isOutdoor: true,
      status: EventStatus.APPROVED,
      tags: ["outdoor", "food-market"],
    },
    {
      title: "Photography Workshop Ivan Donchev Sofia",
      summary: "Full-day street photography workshop in central Sofia.",
      description:
        "Learn composition, light, and storytelling with award-winning photographer Ivan Donchev. Limited to 12 participants.",
      startDateTime: new Date(daysFromNow(6).setHours(9, 0, 0, 0)),
      endDateTime: new Date(daysFromNow(6).setHours(17, 0, 0, 0)),
      venueName: "Meeting point: NDK metro exit",
      address: "Bulgaria Square, Sofia",
      city: "Sofia",
      latitude: 42.6866,
      longitude: 23.3195,
      categoryId: other.id,
      sourceId: manualSource.id,
      priceMin: 80,
      priceMax: 80,
      isFree: false,
      status: EventStatus.APPROVED,
      tags: ["workshop", "outdoor"],
    },
    // Pending — used to verify moderation visibility rules
    {
      title: "Test Pending Event Do Not Publish",
      summary: "This event is pending and must not appear publicly.",
      description: "Seed-only pending event to verify visibility filtering.",
      startDateTime: new Date(daysFromNow(1).setHours(10, 0, 0, 0)),
      venueName: "Nowhere",
      city: "Sofia",
      latitude: 42.6977,
      longitude: 23.3219,
      categoryId: other.id,
      sourceId: manualSource.id,
      priceMin: 0,
      isFree: true,
      status: EventStatus.PENDING,
      tags: [],
    },
  ];

  for (const { tags: eventTags, ...data } of eventsData) {
    const slug = makeSlug(data.title);
    await prisma.event.upsert({
      where: { slug },
      update: {},
      create: {
        ...data,
        slug,
        tags: { connect: eventTags.map((name) => ({ id: tagMap[name].id })) },
      },
    });
  }

  console.log(`✓ ${eventsData.length} events created`);

  // ── Sample pending submission ──────────────────────────────────────────────────
  await prisma.submission.upsert({
    where: { id: "seed-submission-001" },
    update: {},
    create: {
      id: "seed-submission-001",
      submitterEmail: "test@example.com",
      eventDraftData: {
        title: "Sample Submitted Event",
        city: "Plovdiv",
        startDateTime: daysFromNow(15).toISOString(),
        category: "music",
        description: "A test event submitted through the public form.",
      },
    },
  });

  console.log("✓ Sample submission created");
  console.log("\n✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
