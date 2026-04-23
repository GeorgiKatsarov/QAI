import Link from "next/link";
import type { EventCardDto } from "@/lib/mappers/events";

function formatDayKey(dateIso: string) {
  return new Date(dateIso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function CalendarTimeline({ events }: { events: EventCardDto[] }) {
  if (!events.length) {
    return (
      <p className="text-sm text-muted-foreground" data-testid="calendar-empty-state">
        No events found for this date range.
      </p>
    );
  }

  const grouped = events.reduce<Record<string, EventCardDto[]>>((acc, event) => {
    const key = formatDayKey(event.startDateTime);
    acc[key] = acc[key] ?? [];
    acc[key].push(event);
    return acc;
  }, {});

  return (
    <div className="space-y-6" data-testid="calendar-timeline-view">
      {Object.entries(grouped).map(([day, dayEvents]) => (
        <section key={day} className="space-y-3" data-testid={`calendar-day-${day.replace(/\s+/g, "-").toLowerCase()}`}>
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">{day}</h2>
          <ul className="space-y-2">
            {dayEvents.map((event) => (
              <li
                key={event.id}
                className="rounded-lg border border-border bg-background px-4 py-3"
                data-testid={`event-card-${event.id}`}
              >
                <Link href={`/events/${event.slug}`} className="font-semibold hover:underline">
                  {event.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {new Date(event.startDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ·{" "}
                  {event.city}
                  {event.venueName ? ` · ${event.venueName}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
