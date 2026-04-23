# Agent Implementation Guide

## 1. Purpose

This document converts the product blueprint into an implementation guide that an agent can execute in manageable chunks.

The goal is to make each chunk small enough to complete in a single prompt while preserving good architecture, testability, and delivery momentum.

## 2. Global Build Rules

The agent must follow these rules across the whole project:

- Use `Next.js` with `TypeScript`
- Keep the codebase as a modular monolith
- Use `PostgreSQL` + `Prisma`
- Use `Tailwind CSS` for styling
- Use `shadcn/ui` where useful
- Keep business logic out of page components
- Use `Zod` for request and form validation
- Use `React Hook Form` for forms
- Use `Playwright` for end-to-end testing
- Add `data-testid` attributes to all important interactive and testable UI elements
- Write Playwright tests for every feature that can reasonably be tested end to end
- Prefer simple, composable modules over clever abstractions

## 3. Mandatory Testing Rules

These are not optional.

### `data-testid` rules

Add stable `data-testid` attributes to:

- page roots
- map container
- calendar container
- search input
- filter controls
- filter chips
- event cards
- event details drawer or page
- submit event form fields
- notification subscription form fields
- admin tables
- approve and reject buttons
- pagination controls
- empty states
- loading states
- error states

### Playwright rules

For every functionality that can be tested with Playwright, add coverage.

This includes:

- navigation
- filter application
- search
- switching between map and calendar views
- viewing event details
- submitting forms
- validation errors
- admin moderation flow
- subscription flow UI
- empty states
- error states
- access control redirects

### Test design rules

- Prefer `data-testid` selectors over brittle CSS selectors
- Keep tests deterministic
- Seed predictable test data
- Avoid relying on third-party live sites in end-to-end tests
- Mock scraper outputs where needed
- Cover happy path and critical failure path

## 4. Definition of Done For Every Chunk

A chunk is only done when:

- the feature works
- the code follows the agreed structure
- types are clean
- validation exists
- `data-testid` attributes are added
- Playwright tests are added if the feature is testable through the browser
- basic loading, empty, and error states are handled where relevant

## 5. Execution Strategy

Build in this order:

1. foundation
2. core data model
3. public event discovery
4. event details
5. submission flow
6. admin moderation
7. notification subscriptions
8. scraping pipeline
9. quality hardening

Do not start with scraping. First make the product usable with mocked and seeded data.

## 6. Prompt-Sized Work Chunks

Each chunk below should be manageable in a single prompt.

---

## Chunk 1: Project Scaffold

### Goal

Create the initial app foundation.

### Tasks

- Initialize `Next.js` with `TypeScript`
- Add `Tailwind CSS`
- Add `Prisma`
- Add `Playwright`
- Add base linting and formatting
- Create base app layout
- Create placeholder public pages:
  - home
  - map
  - calendar
  - submit
  - notifications
- Create placeholder admin pages

### Deliverables

- runnable app
- basic folder structure
- base layout and navigation
- Playwright installed and configured
- page-level `data-testid` attributes

### Playwright coverage

- app loads
- navigation between main pages works
- admin route unauthenticated behavior is defined

### Suggested prompt

"Scaffold the app with Next.js, TypeScript, Tailwind, Prisma, and Playwright. Create the base routes and layout for public and admin sections. Add stable data-testid attributes to page roots and navigation. Add basic Playwright smoke tests for page load and navigation."

---

## Chunk 2: Database Schema

### Goal

Define the first real data model.

### Tasks

- Create Prisma schema for:
  - Event
  - Category
  - Tag
  - Source
  - Submission
  - NotificationSubscription
  - AdminUser
  - AuditLog
- Add status enums
- Add indexes for date, city, category, and status
- Add seed script with representative Bulgarian events

### Deliverables

- Prisma schema
- initial migration
- seed data
- typed database client setup

### Playwright coverage

- none required yet beyond smoke tests unless seeded pages already consume real DB data

### Suggested prompt

"Implement the Prisma schema, migrations, and seed data for events, submissions, subscriptions, sources, categories, tags, admin users, and audit logs. Add indexes for event discovery use cases and keep the schema ready for filtering and moderation."

---

## Chunk 3: Shared Domain and Validation Layer

### Goal

Set up clean backend foundations before building feature pages.

### Tasks

- Add shared `Zod` schemas
- Add event query parameter parsing
- Add DTO or mapper helpers for event cards and event details
- Add service modules for:
  - event queries
  - submissions
  - subscriptions
  - moderation

