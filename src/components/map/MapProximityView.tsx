"use client";

import { useMemo, useState } from "react";
import type { EventCardDto } from "@/lib/mappers/events";
import { CityMapView } from "@/components/map/CityMapView";
import { EventList } from "@/components/events/EventList";

type UserLocation = {
  latitude: number;
  longitude: number;
};

const DISTANCE_OPTIONS_KM = [5, 10, 25, 50, 100];

function getDistanceInKm(from: UserLocation, to: UserLocation) {
  const earthRadiusKm = 6371;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLon = toRadians(to.longitude - from.longitude);
  const fromLat = toRadians(from.latitude);
  const toLat = toRadians(to.latitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

export function MapProximityView({ events }: { events: EventCardDto[] }) {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [radiusKm, setRadiusKm] = useState(25);
  const [locationStatus, setLocationStatus] = useState("");

  const visibleEvents = useMemo(() => {
    if (!userLocation) {
      return events;
    }

    return events.filter((event) => {
      if (event.latitude == null || event.longitude == null) {
        return false;
      }

      return (
        getDistanceInKm(userLocation, {
          latitude: event.latitude,
          longitude: event.longitude,
        }) <= radiusKm
      );
    });
  }, [events, userLocation, radiusKm]);

  function requestUserLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation is not supported in this browser.");
      return;
    }

    setLocationStatus("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus("Location enabled. Showing nearby events.");
      },
      () => {
        setLocationStatus("Location access denied. Please allow location to use proximity filtering.");
      },
    );
  }

  return (
    <>
      <div className="border-b border-border px-4 py-3" data-testid="map-proximity-controls">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium"
            onClick={requestUserLocation}
            data-testid="map-location-button"
          >
            Use my location
          </button>

          <label htmlFor="map-radius" className="text-sm font-medium text-muted-foreground">
            Radius
          </label>
          <select
            id="map-radius"
            value={radiusKm}
            onChange={(event) => setRadiusKm(Number(event.target.value))}
            disabled={!userLocation}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm disabled:opacity-60"
            data-testid="map-radius-filter"
          >
            {DISTANCE_OPTIONS_KM.map((distance) => (
              <option key={distance} value={distance}>
                {distance} km
              </option>
            ))}
          </select>

          {userLocation ? (
            <button
              type="button"
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
              onClick={() => {
                setUserLocation(null);
                setLocationStatus("Proximity filter cleared.");
              }}
              data-testid="map-clear-location"
            >
              Clear location filter
            </button>
          ) : null}
        </div>
        <p className="mt-2 text-xs text-muted-foreground" data-testid="map-location-status">
          {locationStatus || "Enable location to filter events by distance from you."}
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-4" data-testid="map-container">
          <CityMapView events={visibleEvents} />
        </div>

        <aside className="w-96 border-l border-border overflow-y-auto">
          <div className="p-4 space-y-3" data-testid="map-results-list">
            <EventList events={visibleEvents} testIdPrefix="map" />
          </div>
        </aside>
      </div>
    </>
  );
}
