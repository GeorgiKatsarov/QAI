"use client";

import { useMemo, useState } from "react";
import type { EventCardDto } from "@/lib/mappers/events";

const cityCoordinates: Record<string, { latitude: number; longitude: number }> = {
  Sofia: { latitude: 42.6977, longitude: 23.3219 },
  Plovdiv: { latitude: 42.1354, longitude: 24.7453 },
  Varna: { latitude: 43.2141, longitude: 27.9147 },
  Burgas: { latitude: 42.5048, longitude: 27.4626 },
  Ruse: { latitude: 43.848, longitude: 25.954 },
  "Stara Zagora": { latitude: 42.4258, longitude: 25.6345 },
};

const BULGARIA_BOUNDS = {
  minLatitude: 41.2,
  maxLatitude: 44.25,
  minLongitude: 22.3,
  maxLongitude: 28.7,
};

const categoryStyles: Record<string, { color: string; ring: string }> = {
  music: { color: "#8B5CF6", ring: "ring-violet-200" },
  art: { color: "#EC4899", ring: "ring-pink-200" },
  food: { color: "#F59E0B", ring: "ring-amber-200" },
  sports: { color: "#10B981", ring: "ring-emerald-200" },
  family: { color: "#3B82F6", ring: "ring-sky-200" },
  default: { color: "#64748B", ring: "ring-slate-200" },
};

type EventMarker = {
  id: string;
  x: number;
  y: number;
  event: EventCardDto;
  color: string;
  ringClass: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function toMapCoordinates(latitude: number, longitude: number) {
  const xRatio =
    (longitude - BULGARIA_BOUNDS.minLongitude) / (BULGARIA_BOUNDS.maxLongitude - BULGARIA_BOUNDS.minLongitude);
  const yRatio =
    (latitude - BULGARIA_BOUNDS.minLatitude) / (BULGARIA_BOUNDS.maxLatitude - BULGARIA_BOUNDS.minLatitude);

  return {
    x: clamp(xRatio * 100, 6, 94),
    y: clamp((1 - yRatio) * 100, 8, 92),
  };
}

function formatEventTime(dateString: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Sofia",
  }).format(new Date(dateString));
}

function buildEventMarkers(events: EventCardDto[]): EventMarker[] {
  return events.map((event, index) => {
    const cityCoords = cityCoordinates[event.city];
    const latitude = event.latitude ?? cityCoords?.latitude ?? 42 + (index % 8) * 0.18;
    const longitude = event.longitude ?? cityCoords?.longitude ?? 23 + (index % 8) * 0.35;
    const offset = ((index % 5) - 2) * 0.4;
    const { x, y } = toMapCoordinates(latitude + offset * 0.03, longitude + offset * 0.03);
    const style = categoryStyles[event.categorySlug ?? ""] ?? categoryStyles.default;

    return {
      id: event.id,
      x,
      y,
      event,
      color: style.color,
      ringClass: style.ring,
    };
  });
}

