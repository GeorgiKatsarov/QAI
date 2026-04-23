# Roamer Web App Blueprint

## 1. Product Goal

Build a Bulgaria-focused event discovery platform with:

- An interactive map view for location-based discovery
- A calendar view for date-based discovery
- Strong filtering so users are not overwhelmed
- Event ingestion from public sources such as `grabo.bg` and other Bulgarian event sites
- A user submission flow for new events
- An admin approval workflow before submitted events go live
- An email notification service based on user interests and preferences

The product should be easy to "vibe code", easy to modify fast, and still follow solid engineering practices.

## 2. Recommended Tech Stack

Use technologies that are productive, well-supported, and easy to iterate on:

- Frontend: `Next.js` + `React` + `TypeScript`
- UI: `Tailwind CSS` + `shadcn/ui`
- Backend: `Next.js Route Handlers` for MVP, with option to split later
- Database: `PostgreSQL`
- ORM: `Prisma`
- Auth: `Clerk` or `NextAuth`
- Map: `Mapbox GL JS` or `Leaflet`
- Calendar: `FullCalendar`
- Background jobs: `Inngest` or `Trigger.dev`
- Scraping: `Playwright` + `Cheerio`
- Email: `Resend`
- Validation: `Zod`
- Forms: `React Hook Form`
- Hosting: `Vercel` for app, `Neon` or `Supabase Postgres` for DB
- Monitoring: `Sentry`

## 3. Why This Stack

- `Next.js` keeps frontend and backend close together, which speeds up development.
- `TypeScript` improves safety without slowing iteration too much.
- `Prisma` makes schema changes and database access fast to evolve.
- `Tailwind` and `shadcn/ui` are easy to customize and move quickly with.
- `Playwright` is practical for scraping sites with dynamic rendering.
- `Inngest` or `Trigger.dev` makes scheduled scraping and notification jobs cleaner than ad hoc cron scripts.

## 4. High-Level Architecture

Use a modular monolith first. It is the best balance between speed and maintainability.

### Core modules

- `web`
  - Public UI
  - Map view
  - Calendar view
  - Filters and search
  - Event details pages
  - Event submission form
  - Notification signup form
- `api`
  - Event read APIs
  - Filter/search APIs
  - Submission APIs
  - Admin moderation APIs
  - Notification subscription APIs
- `db`
  - Prisma schema
  - Migrations
  - Seeds
- `jobs`
  - Scraping jobs
  - Deduplication jobs
  - Notification delivery jobs
- `admin`
  - Review queued events
  - Approve/reject submissions
  - Review scraped imports
  - Manage categories, tags, sources, and featured content

### Architecture principles

- Keep business logic out of UI components
- Use typed API contracts and schema validation
- Separate ingestion data from published data
- Make moderation explicit, not implicit
- Track source provenance for every scraped/imported event
- Design for idempotent scraping and deduplication

## 5. Suggested Folder Structure

```txt
/app
  /(public)
    /page.tsx
    /map/page.tsx
    /calendar/page.tsx
    /events/[slug]/page.tsx
    /submit/page.tsx
    /notifications/page.tsx
  /(admin)
    /admin/page.tsx
    /admin/events/page.tsx
    /admin/submissions/page.tsx
    /admin/sources/page.tsx
  /api
    /events/route.ts
    /filters/route.ts
    /submissions/route.ts
    /subscriptions/route.ts
    /admin/events/[id]/approve/route.ts
    /admin/events/[id]/reject/route.ts
/components
  /map
  /calendar
  /filters
  /events
  /forms
  /admin
/lib
  /db
  /auth
  /validation
  /services
    /events
    /submissions
    /notifications
    /moderation
  /scrapers
    /grabo
    /site-x
    /shared
  /utils
/prisma
  schema.prisma
/jobs
  scrape-events.ts
  send-notifications.ts
  dedupe-events.ts
/docs
  product.md
  architecture.md
```

## 6. Core User Features

### Event discovery

- Browse events on an interactive map
- Browse events in a calendar view
- Search by keyword
- Filter by:
  - city
  - date range
  - category
  - price range
  - free/paid
  - indoor/outdoor
  - family-friendly
  - source
  - popularity or featured
- Open event details with:
  - title
  - description
  - images
  - venue
  - exact location
  - time
  - source link
  - tags

### Notification subscriptions

- User fills a form with:
  - email
  - cities of interest
  - categories of interest
  - price preferences
  - frequency preference
- User confirms email via double opt-in
- User receives digest or alert emails when matching events appear

### Event submission

- User submits new event through a form
- Submission includes title, description, venue, date, location, category, image, and external link
- Event is saved as `pending`
- Admin reviews and approves or rejects it
- Only approved events become visible publicly

## 7. Admin Features

- Dashboard with pending items
- Review queue for user-submitted events
- Review queue for scraped events that need moderation
- Approve, reject, edit, or merge duplicate events
- Manage categories and filter vocabularies
- Mark trusted sources
- Feature selected events
- Audit log for moderation decisions

## 8. Data Model

### Main entities

- `Event`
  - id
  - title
  - slug
  - summary
  - description
  - startDateTime
  - endDateTime
  - venueName
  - address
  - city
  - latitude
  - longitude
  - categoryId
  - sourceId
  - sourceUrl
  - imageUrl
  - priceMin
  - priceMax
  - currency
  - status: `draft | pending | approved | rejected | archived`
  - createdAt
  - updatedAt
