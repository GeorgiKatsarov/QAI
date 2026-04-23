"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { EventCardDto } from "@/lib/mappers/events";

type LeafletMap = {
  remove: () => void;
  eachLayer: (fn: (layer: unknown) => void) => void;
  removeLayer: (layer: unknown) => void;
  fitBounds: (bounds: [number, number][], options?: { padding?: [number, number] }) => void;
};

type LeafletNamespace = {
  map: (el: HTMLElement, options: Record<string, unknown>) => LeafletMap;
  tileLayer: (url: string, options: Record<string, unknown>) => { addTo: (map: LeafletMap) => void };
  polygon: (latlngs: [number, number][], options: Record<string, unknown>) => { addTo: (map: LeafletMap) => void };
  divIcon: (options: Record<string, unknown>) => unknown;
  marker: (latlng: [number, number], options?: Record<string, unknown>) => {
    addTo: (map: LeafletMap) => {
      on: (event: string, handler: (eventData: Record<string, unknown>) => void) => void;
    };
    bindTooltip: (html: string, options?: Record<string, unknown>) => void;
  };
};

const cityCoordinates: Record<string, { latitude: number; longitude: number }> = {
  Sofia: { latitude: 42.6977, longitude: 23.3219 },
  Plovdiv: { latitude: 42.1354, longitude: 24.7453 },
  Varna: { latitude: 43.2141, longitude: 27.9147 },
  Burgas: { latitude: 42.5048, longitude: 27.4626 },
  Ruse: { latitude: 43.848, longitude: 25.954 },
  "Stara Zagora": { latitude: 42.4258, longitude: 25.6345 },
};

const BULGARIA_OUTLINE: [number, number][] = [
  [44.2176, 22.3571],
  [44.0414, 22.7364],
  [43.8602, 23.1805],
  [43.7468, 23.9745],
  [43.8232, 24.7192],
  [43.7424, 25.5258],
  [43.6636, 26.3002],
  [43.6756, 27.0669],
  [43.8127, 27.7217],
  [43.5872, 28.5732],
  [42.959, 28.0014],
  [42.4836, 27.658],
  [42.1399, 27.3048],
  [41.9803, 26.8971],
  [41.7869, 26.117],
  [41.7166, 25.0897],
  [41.453, 24.4289],
  [41.3092, 23.9187],
  [41.2703, 23.031],
  [41.4129, 22.4576],
  [41.7828, 22.7057],
  [42.3049, 22.44],
  [42.5975, 22.9726],
  [43.0536, 22.5001],
  [43.4623, 22.4104],
  [44.2176, 22.3571],
];

const categoryColors: Record<string, string> = {
  music: "#8B5CF6",
  art: "#EC4899",
  food: "#F59E0B",
  sports: "#10B981",
  family: "#3B82F6",
  default: "#64748B",
};

type EventMarker = {
  id: string;
  latitude: number;
  longitude: number;
  event: EventCardDto;
  color: string;
};

type HoverCard = {
  event: EventCardDto;
  x: number;
  y: number;
};

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
    const latitude = event.latitude ?? cityCoords?.latitude ?? 42 + (index % 8) * 0.1;
    const longitude = event.longitude ?? cityCoords?.longitude ?? 23 + (index % 8) * 0.2;
    const offset = ((index % 5) - 2) * 0.01;

    return {
      id: event.id,
      latitude: latitude + offset,
      longitude: longitude + offset,
      event,
      color: categoryColors[event.categorySlug ?? ""] ?? categoryColors.default,
    };
  });
}