export function CityMapView({ events }: { events: EventCardDto[] }) {
  const markers = useMemo(() => buildEventMarkers(events), [events]);
  const [zoom, setZoom] = useState(1);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  if (!markers.length) {
    return (
      <div className="text-sm text-muted-foreground" data-testid="map-empty-state">
        No matching events to place on the map.
      </div>
    );
  }

  const activeEventId = hoveredEventId ?? selectedEventId ?? markers[0]?.id;
  const activeMarker = markers.find((marker) => marker.id === activeEventId) ?? markers[0];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-card/80 p-3" data-testid="map-map-view">
      <div className="pointer-events-none absolute inset-3 rounded-lg bg-gradient-to-b from-[#E8F5FF] via-[#F6FBFF] to-[#EEF8FF]" />

      <div className="absolute right-5 top-5 z-20 flex gap-2" data-testid="map-zoom-controls">
        <button
          type="button"
          className="rounded-md border border-border bg-background/95 px-2 py-1 text-sm font-semibold shadow-sm"
          onClick={() => setZoom((current) => clamp(current + 0.2, 1, 2.6))}
          aria-label="Zoom in"
          data-testid="map-zoom-in"
        >
          +
        </button>
        <button
          type="button"
          className="rounded-md border border-border bg-background/95 px-2 py-1 text-sm font-semibold shadow-sm"
          onClick={() => setZoom((current) => clamp(current - 0.2, 1, 2.6))}
          aria-label="Zoom out"
          data-testid="map-zoom-out"
        >
          −
        </button>
      </div>

      <div className="absolute inset-3 overflow-hidden rounded-lg">
        <div className="relative h-full w-full origin-center transition-transform duration-150" style={{ transform: `scale(${zoom})` }}>
          <svg viewBox="0 0 1000 620" className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="bgSea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D6EEFF" />
                <stop offset="100%" stopColor="#BFDFFF" />
              </linearGradient>
              <linearGradient id="bgLand" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#A6CF87" />
                <stop offset="65%" stopColor="#8CBE72" />
                <stop offset="100%" stopColor="#6EAB5D" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="1000" height="620" rx="22" fill="url(#bgSea)" />
            <path
              d="M88 320l35-58 53-18 44-52 78-23 70 10 58-23 54-12 84 10 73 35 69-2 48 24 52-4 52 25 72 5 65 32 26 43-18 36 28 42-37 36-75 17-66-4-75 26-66-8-67 19-72-16-43 9-67-15-57-35-61-19-69-1-56-27-50-42z"
              fill="url(#bgLand)"
              stroke="#3B7642"
              strokeWidth="6"
              strokeLinejoin="round"
            />
            <path
              d="M175 315l70-45 99-17 80-34 129 15 93 30 114 4 89 30"
              fill="none"
              stroke="#6EA95E"
              strokeWidth="4"
              opacity="0.45"
            />
            <path
              d="M790 214c56 20 111 65 118 128 8 73-35 149-114 201"
              fill="none"
              stroke="#9ED0FB"
              strokeWidth="18"
              strokeLinecap="round"
            />
          </svg>

          {markers.map((marker, index) => {
            const isActive = marker.id === activeMarker.id;

            return (
              <button
                key={`${marker.id}-${index}`}
                type="button"
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-1 transition-transform ${isActive ? "scale-110" : "hover:scale-105"}`}
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                title={`${marker.event.title} (${marker.event.city})`}
                onMouseEnter={() => setHoveredEventId(marker.id)}
                onMouseLeave={() => setHoveredEventId(null)}
                onFocus={() => setHoveredEventId(marker.id)}
                onBlur={() => setHoveredEventId(null)}
                onClick={() => setSelectedEventId(marker.id)}
                data-testid={`map-marker-${index + 1}`}
              >
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full bg-background/90 text-lg shadow-md ring-2 ${marker.ringClass}`}
                  style={{ color: marker.color }}
                  aria-hidden="true"
                >
                  📍
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-5 left-5 z-20 max-w-md rounded-lg border border-border bg-background/95 p-3 shadow-md" data-testid="map-event-tooltip">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{activeMarker.event.category ?? "General"}</p>
        <p className="text-base font-semibold text-foreground">{activeMarker.event.title}</p>
        <p className="text-sm text-muted-foreground">{activeMarker.event.city}{activeMarker.event.venueName ? ` · ${activeMarker.event.venueName}` : ""}</p>
        <p className="mt-1 text-sm text-muted-foreground">{formatEventTime(activeMarker.event.startDateTime)}</p>
        {activeMarker.event.summary ? <p className="mt-2 text-sm leading-relaxed text-foreground/90">{activeMarker.event.summary}</p> : null}
        <p className="mt-2 text-xs text-muted-foreground">
          {activeMarker.event.isFree ? "Free event" : "Paid event"}
          {activeMarker.event.sourceName ? ` · Source: ${activeMarker.event.sourceName}` : ""}
        </p>
      </div>
    </div>
  );
}
