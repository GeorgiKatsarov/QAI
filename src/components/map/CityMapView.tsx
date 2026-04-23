import type { EventCardDto } from "@/lib/mappers/events";

const cityCoordinates: Record<string, { x: number; y: number }> = {
  Sofia: { x: 35, y: 62 },
  Plovdiv: { x: 55, y: 68 },
  Varna: { x: 80, y: 45 },
};

type CityMarker = {
  city: string;
  count: number;
  x: number;
  y: number;
};

function buildCityMarkers(events: EventCardDto[]): CityMarker[] {
  const grouped = events.reduce<Record<string, number>>((acc, event) => {
    acc[event.city] = (acc[event.city] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(grouped).map(([city, count], index) => {
    const fallbackX = 30 + (index % 3) * 20;
    const fallbackY = 30 + (index % 2) * 25;
    const coords = cityCoordinates[city] ?? { x: fallbackX, y: fallbackY };

    return { city, count, ...coords };
  });
}

export function CityMapView({ events }: { events: EventCardDto[] }) {
  const markers = buildCityMarkers(events);

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
        {markers.map((marker) => (
          <div
            key={marker.city}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            data-testid={`map-marker-${marker.city.toLowerCase()}`}
          >
            <div className="rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
              {marker.city} · {marker.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
