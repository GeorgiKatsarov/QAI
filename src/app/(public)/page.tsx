import Link from "next/link";
import { Map, Calendar, Send, Bell } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16" data-testid="home-page">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Discover Events in Bulgaria
        </h1>
        <p className="text-lg text-muted-foreground">
          Find concerts, exhibitions, markets, and more — by map or by calendar.
        </p>

        <div className="grid grid-cols-2 gap-4 pt-6">
          <Link
            href="/map"
            data-testid="home-cta-map"
            className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-center"
          >
            <Map className="size-8 text-primary" />
            <div>
              <p className="font-semibold">Map View</p>
              <p className="text-sm text-muted-foreground">Browse by location</p>
            </div>
          </Link>

          <Link
            href="/calendar"
            data-testid="home-cta-calendar"
            className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-center"
          >
            <Calendar className="size-8 text-primary" />
            <div>
              <p className="font-semibold">Calendar View</p>
              <p className="text-sm text-muted-foreground">Browse by date</p>
            </div>
          </Link>

          <Link
            href="/submit"
            data-testid="home-cta-submit"
            className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-center"
          >
            <Send className="size-8 text-primary" />
            <div>
              <p className="font-semibold">Submit an Event</p>
              <p className="text-sm text-muted-foreground">Add your event</p>
            </div>
          </Link>

          <Link
            href="/notifications"
            data-testid="home-cta-notifications"
            className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-center"
          >
            <Bell className="size-8 text-primary" />
            <div>
              <p className="font-semibold">Get Notified</p>
              <p className="text-sm text-muted-foreground">Event digests by email</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
