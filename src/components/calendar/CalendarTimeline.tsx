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

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

export function CalendarTimeline({ events }: { events: EventCardDto[] }) {
  const now = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));

  const todayKey = getDayKey(now);

  const eventsByDay = useMemo(() => {
    const grouped = events.reduce<Record<string, EventCardDto[]>>((acc, event) => {
      const dayKey = getDayKey(new Date(event.startDateTime));
      acc[dayKey] = acc[dayKey] ?? [];
      acc[dayKey].push(event);
      return acc;
    }, {});

    Object.values(grouped).forEach((dayEvents) => {
      dayEvents.sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
    });

    return grouped;
  }, [events]);

  const calendarDays = useMemo(() => getMonthGrid(viewDate, eventsByDay), [viewDate, eventsByDay]);

  const monthLabel = viewDate.toLocaleDateString([], {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-4" data-testid="calendar-month-view">
      <div className="flex items-center justify-between">
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
                      className="block rounded-md bg-background px-2 py-1 text-xs hover:bg-accent"
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
