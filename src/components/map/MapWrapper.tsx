"use client";

import dynamic from "next/dynamic";
import type { EventCardDto } from "@/lib/mappers/events";

// Leaflet touches `window` on import — must be client-only, no SSR
const LeafletMap = dynamic(
  () => import("./LeafletMap").then((m) => m.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-full w-full rounded-xl flex items-center justify-center bg-muted text-muted-foreground text-sm"
        data-testid="map-loading-state"
      >
        Loading map…
      </div>
    ),
  }
);

interface Props {
  events: EventCardDto[];
  focusLocation?: {
    latitude: number;
    longitude: number;
  } | null;
  focusRadiusKm?: number;
  onSelectEvent?: (event: EventCardDto) => void;
}

export function MapWrapper({ events, focusLocation, focusRadiusKm, onSelectEvent }: Props) {
  return (
    <LeafletMap
      events={events}
      focusLocation={focusLocation}
      focusRadiusKm={focusRadiusKm}
      onSelectEvent={onSelectEvent}
    />
  );
}