### Deliverables

- reusable service layer
- reusable validation layer
- typed request parsing

### Playwright coverage

- none directly unless UI work is included in the same chunk

### Suggested prompt

"Create the shared service and validation layer for event queries, submissions, subscriptions, and moderation. Use Zod for inputs and keep page components thin."

---

## Chunk 4: Public Event Listing API

### Goal

Expose the event data needed by map and calendar pages.

### Tasks

- Add route for public event listing
- Add filtering support for:
  - city
  - date range
  - category
  - free/paid
  - price range
  - source
- Add pagination or limit strategy
- Return only approved events

### Deliverables

- typed read API
- validated filters
- API ready for UI integration

### Playwright coverage

- optional if consumed through UI in the same chunk

### Suggested prompt

"Build the public events API with validated filters, pagination or bounded results, and approved-event-only visibility. Keep the filter contract ready for both map and calendar views."

---

## Chunk 5: Map View MVP

### Goal

Build the first real discovery surface.

### Tasks

- Add interactive map page
- Render seeded events as markers
- Add result list beside map or in a drawer
- Add marker click to open event preview
- Add base filters and search input
- Add loading, empty, and error states

### Required `data-testid`

- `map-page`
- `map-container`
- `map-search-input`
- `map-filter-city`
- `map-filter-category`
- `map-results-list`
- `event-card-{id}`
- `event-marker-{id}` where practical

### Playwright coverage

- map page loads
- results render
- search filters visible results
- filters reduce result set
- clicking a result opens details or preview

### Suggested prompt

"Implement the map view using the public events API and seeded data. Add an interactive map, event markers, a result list, filter controls, stable data-testid attributes, and Playwright tests for search, filtering, and event preview behavior."

---

## Chunk 6: Calendar View MVP

### Goal

Build the second discovery surface with the same filter model.

### Tasks

- Add calendar page using the same event API
- Support month and agenda-style browsing
- Reuse filter state model
- Sync filter state with URL
- Add event click behavior

### Required `data-testid`

- `calendar-page`
- `calendar-container`
- `calendar-search-input`
- `calendar-filter-city`
- `calendar-filter-category`
- `calendar-event-{id}`

### Playwright coverage

- calendar page loads
- events render in calendar
- filters work
- URL reflects filter state
- clicking an event opens detail view

### Suggested prompt

"Implement the calendar view using the same event query model as the map view. Reuse filters, sync them to the URL, add data-testid attributes, and write Playwright tests for rendering, filtering, and event detail access."

---

## Chunk 7: Shared Filter System

### Goal

Make filtering consistent and not overwhelming.

### Tasks

- Extract shared filter components
- Add default filters and advanced filters
- Add quick presets:
  - this weekend
  - free events
  - family friendly
  - Sofia tonight
- Add filter chips
- Keep state shareable via URL

### Deliverables

- unified filter model across views
- reusable filter UI

### Playwright coverage

- quick presets work
- advanced filters open and apply
- filter chips reflect active filters
- clearing filters resets the view

### Suggested prompt

"Refactor map and calendar filtering into a shared filter system with URL state, quick presets, advanced filters, and filter chips. Add data-testid attributes for all filter controls and Playwright coverage for preset and reset behavior."

---

## Chunk 8: Event Details Page

### Goal

Make event exploration useful and complete.

### Tasks

- Add event details route
- Show title, date, venue, city, description, source, and pricing
- Add map link or location block
- Handle missing optional fields gracefully

### Required `data-testid`

- `event-details-page`
- `event-title`
- `event-date`
- `event-venue`
- `event-source-link`

### Playwright coverage

- event detail route opens from map
- event detail route opens from calendar
- source link is visible
- missing optional fields do not break layout

### Suggested prompt

"Implement the event details page and wire it from both map and calendar views. Add stable testids and Playwright coverage for navigation and field rendering."

---

## Chunk 9: Submit Event Form

### Goal

Allow public users to propose events for moderation.

### Tasks

- Build submit event form
- Add server-side validation
- Save submissions as pending
- Show success and validation error states
- Add anti-spam basics such as honeypot or rate limiting placeholder

### Required `data-testid`

- `submit-event-page`
- `submit-event-form`
- `submit-title-input`
- `submit-date-input`
- `submit-city-input`
- `submit-category-input`
- `submit-email-input`
- `submit-button`
- `submit-success`
- `submit-error`

