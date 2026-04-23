import Link from "next/link";
import type { EventCardDto } from "@/lib/mappers/events";

export function EventList({ events, testIdPrefix }: { events: EventCardDto[]; testIdPrefix: string }) {
  if (!events.length) {
    return (
      <p className="text-sm text-muted-foreground" data-testid={`${testIdPrefix}-empty-state`}>
        Няма събития, които да отговарят на текущите филтри.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {events.map((event) => (
        <li key={event.id} className="rounded-lg border p-3" data-testid={`event-card-${event.id}`}>
          <Link href={`/events/${event.slug}`} className="font-medium hover:underline">
            {event.title}
          </Link>
          <p className="text-sm text-muted-foreground">
            {new Date(event.startDateTime).toLocaleString("bg-BG")} · {event.city}
          </p>
          <p className="text-sm text-muted-foreground">{event.summary ?? "Няма кратко описание."}</p>
        </li>
      ))}
    </ul>
  );
}
