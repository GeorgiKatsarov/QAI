import { NotificationSubscriptionForm } from "@/components/notifications/NotificationSubscriptionForm";

export default function NotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl" data-testid="notifications-page">
      <h1 className="text-2xl font-bold mb-2">Get Notified</h1>
      <p className="text-muted-foreground mb-8">
        Subscribe to receive a digest of events that match your interests.
      </p>
      <NotificationSubscriptionForm />
    </div>
  );
}
