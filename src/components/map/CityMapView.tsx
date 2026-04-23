import type { EventCardDto } from "@/lib/mappers/events";

const cityCoordinates: Record<string, { latitude: number; longitude: number }> = {
  Sofia: { latitude: 42.6977, longitude: 23.3219 },
  Plovdiv: { latitude: 42.1354, longitude: 24.7453 },
  Varna: { latitude: 43.2141, longitude: 27.9147 },
};

type EventMarker = {
  id: string;
  label: string;
  x: number;
  y: number;
};

const BULGARIA_BOUNDS = {
  minLatitude: 41.2,
  maxLatitude: 44.25,
  minLongitude: 22.3,
  maxLongitude: 28.7,
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

function buildEventMarkers(events: EventCardDto[]): EventMarker[] {
  return events.map((event, index) => {
    const cityCoords = cityCoordinates[event.city];
    const latitude = event.latitude ?? cityCoords?.latitude ?? 42 + (index % 8) * 0.18;
    const longitude = event.longitude ?? cityCoords?.longitude ?? 23 + (index % 8) * 0.35;
    const offset = ((index % 5) - 2) * 0.4;
    const { x, y } = toMapCoordinates(latitude + offset * 0.03, longitude + offset * 0.03);

    return {
      id: event.id,
      label: `${event.title} (${event.city})`,
      x,
      y,
    };
  });
}

export function CityMapView({ events }: { events: EventCardDto[] }) {
  const markers = buildEventMarkers(events);

  if (!markers.length) {
    return (
      <div className="text-sm text-muted-foreground" data-testid="map-empty-state">
        No matching events to place on the map.
      </div>
    );
  }

  return (
    <div className="relative h-full w-full rounded-lg border border-border bg-card/80 p-3" data-testid="map-map-view">
      <div className="absolute inset-3 rounded-md bg-gradient-to-br from-[#E6F2FF] via-[#F4FBFF] to-[#EAF7FF]" />
      <div className="relative h-full w-full">
        {markers.map((marker, index) => (
          <div
            key={`${marker.id}-${index}`}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            title={marker.label}
            data-testid={`map-marker-${index + 1}`}
          >
            <div className="rounded-full bg-background/95 px-1.5 py-1 text-base shadow-sm ring-1 ring-border">
              📍
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
