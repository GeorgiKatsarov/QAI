import { SubmitEventForm } from "@/components/submit/SubmitEventForm";

export default function SubmitPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl" data-testid="submit-event-page">
      <h1 className="text-2xl font-bold mb-2">Submit an Event</h1>
      <p className="text-muted-foreground mb-8">Propose a new event. Our team will review it before it goes live.</p>
      <SubmitEventForm />
    </div>
  );
}
