"use client";

import { useState } from "react";
import type { EventCardDto } from "@/lib/mappers/events";
import { MapWrapper } from "./MapWrapper";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Sofia",
  }).format(new Date(iso));
}

export function CityMapView({ events }: { events: EventCardDto[] }) {
  const [selected, setSelected] = useState<EventCardDto | null>(null);

  if (!events.length) {
    return (
      <div
        className="h-full w-full rounded-xl flex items-center justify-center bg-muted text-muted-foreground text-sm"
        data-testid="map-empty-state"
      >
        No events match your current filters.
      </div>
    );
  }

  return (
    <div className="relative h-full w-full" data-testid="map-map-view">
      <MapWrapper events={events} onSelectEvent={setSelected} />

      {/* Selected event card — floats over the map bottom-left */}
      {selected && (
        <div
          className="absolute bottom-5 left-5 z-[1000] max-w-sm rounded-xl border border-border bg-white/95 p-4 shadow-xl backdrop-blur-sm"
          data-testid="map-event-tooltip"
        >
          <button
            type="button"
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground text-lg leading-none"
            onClick={() => setSelected(null)}
            aria-label="Close"
          >
            ×
          </button>

          <p className="text-xs uppercase tracking-wide font-semibold text-primary mb-1">
            {selected.category ?? "Event"}
          </p>
          <p className="font-bold text-foreground text-base leading-snug mb-1">
            {selected.title}
          </p>
          <p className="text-sm text-muted-foreground">
            {selected.venueName ?? selected.city}
            {selected.venueName ? ` · ${selected.city}` : ""}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            {formatDate(selected.startDateTime)}
          </p>
          {selected.summary && (
            <p className="mt-2 text-sm text-foreground/80 leading-relaxed line-clamp-3">
              {selected.summary}
            </p>
          )}
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                selected.isFree
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-sky-100 text-sky-700"
              }`}
            >
              {selected.isFree ? "Free" : "Paid"}
            </span>
            <a
              href={`/events/${selected.slug}`}
              className="ml-auto text-xs font-semibold bg-primary text-white px-3 py-1 rounded-lg hover:bg-primary/90 transition-colors"
            >
              View details →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
