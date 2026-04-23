"use client";

import { useEffect, useRef } from "react";
import type { EventCardDto } from "@/lib/mappers/events";
import "leaflet/dist/leaflet.css";

const BULGARIA_CENTER: [number, number] = [42.75, 25.2];
const BULGARIA_ZOOM = 7;

const categoryColors: Record<string, string> = {
  music: "#8B5CF6",
  art: "#EC4899",
  food: "#F59E0B",
  sports: "#10B981",
  family: "#3B82F6",
  other: "#64748B",
};

const categoryEmoji: Record<string, string> = {
  music: "🎵",
  art: "🎨",
  food: "🍽️",
  sports: "🏃",
  family: "👨‍👩‍👧",
  other: "📍",
};

const cityCoords: Record<string, [number, number]> = {
  "София": [42.6977, 23.3219],
  "Пловдив": [42.1354, 24.7453],
  "Варна": [43.2141, 27.9147],
  "Бургас": [42.5048, 27.4626],
  "Русе": [43.848, 25.954],
  "Стара Загора": [42.4258, 25.6345],
  "Плевен": [43.4168, 24.6069],
  "Благоевград": [42.0139, 23.0942],
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("bg-BG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Sofia",
  }).format(new Date(iso));
}

interface Props {
  events: EventCardDto[];
  focusLocation?: {
    latitude: number;
    longitude: number;
  } | null;
  focusRadiusKm?: number;
  onSelectEvent?: (event: EventCardDto) => void;
}

export function LeafletMap({ events, focusLocation, focusRadiusKm, onSelectEvent }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let L: typeof import("leaflet");

    import("leaflet").then((mod) => {
      L = mod.default;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current!, {
        center: BULGARIA_CENTER,
        zoom: BULGARIA_ZOOM,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      mapRef.current = map;

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      addMarkers(L, map, events, onSelectEvent);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    import("leaflet").then((mod) => {
      const L = mod.default;
      map.eachLayer((layer) => {
        if ((layer as { _isMarker?: boolean })._isMarker) {
          map.removeLayer(layer);
        }
      });
      addMarkers(L, map, events, onSelectEvent);
    });
  }, [events, onSelectEvent]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!focusLocation || !focusRadiusKm) {
      map.flyTo(BULGARIA_CENTER, BULGARIA_ZOOM, {
        duration: 0.8,
      });
      return;
    }

    import("leaflet").then((mod) => {
      const L = mod.default;
      const bounds = L.latLng(focusLocation.latitude, focusLocation.longitude).toBounds(
        focusRadiusKm * 2000
      );

      map.flyToBounds(bounds, {
        padding: [48, 48],
        maxZoom: 13,
        duration: 0.8,
      });
    });
  }, [focusLocation, focusRadiusKm]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full rounded-xl overflow-hidden"
      data-testid="map-container"
      style={{ minHeight: 400 }}
    />
  );
}

function addMarkers(
  L: typeof import("leaflet"),
  map: import("leaflet").Map,
  events: EventCardDto[],
  onSelectEvent?: (event: EventCardDto) => void
) {
  events.forEach((event, i) => {
    const cityFallback = cityCoords[event.city];
    const lat = event.latitude ?? cityFallback?.[0] ?? (42.7 + (i % 6) * 0.08);
    const lng = event.longitude ?? cityFallback?.[1] ?? (25.2 + (i % 6) * 0.12);

    const slug = event.categorySlug ?? "other";
    const color = categoryColors[slug] ?? categoryColors.other;
    const emoji = categoryEmoji[slug] ?? "📍";

    const icon = L.divIcon({
      className: "",
      html: `
        <div style="
          display:flex;align-items:center;justify-content:center;
          width:36px;height:36px;border-radius:50%;
          background:${color};border:3px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,.25);
          font-size:16px;cursor:pointer;
          transition:transform .15s;
        " title="${event.title}">
          ${emoji}
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20],
    });

    const marker = L.marker([lat, lng], { icon });
    (marker as unknown as { _isMarker: boolean })._isMarker = true;

    const priceLabel = event.isFree
      ? '<span style="color:#10B981;font-weight:600">Безплатно</span>'
      : "Платено";

    marker.bindPopup(
      `
      <div style="min-width:200px;font-family:Nunito,sans-serif;padding:2px">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:${color};font-weight:700;margin-bottom:2px">
          ${event.category ?? "Събитие"}
        </div>
        <div style="font-size:15px;font-weight:700;color:#1A4068;line-height:1.3;margin-bottom:4px">
          ${event.title}
        </div>
        <div style="font-size:12px;color:#5A87B0;margin-bottom:2px">
          📅 ${formatDate(event.startDateTime)}
        </div>
        <div style="font-size:12px;color:#5A87B0;margin-bottom:6px">
          📍 ${event.venueName ?? event.city}
        </div>
        ${
          event.summary
            ? `<div style="font-size:12px;color:#3A5A7A;border-top:1px solid #E0EEF9;padding-top:6px;margin-top:4px">${event.summary}</div>`
            : ""
        }
        <div style="margin-top:8px;display:flex;align-items:center;gap:6px">
          ${priceLabel}
          <a href="/events/${event.slug}" style="
            margin-left:auto;font-size:12px;font-weight:600;
            background:#4A9ADE;color:white;padding:3px 10px;
            border-radius:6px;text-decoration:none;
          ">Виж →</a>
        </div>
      </div>
    `,
      { maxWidth: 280 }
    );

    if (onSelectEvent) {
      marker.on("click", () => onSelectEvent(event));
    }

    marker.addTo(map);
  });
}