### Playwright coverage

- valid submission succeeds
- invalid submission shows errors
- required fields are enforced
- success state appears

### Suggested prompt

"Build the public submit-event form with React Hook Form and Zod validation, persist submissions as pending, add stable data-testid attributes, and write Playwright tests for valid and invalid submissions."

---

## Chunk 10: Admin Authentication Shell

### Goal

Protect moderation routes before adding full admin actions.

### Tasks

- Add admin auth solution
- Restrict admin routes
- Add admin layout and navigation
- Add unauthorized handling

### Deliverables

- protected admin area
- role-aware route access

### Playwright coverage

- unauthenticated user cannot access admin pages
- authenticated admin can access admin pages

### Suggested prompt

"Implement admin authentication and route protection for the admin section. Add clear unauthorized behavior, stable page testids, and Playwright coverage for access control."

---

## Chunk 11: Admin Moderation Queue

### Goal

Review and approve user-submitted events.

### Tasks

- Build submissions table
- Show pending submissions
- Add approve and reject actions
- Add optional edit-before-approve flow
- Write audit log entries

### Required `data-testid`

- `admin-submissions-page`
- `submissions-table`
- `submission-row-{id}`
- `approve-button-{id}`
- `reject-button-{id}`

### Playwright coverage

- pending submissions render
- approve action works
- reject action works
- approved submission becomes public event if that flow is implemented

### Suggested prompt

"Implement the admin moderation queue for pending submissions with approve and reject actions, audit logging, data-testid coverage, and Playwright tests for the moderation flow."

---

## Chunk 12: Public Visibility Rules

### Goal

Make moderation status actually matter in the public app.

### Tasks

- Ensure only approved events are visible publicly
- Ensure pending and rejected submissions are hidden
- Ensure admin can still inspect moderation states

### Playwright coverage

- pending event not visible in public pages
- approved event visible in map and calendar
- rejected event not visible

### Suggested prompt

"Enforce public visibility rules so only approved events are shown in the public app. Add Playwright coverage for approved versus pending versus rejected visibility."

---

## Chunk 13: Notification Subscription Form

### Goal

Collect user interest preferences for event notifications.

### Tasks

- Build notification signup form
- Collect:
  - email
  - cities
  - categories
  - price preferences
  - notification frequency
- Save subscription in unconfirmed state
- Add confirmation token support

### Required `data-testid`

- `notifications-page`
- `subscription-form`
- `subscription-email-input`
- `subscription-city-select`
- `subscription-category-select`
- `subscription-frequency-select`
- `subscription-submit-button`

### Playwright coverage

- valid signup succeeds
- invalid signup shows errors
- selected preferences persist correctly in UI

### Suggested prompt

"Build the notification subscription form with validated inputs, unconfirmed subscription persistence, stable data-testid attributes, and Playwright coverage for success and validation behavior."

---

## Chunk 14: Notification Confirmation Flow

### Goal

Complete the email subscription lifecycle.

### Tasks

- Add email confirmation route
- Mark subscriptions confirmed
- Add unsubscribe token support
- Add success and invalid-token states

### Playwright coverage

- confirmation route handles valid token
- confirmation route handles invalid token
- unsubscribe flow works if implemented in the same chunk

### Suggested prompt

"Implement the notification confirmation flow with token handling, confirmed subscription updates, user feedback states, and Playwright tests for valid and invalid confirmation cases."

---

## Chunk 15: Notification Job Pipeline

### Goal

Prepare the backend for digest delivery.

### Tasks

- Add job to match approved events to confirmed subscriptions
- Add delivery logging
- Add email template placeholder
- Keep delivery logic idempotent

### Playwright coverage

- usually none, unless an admin UI for previewing deliveries is included

### Suggested prompt

"Implement the notification matching and delivery pipeline with idempotent job logic, delivery tracking, and clean service boundaries. Keep UI scope out unless needed."

---

## Chunk 16: Source Model and Scraper Framework

### Goal

Prepare the system for safe source ingestion.

### Tasks

- Create scraper interface
- Add shared normalized event shape
- Add source registry
- Add ingest logging model if needed

### Deliverables

- source adapter pattern
- reusable normalize-and-save pipeline

### Playwright coverage

- none required

### Suggested prompt

"Create the scraper framework with a source adapter interface, normalized event shape, source registry, and ingestion pipeline hooks so individual scrapers can plug in cleanly."

---

