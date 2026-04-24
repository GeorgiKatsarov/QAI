import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, EventStatus, TrustLevel } from "../src/generated/prisma";

// @ts-expect-error Next bundles node-html-parser without standalone type declarations.
import { parse } from "next/dist/compiled/node-html-parser";

const BASE_URL = "https://festivali.eu";
const DEFAULT_MAX_POSTS = 120;
const ARCHIVE_PATH = "/";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as never);

type HtmlNode = {
  querySelector: (selector: string) => HtmlNode | null;
  querySelectorAll: (selector: string) => HtmlNode[];
  getAttribute: (name: string) => string | undefined;
  removeWhitespace: () => HtmlNode;
  text: string;
  structuredText: string;
  innerHTML: string;
};

type SitemapEntry = {
  url: string;
  lastModified: Date | null;
};

type EventPageDetails = {
  startDateTime: Date | null;
  endDateTime: Date | null;
  venueName: string | null;
  address: string | null;
  city: string | null;
  imageUrl: string | null;
};

type ScrapedEvent = EventPageDetails & {
  title: string;
  slug: string;
  summary: string;
  description: string;
  categorySlug: keyof typeof categorySeeds;
  sourceUrl: string;
  isFree: boolean;
  isFamilyFriendly: boolean;
  isOutdoor: boolean;
  featured: boolean;
  tags: string[];
};

type PersistableScrapedEvent = ScrapedEvent & {
  address: string;
  city: string;
  startDateTime: Date;
};

const categorySeeds = {
  music: { name: "Music", color: "#7c3aed" },
  art: { name: "Art & Exhibitions", color: "#db2777" },
  food: { name: "Food & Drink", color: "#ea580c" },
  sports: { name: "Sports", color: "#16a34a" },
  family: { name: "Family", color: "#0284c7" },
  other: { name: "Other", color: "#6b7280" },
} as const;

const sourceSeed = {
  name: "festivali.eu",
  baseUrl: BASE_URL,
  trustLevel: TrustLevel.HIGH,
} as const;

const baseTagNames = [
  "festival",
  "outdoor",
  "family-friendly",
  "live-music",
  "exhibition",
  "workshop",
  "food-market",
] as const;

const BULGARIAN_TO_LATIN: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sht",
  ъ: "a",
  ь: "y",
  ю: "yu",
  я: "ya",
};