export function CityMapView({ events }: { events: EventCardDto[] }) {
  const markers = useMemo(() => buildEventMarkers(events), [events]);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<LeafletMap | null>(null);
  const [hoverCard, setHoverCard] = useState<HoverCard | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventCardDto | null>(null);

  useEffect(() => {
    if (!mapRef.current || !markers.length) {
      return;
    }

    let cancelled = false;

    const setupMap = async () => {
      if (!document.getElementById("leaflet-css")) {
        const css = document.createElement("link");
        css.id = "leaflet-css";
        css.rel = "stylesheet";
        css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(css);
      }

      if (!(window as typeof window & { L?: LeafletNamespace }).L) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Leaflet"));
          document.body.appendChild(script);
        });
      }

      if (cancelled || !mapRef.current) {
        return;
      }

      const L = (window as typeof window & { L: LeafletNamespace }).L;

      leafletMapRef.current?.remove();
      const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: true, minZoom: 6, maxZoom: 15 });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      L.polygon(BULGARIA_OUTLINE, {
        color: "#14532D",
        weight: 2,
        fillColor: "#86EFAC",
        fillOpacity: 0.2,
      }).addTo(map);

      map.fitBounds(BULGARIA_OUTLINE, { padding: [25, 25] });

      markers.forEach((marker) => {
        const icon = L.divIcon({
          html: `<span style="font-size:24px;color:${marker.color};filter:drop-shadow(0 1px 2px rgba(0,0,0,.35));">📍</span>`,
          className: "",
          iconSize: [24, 24],
          iconAnchor: [12, 24],
        });

        const leafletMarker = L.marker([marker.latitude, marker.longitude], { icon }).addTo(map);

        leafletMarker.bindTooltip(marker.event.title, { direction: "top", offset: [0, -18] });

        leafletMarker.on("mouseover", (eventData) => {
          const containerPoint = eventData.containerPoint as { x: number; y: number };
          setHoverCard({ event: marker.event, x: containerPoint.x, y: containerPoint.y });
        });

        leafletMarker.on("mousemove", (eventData) => {
          const containerPoint = eventData.containerPoint as { x: number; y: number };
          setHoverCard({ event: marker.event, x: containerPoint.x, y: containerPoint.y });
        });

        leafletMarker.on("mouseout", () => {
          setHoverCard(null);
        });

        leafletMarker.on("click", () => {
          setSelectedEvent(marker.event);
        });
      });

      leafletMapRef.current = map;
    };

    setupMap().catch(() => undefined);

    return () => {
      cancelled = true;
      leafletMapRef.current?.remove();
      leafletMapRef.current = null;
    };
  }, [markers]);

  if (!markers.length) {
    return (
      <div className="text-sm text-muted-foreground" data-testid="map-empty-state">
        No matching events to place on the map.
      </div>
    );
  }

  const eventToDisplay = hoverCard?.event ?? selectedEvent ?? markers[0].event;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-card/80 p-3" data-testid="map-map-view">
      <div className="h-full w-full overflow-hidden rounded-lg" ref={mapRef} data-testid="leaflet-map-canvas" />

      {hoverCard ? (
        <div
          className="pointer-events-none absolute z-[1000] max-w-sm -translate-y-full rounded-md border border-border bg-background/95 p-2 shadow-lg"
          style={{ left: hoverCard.x + 22, top: hoverCard.y + 12 }}
          data-testid="map-hover-tooltip"
        >
          <p className="text-xs font-medium text-muted-foreground">{hoverCard.event.category ?? "General"}</p>
          <p className="text-sm font-semibold text-foreground">{hoverCard.event.title}</p>
          <p className="text-xs text-muted-foreground">{hoverCard.event.city}</p>
        </div>
      ) : null}

      <div className="absolute bottom-5 left-5 z-[900] max-w-md rounded-lg border border-border bg-background/95 p-3 shadow-md" data-testid="map-event-tooltip">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{eventToDisplay.category ?? "General"}</p>
        <p className="text-base font-semibold text-foreground">{eventToDisplay.title}</p>
        <p className="text-sm text-muted-foreground">{eventToDisplay.city}{eventToDisplay.venueName ? ` · ${eventToDisplay.venueName}` : ""}</p>
        <p className="mt-1 text-sm text-muted-foreground">{formatEventTime(eventToDisplay.startDateTime)}</p>
        {eventToDisplay.summary ? <p className="mt-2 text-sm leading-relaxed text-foreground/90">{eventToDisplay.summary}</p> : null}
        <p className="mt-2 text-xs text-muted-foreground">
          {eventToDisplay.isFree ? "Free event" : "Paid event"}
          {eventToDisplay.sourceName ? ` · Source: ${eventToDisplay.sourceName}` : ""}
        </p>
      </div>
    </div>
  );
}