- `Category`
  - id
  - name
  - slug
- `Tag`
  - id
  - name
- `Source`
  - id
  - name
  - baseUrl
  - trustLevel
  - scrapingEnabled
- `Submission`
  - id
  - eventDraftData
  - submitterEmail
  - status
  - reviewNotes
- `NotificationSubscription`
  - id
  - email
  - cities
  - categories
  - preferences
  - isConfirmed
  - unsubscribeToken
- `AdminUser`
  - id
  - email
  - role
- `AuditLog`
  - id
  - actorId
  - action
  - targetType
  - targetId
  - metadata

## 9. Data Flow

### Scraped events

1. Scheduled job runs scraper
2. Raw event data is collected
3. Data is normalized into common schema
4. Duplicate detection runs
5. Event is inserted or updated as `pending_review` or `approved_from_trusted_source`
6. Admin can review uncertain records

### User submitted events

1. User fills event form
2. Backend validates data with `Zod`
3. Submission is stored as `pending`
4. Admin reviews it
5. If approved, submission becomes a public `Event`

### Notifications

1. User subscribes via form
2. User confirms email
3. Matching job runs on schedule
4. System finds new approved events that match preferences
5. Email digest or alert is sent

## 10. Scraping Strategy

### Sources

Start with:

- `grabo.bg`
- Bulgarian venue and event listing sites
- municipal cultural calendars
- ticketing/event pages with public listings

### Scraper design

- One scraper module per source
- Shared normalizer for common event shape
- Shared deduplication logic
- Store source URL and source fingerprint
- Log scrape results and failures

### Best practices

- Respect robots.txt and site terms where applicable
- Rate limit requests
- Prefer public pages only
- Avoid aggressive crawling
- Cache requests where useful
- Keep scraper selectors isolated so site changes are easier to fix

Important: legal and compliance review should happen before production scraping, especially for commercial third-party sites.

## 11. Filtering and Discovery UX

The filtering system must reduce overload, not add to it.

### UX principles

- Show only the most important filters by default
- Put advanced filters behind a collapsible section
- Sync filters between map and calendar views
- Persist filter state in URL for shareable links
- Cluster markers on the map
- Lazy load results by viewport and date range
- Provide quick presets like:
  - this weekend
  - free events
  - family events
  - Sofia tonight

### Views

- `Map View`
  - marker clustering
  - hover/preview cards
  - drawer or side panel for results
- `Calendar View`
  - month, week, and agenda modes
  - event density indicators
  - filter chips and search

## 12. Design Direction

### Visual goals

- Clear and modern
- Local and trustworthy
- Content-first, not decoration-first
- Optimized for scanning many events quickly

### Design system foundations

- Typography with strong hierarchy for dates, titles, and locations
- Consistent cards for event previews
- Distinct visual treatment for categories
- Map and calendar views should feel like equal first-class views
- Mobile-first responsive layout
- Accessible color contrast and keyboard navigation

### UI building blocks

- Search bar
- Filter sheet/sidebar
- Event card
- Event detail modal/page
- Map marker cluster
- Calendar cell preview
- Subscribe form
- Submit event form
- Admin moderation table

## 13. Security and Quality Guidelines

- Validate all incoming data server-side
- Sanitize user-submitted rich text or restrict formatting
- Use rate limiting on forms and public APIs
- Use CSRF protection where needed
- Require admin authentication and role-based access
- Use double opt-in for notifications
- Track moderation actions in audit logs
- Add basic anti-spam protection to forms

## 14. Performance Guidelines

- Server-side filter parsing and pagination
- Spatial queries for map results
- Index common filters: city, date, category, status
- Use image optimization
- Cache read-heavy APIs
- Background jobs for scraping and email

## 15. MVP Scope

### Include

- Public map view
- Public calendar view
- Core filters
- Event details
- Scraping from `grabo.bg` plus 1 to 2 more sources
- Event submission form
- Admin approval flow
- Email notification signup and digest

### Exclude for MVP

- Native mobile app
- Social features
- Ticket purchase flow
- Full recommendation engine
- Multi-language support beyond Bulgarian-first support

## 16. Delivery Phases

### Phase 1

- Project setup
- Database schema
- Public event listing
- Map view
- Calendar view

### Phase 2

- Scrapers
- Deduplication
- Admin moderation

### Phase 3

- Notification subscriptions
- Email digests
- Analytics and monitoring

### Phase 4

- Ranking improvements
- Featured collections
- Editorial curation

## 17. Suggested First Sprint

1. Initialize `Next.js` app with `TypeScript`, `Tailwind`, `Prisma`, and `PostgreSQL`
2. Define core schema for events, sources, submissions, subscriptions, and admins
3. Build map and calendar pages with mocked data
4. Implement filter state model and URL sync
5. Build admin approval flow
6. Add first scraper for `grabo.bg`
7. Add email signup and confirmation flow

## 18. Final Recommendation

Start as a modular monolith with `Next.js + PostgreSQL + Prisma + Tailwind + Playwright + Resend`.

This stack is fast to build with, easy to refactor, and strong enough to support:

- interactive map discovery
- calendar-based browsing
- structured filtering
- admin moderation
- third-party scraping
- email notifications

It is the best fit for moving fast without turning the codebase into a mess.