function parseNumberArg(flag: string, fallback: number) {
  const value = process.argv.find((arg) => arg.startsWith(`${flag}=`));
  if (!value) {
    return fallback;
  }

  const parsed = Number(value.split("=")[1]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseDateArg(flag: string) {
  const value = process.argv.find((arg) => arg.startsWith(`${flag}=`));
  if (!value) {
    return null;
  }

  const parsed = new Date(value.split("=")[1]);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

const maxPosts = parseNumberArg("--max-posts", DEFAULT_MAX_POSTS);
const includePast = process.argv.includes("--include-past");
const publishedSince =
  parseDateArg("--published-since") ??
  new Date(Date.UTC(new Date().getUTCFullYear(), 0, 1));

function normalizeWhitespace(value: string | null | undefined) {
  return (value ?? "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function decodeXml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

function transliterateBulgarian(value: string) {
  return value
    .toLowerCase()
    .split("")
    .map((char) => BULGARIAN_TO_LATIN[char] ?? char)
    .join("");
}

function slugify(value: string) {
  return transliterateBulgarian(value)
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 100);
}

function hashString(value: string) {
  let hash = 0;

  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return hash.toString(36);
}

function slugFromArticleUrl(articleUrl: string, title: string) {
  try {
    const pathname = decodeURIComponent(new URL(articleUrl).pathname)
      .split("/")
      .filter(Boolean)
      .at(-1);
    const fromPath = pathname ? slugify(pathname) : "";

    if (fromPath) {
      return fromPath;
    }
  } catch {
    // Fall through to title/hash fallback.
  }

  const fromTitle = slugify(title);
  if (fromTitle) {
    return `${fromTitle}-${hashString(articleUrl)}`.slice(0, 100);
  }

  return `festivali-${hashString(articleUrl)}`;
}

function absoluteUrl(value: string | null | undefined, base: string) {
  const normalized = normalizeWhitespace(value);
  if (!normalized) {
    return null;
  }

  try {
    return new URL(normalized, base).toString();
  } catch {
    return null;
  }
}

function getTextContent(node: HtmlNode | null) {
  if (!node) {
    return "";
  }

  return normalizeWhitespace(node.removeWhitespace().structuredText || node.text);
}

function extractMetaContent(html: string, key: string) {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${key}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${key}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${key}["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${key}["']`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return decodeXml(match[1]);
    }
  }

  return null;
}

function extractXmlTagContents(xml: string, tagName: string) {
  const pattern = new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, "g");
  const values: string[] = [];

  for (const match of xml.matchAll(pattern)) {
    if (match[1]) {
      values.push(decodeXml(match[1].trim()));
    }
  }

  return values;
}

function extractSitemapEntries(xml: string): SitemapEntry[] {
  const blocks = xml.match(/<url>[\s\S]*?<\/url>/g) ?? [];

  return blocks
    .map((block) => {
      const url = extractXmlTagContents(block, "loc")[0] ?? "";
      const lastmodValue = extractXmlTagContents(block, "lastmod")[0] ?? "";
      const lastModified = lastmodValue ? new Date(lastmodValue) : null;

      return {
        url,
        lastModified:
          lastModified && !Number.isNaN(lastModified.getTime()) ? lastModified : null,
      };
    })
    .filter((entry) => entry.url.startsWith(BASE_URL));
}

async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "RoamerFestivaliImporter/1.0 (+https://festivali.eu/)",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${url}: ${response.status}`);
  }

  return response.text();
}

function isLikelyArticleUrl(url: string) {
  try {
    const parsed = new URL(url, BASE_URL);
    const path = decodeURIComponent(parsed.pathname);
    const hasDateCue = /(\d{4}|януари|февруари|март|април|май|юни|юли|август|септември|октомври|ноември|декември|ян|фев|мар|апр|май|юни|юли|авг|сеп|окт|ное|дек)/iu.test(
      path
    );

    if (url.includes("NaN") || parsed.hash || parsed.search) {
      return false;
    }

    if (parsed.origin !== BASE_URL) {
      return false;
    }

    if (
      path === "/" ||
      path === "/фестивали/" ||
      path === "/количка/" ||
      path === "/за-нас/" ||
      path === "/добрите-примери/" ||
      path === "/свържете-се-с-нас/" ||
      path === "/events-3/" ||
      path.includes("/feed/") ||
      path.startsWith("/events/") ||
      path.startsWith("/archives/") ||
      path.startsWith("/category/") ||
      path.startsWith("/locations/") ||
      path.startsWith("/author/") ||
      path.startsWith("/comments/") ||
      path.startsWith("/porachka/") ||
      path.startsWith("/konkurs/") ||
      path.startsWith("/product/") ||
      path.startsWith("/shop/") ||
      path.startsWith("/tag/") ||
      path.startsWith("/wp-") ||
      /\.(css|js|png|jpe?g|webp|svg|woff2?)$/i.test(path)
    ) {
      return false;
    }

    if (/\/page\/\d+\/?$/i.test(path)) {
      return false;
    }

    return path.split("/").filter(Boolean).length >= 1 && hasDateCue;
  } catch {
    return false;
  }
}

function extractArchivePostUrls(html: string) {
  const urls = Array.from(html.matchAll(/href=["'](https:\/\/festivali\.eu\/[^"']+)["']/gi))
    .map((match) => absoluteUrl(match[1], BASE_URL))
    .filter((url): url is string => Boolean(url))
    .filter(isLikelyArticleUrl);

  return unique(urls);
}

async function getPostUrlsFromArchive() {
  const urls = new Set<string>();
  const maxPages = Math.max(8, Math.ceil(maxPosts / 8) + 2);

  for (let page = 1; page <= maxPages && urls.size < maxPosts; page += 1) {
    const archiveUrl =
      page === 1 ? `${BASE_URL}${ARCHIVE_PATH}` : `${BASE_URL}${ARCHIVE_PATH}page/${page}/`;
    const html = await fetchText(archiveUrl);
    const pageUrls = extractArchivePostUrls(html);
    const sizeBefore = urls.size;

    pageUrls.forEach((url) => urls.add(url));

    if (urls.size === sizeBefore) {
      break;
    }
  }

  return Array.from(urls).slice(0, maxPosts);
}

async function getPostUrls() {
  try {
    const sitemapIndexXml = await fetchText(`${BASE_URL}/wp-sitemap.xml`);
    const postSitemaps = extractXmlTagContents(sitemapIndexXml, "loc").filter((url) =>
      url.includes("wp-sitemap-posts-post")
    );

    if (!postSitemaps.length) {
      throw new Error("No post sitemaps found on festivali.eu.");
    }

    const entries: SitemapEntry[] = [];

    for (const sitemapUrl of postSitemaps) {
      const xml = await fetchText(sitemapUrl);
      entries.push(...extractSitemapEntries(xml));
    }

    return entries
      .filter(
        (entry) =>
          !entry.url.includes("/events/") &&
          !entry.url.includes("/category/") &&
          !entry.url.includes("/locations/") &&
          !entry.url.includes("/author/") &&
          (!entry.lastModified || entry.lastModified >= publishedSince)
      )
      .sort((a, b) => {
        const aTime = a.lastModified?.getTime() ?? 0;
        const bTime = b.lastModified?.getTime() ?? 0;
        return bTime - aTime;
      })
      .slice(0, maxPosts)
      .map((entry) => entry.url);
  } catch (error) {
    console.warn("Falling back to archive-page discovery for festivali.eu.", error);
    return getPostUrlsFromArchive();
  }
}

function collectJsonLdCandidates(value: unknown, results: Record<string, unknown>[]) {
  if (!value) {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectJsonLdCandidates(item, results));
    return;
  }

  if (typeof value !== "object") {
    return;
  }

  const record = value as Record<string, unknown>;
  const rawType = record["@type"];

  if (
    (typeof rawType === "string" && rawType.includes("Event")) ||
    (Array.isArray(rawType) && rawType.some((item) => item === "Event"))
  ) {
    results.push(record);
  }

  if (record["@graph"]) {
    collectJsonLdCandidates(record["@graph"], results);
  }
}

function parseJsonLdEvent(root: HtmlNode) {
  const scripts = root.querySelectorAll('script[type="application/ld+json"]');
  const events: Record<string, unknown>[] = [];

  for (const script of scripts) {
    const jsonText = script.innerHTML.trim();
    if (!jsonText) {
      continue;
    }

    try {
      const parsed = JSON.parse(jsonText) as unknown;
      collectJsonLdCandidates(parsed, events);
    } catch {
      continue;
    }
  }

  return events[0] ?? null;
}

function eventImageFromSchema(eventSchema: Record<string, unknown> | null) {
  const rawImage = eventSchema?.image;

  if (typeof rawImage === "string") {
    return rawImage;
  }

  if (Array.isArray(rawImage) && typeof rawImage[0] === "string") {
    return rawImage[0];
  }

  return null;
}

function eventLocationFromSchema(eventSchema: Record<string, unknown> | null) {
  const location =
    eventSchema?.location && typeof eventSchema.location === "object"
      ? (eventSchema.location as Record<string, unknown>)
      : null;
  const address =
    location?.address && typeof location.address === "object"
      ? (location.address as Record<string, unknown>)
      : null;

  const addressParts = unique(
    [
      typeof address?.streetAddress === "string" ? address.streetAddress : null,
      typeof address?.addressLocality === "string" ? address.addressLocality : null,
      typeof address?.addressRegion === "string" ? address.addressRegion : null,
    ]
      .map((value) => normalizeWhitespace(value))
      .filter(Boolean)
  );

  return {
    venueName: typeof location?.name === "string" ? normalizeWhitespace(location.name) : null,
    address: addressParts.length ? addressParts.join(", ") : null,
    city:
      typeof address?.addressLocality === "string"
        ? normalizeWhitespace(address.addressLocality)
        : null,
  };
}

function parseDateTimeFromParts(dateValue: string | null, timeValue: string | null) {
  if (!dateValue) {
    return null;
  }

  const [day, month, year] = dateValue.split(".");
  if (!day || !month || !year) {
    return null;
  }

  const [hours = "10", minutes = "00"] = (timeValue ?? "10:00").split(":");
  const iso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hours.padStart(
    2,
    "0"
  )}:${minutes.padStart(2, "0")}:00+03:00`;
  const parsed = new Date(iso);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function extractCityFromText(value: string) {
  const text = normalizeWhitespace(value);
  const patterns = [
    /в\s+град\s+([A-ZА-Я][\p{L}-]+(?:\s+[A-ZА-Я][\p{L}-]+){0,2})/u,
    /в\s+гр\.\s*([A-ZА-Я][\p{L}-]+(?:\s+[A-ZА-Я][\p{L}-]+){0,2})/u,
    /в\s+с\.\s*([A-ZА-Я][\p{L}-]+(?:\s+[A-ZА-Я][\p{L}-]+){0,2})/u,
    /в\s+([A-ZА-Я][\p{L}-]+(?:\s+[A-ZА-Я][\p{L}-]+){0,2})/u,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return normalizeWhitespace(match[1].replace(/^["„“]|["“”]$/g, ""));
    }
  }

  return null;
}

function extractFallbackEventDetails(root: HtmlNode, html: string, baseUrl: string): EventPageDetails {
  const text = normalizeWhitespace(root.structuredText);
  const dateRangeMatch = text.match(
    /(\d{2}\.\d{2}\.\d{4})(?:\s*-\s*(\d{2}\.\d{2}\.\d{4}))?\s+(\d{1,2}:\d{2})(?:\s*-\s*(\d{1,2}:\d{2}))?/u
  );
  const dateOnlyMatch = text.match(/(\d{2}\.\d{2}\.\d{4})(?:\s*-\s*(\d{2}\.\d{2}\.\d{4}))?/u);

  const venueName = normalizeWhitespace(
    getTextContent(
      root.querySelector('.tribe-events-venue-details a[href*="/locations/"]') ??
        root.querySelector('.tribe-events-meta-group-venue a[href*="/locations/"]') ??
        root.querySelector('a[href*="/locations/"]')
    )
  );
  const city = extractCityFromText(text);

  return {
    startDateTime: parseDateTimeFromParts(
      dateRangeMatch?.[1] ?? dateOnlyMatch?.[1] ?? null,
      dateRangeMatch?.[3] ?? null
    ),
    endDateTime: parseDateTimeFromParts(
      dateRangeMatch?.[2] ?? dateOnlyMatch?.[2] ?? dateOnlyMatch?.[1] ?? null,
      dateRangeMatch?.[4] ?? null
    ),
    venueName: venueName || null,
    address: venueName || city,
    city,
    imageUrl:
      absoluteUrl(
        extractMetaContent(html, "og:image") ??
          root.querySelector(".tribe-events-event-image img")?.getAttribute("src") ??
          root.querySelector(".entry-content img")?.getAttribute("src"),
        baseUrl
      ) ?? null,
  };
}

async function scrapeEventPage(eventUrl: string) {
  const html = await fetchText(eventUrl);
  const root = parse(html) as HtmlNode;
  const eventSchema = parseJsonLdEvent(root);

  if (!eventSchema) {
    return extractFallbackEventDetails(root, html, eventUrl);
  }

  const location = eventLocationFromSchema(eventSchema);
  const startDateTime =
    typeof eventSchema.startDate === "string" ? new Date(eventSchema.startDate) : null;
  const endDateTime =
    typeof eventSchema.endDate === "string" ? new Date(eventSchema.endDate) : null;

  return {
    startDateTime:
      startDateTime && !Number.isNaN(startDateTime.getTime()) ? startDateTime : null,
    endDateTime: endDateTime && !Number.isNaN(endDateTime.getTime()) ? endDateTime : null,
    venueName: location.venueName,
    address: location.address,
    city: location.city,
    imageUrl:
      absoluteUrl(eventImageFromSchema(eventSchema), eventUrl) ??
      absoluteUrl(extractMetaContent(html, "og:image"), eventUrl),
  };
}

function extractArticleBody(root: HtmlNode) {
  const contentNode =
    root.querySelector(".entry-content") ??
    root.querySelector(".post-content") ??
    root.querySelector(".td-post-content") ??
    root.querySelector("article");

  if (!contentNode) {
    return "";
  }

  const paragraphs = contentNode
    .querySelectorAll("p")
    .map((node) => getTextContent(node))
    .filter(Boolean);
  const listItems = contentNode
    .querySelectorAll("li")
    .map((node) => getTextContent(node))
    .filter(Boolean);

  return normalizeWhitespace([...paragraphs, ...listItems].join("\n"));
}

function extractArticleCategories(root: HtmlNode) {
  const selectors = [
    ".cat-links a",
    ".post-categories a",
    ".entry-categories a",
    ".td-post-category a",
    ".meta-cat a",
  ];

  const values = selectors.flatMap((selector) =>
    root
      .querySelectorAll(selector)
      .map((node) => getTextContent(node))
      .filter(Boolean)
  );

  return unique(values);
}

function inferCategorySlug(title: string, categories: string[], description: string) {
  const haystack = [title, categories.join(" "), description].join(" ").toLowerCase();

  if (
    /кулинар|вино|винен|храни|храна|гастроном|фермер|самардала|зеленик|чорба|сирене|гозби/u.test(
      haystack
    )
  ) {
    return "food";
  }

  if (/музик|концерт|джаз|сцена|оркестър|хор/u.test(haystack)) {
    return "music";
  }

  if (/спорт|маратон|бяган|турнир/u.test(haystack)) {
    return "sports";
  }

  if (/дет|семеен|учениц|работилниц|куклен/u.test(haystack)) {
    return "family";
  }

  if (/фолклор|традици|занаят|карнавал|излож|арт|античен/u.test(haystack)) {
    return "art";
  }

  return "other";
}

function inferTags(title: string, categories: string[], description: string) {
  const haystack = [title, categories.join(" "), description].join(" ").toLowerCase();
  const tags = new Set<string>(["festival"]);

  if (/открито|площад|парк|градина|на открито/u.test(haystack)) {
    tags.add("outdoor");
  }
  if (/деца|семейств|семеен/u.test(haystack)) {
    tags.add("family-friendly");
  }
  if (/музик|концерт|сцена/u.test(haystack)) {
    tags.add("live-music");
  }
  if (/излож|експо/u.test(haystack)) {
    tags.add("exhibition");
  }
  if (/работилниц/u.test(haystack)) {
    tags.add("workshop");
  }
  if (/кулинар|фермер|храна|вино|сирене/u.test(haystack)) {
    tags.add("food-market");
  }

  return Array.from(tags);
}

function looksLikeEventAnnouncement(title: string, description: string) {
  const haystack = `${title} ${description}`;
  return /(\d{4}|\d{1,2}\.\d{1,2}\.\d{4}|ще се проведе|ще се състои|на \d{1,2} [а-я]+)/iu.test(
    haystack
  );
}

async function scrapeArticle(articleUrl: string): Promise<PersistableScrapedEvent | null> {
  const html = await fetchText(articleUrl);
  const root = parse(html) as HtmlNode;
  const title = normalizeWhitespace(
    extractMetaContent(html, "og:title") ?? getTextContent(root.querySelector("h1"))
  ).replace(/\s*-\s*Фестивалите на България I БГ$/u, "");

  if (!title) {
    return null;
  }

  const description = extractArticleBody(root);
  const summary = truncate(
    normalizeWhitespace(
      extractMetaContent(html, "og:description") ??
        extractMetaContent(html, "description") ??
        description
    ),
    240
  );

  if (!description || !summary) {
    return null;
  }

  if (!looksLikeEventAnnouncement(title, description)) {
    return null;
  }

  const contentNode =
    root.querySelector(".entry-content") ??
    root.querySelector(".post-content") ??
    root.querySelector(".td-post-content") ??
    root.querySelector("article");

  const eventLink =
    absoluteUrl(
      contentNode?.querySelector('a[href*="/events/"]')?.getAttribute("href") ??
        root.querySelector('a[href*="/events/"]')?.getAttribute("href"),
      articleUrl
    ) ?? articleUrl;

  const eventDetails =
    eventLink !== articleUrl
      ? await scrapeEventPage(eventLink)
      : {
          startDateTime: null,
          endDateTime: null,
          venueName: null,
          address: null,
          city: extractCityFromText(`${title} ${description}`),
          imageUrl: null,
        };

  if (!eventDetails.startDateTime) {
    return null;
  }

  const categories = extractArticleCategories(root);
  const city =
    eventDetails.city ??
    extractCityFromText(`${title} ${summary} ${description}`) ??
    "България";

  return {
    title,
    slug: slugFromArticleUrl(articleUrl, title),
    summary,
    description,
    startDateTime: eventDetails.startDateTime,
    endDateTime: eventDetails.endDateTime,
    venueName: eventDetails.venueName,
    address: eventDetails.address ?? city,
    city,
    imageUrl:
      absoluteUrl(
        extractMetaContent(html, "og:image") ??
          contentNode?.querySelector("img")?.getAttribute("src") ??
          eventDetails.imageUrl,
        articleUrl
      ) ?? eventDetails.imageUrl,
    categorySlug: inferCategorySlug(title, categories, description),
    sourceUrl: articleUrl,
    isFree: /безплат|вход свободен/u.test(`${title} ${summary} ${description}`),
    isFamilyFriendly: /деца|семейств|семеен/u.test(`${title} ${summary} ${description}`),
    isOutdoor: /площад|парк|градина|на открито/u.test(
      `${title} ${summary} ${description} ${eventDetails.venueName ?? ""}`
    ),
    featured: categories.includes("Най-важното"),
    tags: inferTags(title, categories, description),
  };
}

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

async function ensureSource() {
  return prisma.source.upsert({
    where: { name: sourceSeed.name },
    update: {
      baseUrl: sourceSeed.baseUrl,
      trustLevel: sourceSeed.trustLevel,
      scrapingEnabled: true,
    },
    create: {
      ...sourceSeed,
      scrapingEnabled: true,
    },
  });
}

async function ensureTags(tagNames: string[]) {
  const entries = await Promise.all(
    unique([...baseTagNames, ...tagNames]).map((name) =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  return Object.fromEntries(entries.map((tag) => [tag.name, tag]));
}

async function cleanupBrokenFestivaliImports(sourceId: string) {
  const deleted = await prisma.event.deleteMany({
    where: {
      sourceId,
      OR: [
        { title: { contains: "Вкусни Фестивали" } },
        { sourceUrl: { contains: "NaN0" } },
      ],
    },
  });

  if (deleted.count > 0) {
    console.log(`Removed ${deleted.count} broken festivali.eu test imports.`);
  }
}

async function main() {
  console.log(
    `Importing festivali.eu posts published since ${publishedSince.toISOString().slice(0, 10)}...`
  );

  const postUrls = await getPostUrls();
  console.log(`Found ${postUrls.length} recent posts to inspect.`);

  const scrapedEvents: PersistableScrapedEvent[] = [];

  for (const postUrl of postUrls) {
    try {
      const event = await scrapeArticle(postUrl);
      if (event) {
        scrapedEvents.push(event);
      } else {
        console.log(`Skipped ${postUrl}`);
      }
    } catch (error) {
      console.warn(`Failed to scrape ${postUrl}:`, error);
    }
  }

  const relevantEvents = scrapedEvents.filter((event) =>
    includePast ? true : event.startDateTime >= new Date()
  );
  const uniqueEvents = Array.from(
    new Map(relevantEvents.map((event) => [event.sourceUrl, event])).values()
  );

  const [categories, source, tags] = await Promise.all([
    ensureCategories(),
    ensureSource(),
    ensureTags(scrapedEvents.flatMap((event) => event.tags)),
  ]);

  await cleanupBrokenFestivaliImports(source.id);

  let importedCount = 0;

  for (const event of uniqueEvents) {
    const category = categories[event.categorySlug];
    const existingEvent = await prisma.event.findFirst({
      where: {
        OR: [{ slug: event.slug }, { fingerprint: event.sourceUrl }],
      },
      select: { id: true },
    });

    await prisma.event.upsert({
      where: existingEvent ? { id: existingEvent.id } : { slug: event.slug },
      update: {
        title: event.title,
        summary: event.summary,
        description: event.description,
        startDateTime: event.startDateTime,
        endDateTime: event.endDateTime,
        venueName: event.venueName,
        address: event.address,
        city: event.city,
        categoryId: category.id,
        sourceId: source.id,
        sourceUrl: event.sourceUrl,
        imageUrl: event.imageUrl,
        isFree: event.isFree,
        isFamilyFriendly: event.isFamilyFriendly,
        isOutdoor: event.isOutdoor,
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
        startDateTime: event.startDateTime,
        endDateTime: event.endDateTime,
        venueName: event.venueName,
        address: event.address,
        city: event.city,
        categoryId: category.id,
        sourceId: source.id,
        sourceUrl: event.sourceUrl,
        imageUrl: event.imageUrl,
        isFree: event.isFree,
        isFamilyFriendly: event.isFamilyFriendly,
        isOutdoor: event.isOutdoor,
        status: EventStatus.APPROVED,
        featured: event.featured,
        fingerprint: event.sourceUrl,
        tags: {
          connect: event.tags.map((name) => ({ id: tags[name].id })),
        },
      },
    });

    importedCount += 1;
    console.log(`Imported ${event.title}`);
  }

  console.log(
    `Imported ${importedCount} events from festivali.eu. Scraped ${scrapedEvents.length} usable event posts.`
  );
}

main()
  .catch((error) => {
    console.error("Failed to import festivali.eu events:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
