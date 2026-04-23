export default function SubmitPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl" data-testid="submit-event-page">
      <h1 className="text-2xl font-bold mb-2">Submit an Event</h1>
      <p className="text-muted-foreground mb-8">
        Propose a new event. Our team will review it before it goes live.
      </p>

      <form
        className="space-y-5"
        data-testid="submit-event-form"
        aria-label="Submit event form"
      >
        <div className="space-y-1.5">
          <label htmlFor="title" className="text-sm font-medium">
            Event title <span className="text-destructive">*</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Jazz Night at Club Sofia"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            data-testid="submit-title-input"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="date" className="text-sm font-medium">
            Date <span className="text-destructive">*</span>
          </label>
          <input
            id="date"
            type="datetime-local"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            data-testid="submit-date-input"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="city" className="text-sm font-medium">
            City <span className="text-destructive">*</span>
          </label>
          <input
            id="city"
            type="text"
            placeholder="e.g. Sofia"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            data-testid="submit-city-input"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="category" className="text-sm font-medium">
            Category <span className="text-destructive">*</span>
          </label>
          <select
            id="category"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            data-testid="submit-category-input"
          >
            <option value="">Select a category</option>
            <option value="music">Music</option>
            <option value="art">Art & Exhibitions</option>
            <option value="food">Food & Drink</option>
            <option value="sports">Sports</option>
            <option value="family">Family</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Your email <span className="text-destructive">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            data-testid="submit-email-input"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          data-testid="submit-button"
        >
          Submit for review
        </button>
      </form>
    </div>
  );
}
