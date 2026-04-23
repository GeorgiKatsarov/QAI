/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/services/events";

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10" data-testid="event-details-page">
      <Link href="/map" className="text-sm text-muted-foreground hover:underline">
        Назад към събитията
      </Link>
      <h1 className="mt-3 text-3xl font-semibold" data-testid="event-title">
        {event.title}
      </h1>
      <p className="mt-2 text-muted-foreground" data-testid="event-date">
        {new Date(event.startDateTime).toLocaleString("bg-BG")}
      </p>
      <p className="text-muted-foreground" data-testid="event-venue">
        {event.venueName ?? "Мястото се уточнява"} · {event.city}
      </p>
      {event.imageUrl ? (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="mt-6 block h-auto max-h-[75vh] w-full rounded-2xl border border-border bg-muted/20 object-contain"
          loading="eager"
        />
      ) : null}
      <p className="mt-6 text-lg leading-8">
        {event.description ?? event.summary ?? "Все още няма допълнително описание за това събитие."}
      </p>
      {event.sourceUrl ? (
        <a
          href={event.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-6 text-sm hover:underline"
          data-testid="event-source-link"
        >
          Виж оригиналния източник
        </a>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground" data-testid="event-source-link">
          Няма наличен линк към източника
        </p>
      )}
    </div>
  );
}
