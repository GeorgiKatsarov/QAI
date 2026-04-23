export default function NotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl" data-testid="notifications-page">
      <h1 className="text-2xl font-bold mb-2">Get Notified</h1>
      <p className="text-muted-foreground mb-8">
        Subscribe to receive a digest of events that match your interests.
      </p>

      <form
        className="space-y-5"
        data-testid="subscription-form"
        aria-label="Notification subscription form"
      >
        <div className="space-y-1.5">
          <label htmlFor="sub-email" className="text-sm font-medium">
            Email <span className="text-destructive">*</span>
          </label>
          <input
            id="sub-email"
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            data-testid="subscription-email-input"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="sub-city" className="text-sm font-medium">
            City
          </label>
          <select
            id="sub-city"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            data-testid="subscription-city-select"
          >
            <option value="">All cities</option>
            <option value="sofia">Sofia</option>
            <option value="plovdiv">Plovdiv</option>
            <option value="varna">Varna</option>
            <option value="burgas">Burgas</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="sub-category" className="text-sm font-medium">
            Category
          </label>
          <select
            id="sub-category"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            data-testid="subscription-category-select"
          >
            <option value="">All categories</option>
            <option value="music">Music</option>
            <option value="art">Art & Exhibitions</option>
            <option value="food">Food & Drink</option>
            <option value="sports">Sports</option>
            <option value="family">Family</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="sub-frequency" className="text-sm font-medium">
            Frequency
          </label>
          <select
            id="sub-frequency"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            data-testid="subscription-frequency-select"
          >
            <option value="daily">Daily digest</option>
            <option value="weekly">Weekly digest</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          data-testid="subscription-submit-button"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}
