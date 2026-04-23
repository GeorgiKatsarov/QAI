import Image from "next/image";
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
        Back to events
      </Link>
      <h1 className="mt-3 text-3xl font-semibold" data-testid="event-title">
        {event.title}
      </h1>
      <p className="mt-2 text-muted-foreground" data-testid="event-date">
        {new Date(event.startDateTime).toLocaleString()}
      </p>
      <p className="text-muted-foreground" data-testid="event-venue">
        {event.venueName ?? "Venue TBD"} · {event.city}
      </p>
      {event.imageUrl ? (
        <Image
          src={event.imageUrl}
          alt={event.title}
          width={1200}
          height={675}
          className="mt-6 aspect-[16/9] w-full rounded-2xl border border-border object-cover"
          priority
        />
      ) : null}
      <p className="mt-6 text-lg leading-8">
        {event.description ?? event.summary ?? "No additional event description is available yet."}
      </p>
      {event.sourceUrl ? (
        <a
          href={event.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-6 text-sm hover:underline"
          data-testid="event-source-link"
        >
          View original source
        </a>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground" data-testid="event-source-link">
          Source link unavailable
        </p>
      )}
    </div>
  );
}
