import { EventStatus } from "@/generated/prisma";
import { prisma } from "@/lib/db/client";
import { toEventCardDto, mockToEventCardDto, type EventCardDto } from "@/lib/mappers/events";
import { mockEvents } from "@/lib/mock/events";
import { eventQuerySchema, type EventQueryInput } from "@/lib/validation/events";

export type EventListResult = {
  items: EventCardDto[];
  total: number;
  page: number;
  pageSize: number;
};

function dbAvailable() {
  return Boolean(prisma);
}

function filterMockEvents(query: ReturnType<typeof eventQuerySchema.parse>): EventListResult {
  let filtered = mockEvents;

  if (query.search) {
    const term = query.search.toLowerCase();
    filtered = filtered.filter((event) =>
      [event.title, event.summary, event.city].join(" ").toLowerCase().includes(term)
    );
  }
  if (query.city) {
    filtered = filtered.filter((event) => event.city.toLowerCase() === query.city?.toLowerCase());
  }
  if (query.category) {
    filtered = filtered.filter((event) => event.category.slug === query.category);
  }
  if (query.freeOnly) {
    filtered = filtered.filter((event) => event.isFree);
  }

  const start = (query.page - 1) * query.pageSize;
  const paged = filtered.slice(start, start + query.pageSize);
  return {
    items: paged.map(mockToEventCardDto),
    total: filtered.length,
    page: query.page,
    pageSize: query.pageSize,
  };
}

export async function listPublicEvents(input: EventQueryInput): Promise<EventListResult> {
  const query = eventQuerySchema.parse(input);

  if (!dbAvailable()) {
    return filterMockEvents(query);
  }

  const where = {
    status: EventStatus.APPROVED,
    ...(query.search
      ? {
          OR: [
            { title: { contains: query.search, mode: "insensitive" as const } },
            { summary: { contains: query.search, mode: "insensitive" as const } },
            { city: { contains: query.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(query.city ? { city: { equals: query.city, mode: "insensitive" as const } } : {}),
    ...(query.category ? { category: { slug: query.category } } : {}),
    ...(query.source ? { source: { name: { equals: query.source, mode: "insensitive" as const } } } : {}),
    ...(query.freeOnly ? { isFree: true } : {}),
    ...(query.dateFrom || query.dateTo
      ? {
          startDateTime: {
            ...(query.dateFrom ? { gte: query.dateFrom } : {}),
            ...(query.dateTo ? { lte: query.dateTo } : {}),
          },
        }
      : {}),
    ...(query.priceMin !== undefined || query.priceMax !== undefined
      ? {
          priceMin: {
            ...(query.priceMin !== undefined ? { gte: query.priceMin } : {}),
            ...(query.priceMax !== undefined ? { lte: query.priceMax } : {}),
          },
        }
      : {}),
  };

  try {
    const [rows, total] = await Promise.all([
      prisma!.event.findMany({
        where,
        include: { category: true, source: true },
        orderBy: { startDateTime: "asc" },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      prisma!.event.count({ where }),
    ]);

    return {
      items: rows.map(toEventCardDto),
      total,
      page: query.page,
      pageSize: query.pageSize,
    };
  } catch (error) {
    console.warn("Falling back to mock events because database query failed.", error);
    return filterMockEvents(query);
  }
}

export async function getEventBySlug(slug: string): Promise<EventCardDto | null> {
  if (!dbAvailable()) {
    const event = mockEvents.find((item) => item.slug === slug);
    return event ? mockToEventCardDto(event) : null;
  }

  try {
    const row = await prisma!.event.findFirst({
      where: { slug, status: EventStatus.APPROVED },
      include: { category: true, source: true },
    });

    return row ? toEventCardDto(row) : null;
  } catch (error) {
    console.warn("Falling back to mock event details because database query failed.", error);
    const event = mockEvents.find((item) => item.slug === slug);
    return event ? mockToEventCardDto(event) : null;
  }
}
