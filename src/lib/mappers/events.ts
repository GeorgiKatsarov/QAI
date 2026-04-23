import type { Event, Category, Source } from "@/generated/prisma";
import type { MockEvent } from "@/lib/mock/events";

type EventWithRelations = Event & {
  category: Category | null;
  source: Source | null;
};

export type EventCardDto = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  city: string;
  venueName: string | null;
  startDateTime: string;
  latitude: number | null;
  longitude: number | null;
  category: string | null;
  categorySlug: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
  isFree: boolean;
};

export function toEventCardDto(event: EventWithRelations): EventCardDto {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    summary: event.summary,
    city: event.city,
    venueName: event.venueName,
    startDateTime: event.startDateTime.toISOString(),
    latitude: event.latitude,
    longitude: event.longitude,
    category: event.category?.name ?? null,
    categorySlug: event.category?.slug ?? null,
    sourceName: event.source?.name ?? null,
    sourceUrl: event.sourceUrl ?? event.source?.baseUrl ?? null,
    isFree: event.isFree,
  };
}

export function mockToEventCardDto(event: MockEvent): EventCardDto {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    summary: event.summary,
    city: event.city,
    venueName: event.venueName,
    startDateTime: event.startDateTime,
    latitude: event.latitude ?? null,
    longitude: event.longitude ?? null,
    category: event.category.name,
    categorySlug: event.category.slug,
    sourceName: event.source?.name ?? null,
    sourceUrl: event.source?.url ?? null,
    isFree: event.isFree,
  };
}
