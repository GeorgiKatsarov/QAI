"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { EventCardDto } from "@/lib/mappers/events";

type CalendarDayCell = {
  date: Date;
  dayKey: string;
  inCurrentMonth: boolean;
  events: EventCardDto[];
};

type UserLocation = {
  latitude: number;
  longitude: number;
};

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DISTANCE_OPTIONS_KM = [5, 10, 25, 50, 100];

function getDayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMonthGrid(viewDate: Date, eventsByDay: Record<string, EventCardDto[]>) {
  const monthStart = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const firstGridDate = new Date(monthStart);
  firstGridDate.setDate(monthStart.getDate() - monthStart.getDay());

  const cells: CalendarDayCell[] = [];

  for (let offset = 0; offset < 42; offset += 1) {
    const cellDate = new Date(firstGridDate);
    cellDate.setDate(firstGridDate.getDate() + offset);
    const dayKey = getDayKey(cellDate);

    cells.push({
      date: cellDate,
      dayKey,
      inCurrentMonth: cellDate.getMonth() === viewDate.getMonth(),
      events: eventsByDay[dayKey] ?? [],
    });
  }

  return cells;
}

function formatEventTime(dateIso: string) {
  return new Date(dateIso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getCategoryColorClasses(categorySlug: string | null) {
  switch (categorySlug) {
    case "music":
      return "border-l-4 border-l-violet-500 bg-violet-50 hover:bg-violet-100";
    case "art":
      return "border-l-4 border-l-fuchsia-500 bg-fuchsia-50 hover:bg-fuchsia-100";
    case "food":
      return "border-l-4 border-l-amber-500 bg-amber-50 hover:bg-amber-100";
    case "sports":
      return "border-l-4 border-l-emerald-500 bg-emerald-50 hover:bg-emerald-100";
    case "family":
      return "border-l-4 border-l-sky-500 bg-sky-50 hover:bg-sky-100";
    default:
      return "border-l-4 border-l-slate-400 bg-background hover:bg-accent";
  }
}

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

export function CalendarTimeline({ events }: { events: EventCardDto[] }) {
  const now = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [radiusKm, setRadiusKm] = useState(25);
  const [locationStatus, setLocationStatus] = useState<string>("");

  const todayKey = getDayKey(now);

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

  const eventsByDay = useMemo(() => {
    const grouped = visibleEvents.reduce<Record<string, EventCardDto[]>>((acc, event) => {
      const dayKey = getDayKey(new Date(event.startDateTime));
      acc[dayKey] = acc[dayKey] ?? [];
      acc[dayKey].push(event);
      return acc;
    }, {});

    Object.values(grouped).forEach((dayEvents) => {
      dayEvents.sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
    });

    return grouped;
  }, [visibleEvents]);

  const calendarDays = useMemo(() => getMonthGrid(viewDate, eventsByDay), [viewDate, eventsByDay]);

  const monthLabel = viewDate.toLocaleDateString([], {
    month: "long",
    year: "numeric",
  });

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
    <div className="space-y-4" data-testid="calendar-month-view">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
          className="rounded-md border border-border px-3 py-1.5 text-sm font-medium"
          data-testid="calendar-prev-month"
        >
          Previous
        </button>
        <h2 className="text-lg font-semibold" data-testid="calendar-current-month">
          {monthLabel}
        </h2>
        <button
          type="button"
          onClick={() => setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
          className="rounded-md border border-border px-3 py-1.5 text-sm font-medium"
          data-testid="calendar-next-month"
        >
          Next
        </button>
      </div>

      <div className="rounded-lg border border-border bg-muted/20 p-3" data-testid="calendar-proximity-controls">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium"
            onClick={requestUserLocation}
            data-testid="calendar-location-button"
          >
            Use my location
          </button>

          <label htmlFor="calendar-radius" className="text-sm font-medium text-muted-foreground">
            Radius
          </label>
          <select
            id="calendar-radius"
            value={radiusKm}
            onChange={(event) => setRadiusKm(Number(event.target.value))}
            disabled={!userLocation}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm disabled:opacity-60"
            data-testid="calendar-radius-filter"
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
              data-testid="calendar-clear-location"
            >
              Clear location filter
            </button>
          ) : null}
        </div>

        <p className="mt-2 text-xs text-muted-foreground" data-testid="calendar-location-status">
          {locationStatus || "Enable location to filter events by distance from you."}
        </p>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {WEEKDAY_LABELS.map((day) => (
          <p key={day} className="text-center text-xs font-semibold uppercase text-muted-foreground">
            {day}
          </p>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2" data-testid="calendar-grid">
        {calendarDays.map((day) => {
          const isToday = day.dayKey === todayKey;
          return (
            <section
              key={day.dayKey}
              className={[
                "min-h-32 rounded-lg border p-2",
                day.inCurrentMonth ? "bg-card" : "bg-muted/40 text-muted-foreground",
                isToday ? "border-primary ring-1 ring-primary" : "border-border",
              ].join(" ")}
              data-testid={`calendar-day-${day.dayKey}`}
            >
              <div className="mb-2 flex items-center justify-between">
                <p className={["text-sm font-semibold", isToday ? "text-primary" : ""].join(" ")}>{day.date.getDate()}</p>
                {day.events.length > 0 ? (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {day.events.length}
                  </span>
                ) : null}
              </div>

              <ul className="space-y-1">
                {day.events.map((event) => (
                  <li key={event.id}>
                    <Link
                      href={`/events/${event.slug}`}
                      className={`block rounded-md px-2 py-1 text-xs ${getCategoryColorClasses(event.categorySlug)}`}
                      data-testid={`event-card-${event.id}`}
                    >
                      <p className="truncate font-medium">{event.title}</p>
                      <p className="truncate text-muted-foreground">
                        {formatEventTime(event.startDateTime)} · {event.city}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