## Chunk 17: `grabo.bg` Scraper

### Goal

Add the first real ingestion source.

### Tasks

- Implement scraper for `grabo.bg`
- Normalize scraped data
- Store source URL and fingerprint
- Insert as pending review or trusted-source flow depending on design
- Add logging and failure handling

### Playwright coverage

- none for live scraping
- if an admin ingest UI exists, test that UI instead of the live source

### Suggested prompt

"Implement the first scraper for grabo.bg using the shared scraper framework. Normalize event fields, store provenance, handle failures cleanly, and keep the scraper isolated from UI concerns."

---

## Chunk 18: Additional Bulgarian Sources

### Goal

Expand event coverage without changing core architecture.

### Tasks

- Add 1 to 2 more Bulgarian event sources
- Reuse the same scraper contract
- Verify normalization compatibility

### Playwright coverage

- none required for the scrapers themselves

### Suggested prompt

"Add one or two additional Bulgarian event source scrapers using the shared framework and keep normalization behavior consistent with the grabo.bg integration."

---

## Chunk 19: Deduplication Pipeline

### Goal

Prevent the same event from flooding the platform.

### Tasks

- Add duplicate detection rules
- Compare by title, date, venue, city, and source URL where possible
- Add merge strategy or flag-for-review strategy

### Playwright coverage

- only if duplicate review is surfaced in admin UI

### Suggested prompt

"Implement event deduplication in the ingestion pipeline using practical matching heuristics and a safe review-friendly strategy for uncertain duplicates."

---

## Chunk 20: Admin Scraped Event Review

### Goal

Allow admins to review uncertain scraped records.

### Tasks

- Build admin page for scraped pending events
- Show source metadata
- Add approve, reject, and merge actions

### Required `data-testid`

- `admin-scraped-events-page`
- `scraped-events-table`
- `scraped-row-{id}`
- `scraped-approve-button-{id}`
- `scraped-reject-button-{id}`

### Playwright coverage

- pending scraped items render
- approve and reject actions work

### Suggested prompt

"Implement the admin review page for scraped events with source metadata, moderation actions, stable testids, and Playwright tests for the main moderation flows."

---

## Chunk 21: UX Hardening

### Goal

Make the discovery experience polished enough for real use.

### Tasks

- Improve loading states
- Improve empty states
- Improve responsive behavior
- Add marker clustering
- Improve filter usability on mobile

### Playwright coverage

- empty states visible when no results match
- mobile viewport behavior for filters works

### Suggested prompt

"Polish the discovery UX with better loading, empty, and responsive states, plus map clustering and mobile-friendly filters. Add or update Playwright coverage for no-results and mobile behavior."

---

## Chunk 22: Quality Pass

### Goal

Raise confidence before launch.

### Tasks

- Review missing `data-testid` attributes
- Review missing Playwright scenarios
- Review validation coverage
- Review access control
- Review basic rate limiting and anti-spam coverage
- Review error handling

### Deliverables

- test and stability pass
- gap fixes

### Playwright coverage

- add anything still missing for browser-testable features

### Suggested prompt

"Do a quality pass across the project. Find missing data-testid attributes, missing Playwright coverage, weak validation, and obvious UX or access-control gaps, then fix them."

---

## 7. Agent Prompting Rules

When giving work to an implementation agent:

- give exactly one chunk at a time
- include the chunk goal
- include the acceptance criteria
- tell the agent to add `data-testid` attributes
- tell the agent to add Playwright tests for browser-testable behavior
- tell the agent not to broaden scope beyond the chunk

## 8. Standard Prompt Template

Use this template when assigning any chunk:

```md
Implement Chunk X: [chunk name].

Goal:
[short goal]

Requirements:
- follow the existing architecture
- keep page components thin
- use Zod for validation where needed
- add stable data-testid attributes for all important UI and states
- add Playwright tests for every behavior in this chunk that can be tested through the browser
- handle loading, empty, and error states where relevant

Acceptance criteria:
- [criterion 1]
- [criterion 2]
- [criterion 3]

Do not expand scope beyond this chunk.
```

## 9. Final Guidance

If implementation starts to become unstable, slow, or too broad:

- split the chunk again
- finish architecture before polish
- finish public read flows before ingestion complexity
- keep scraping isolated from user-facing code
- do not skip testids
- do not skip Playwright tests for browser-testable features

The fastest path is not random speed. It is controlled, chunked progress with stable testing hooks.
