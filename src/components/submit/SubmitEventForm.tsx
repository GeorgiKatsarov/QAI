"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock, CheckCircle2, CircleAlert, Mail, MapPinned, Sparkles, Tag } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";
import { submitEventSchema, type SubmitEventInput } from "@/lib/validation/events";

const CITY_SUGGESTIONS = ["Sofia", "Plovdiv", "Varna", "Burgas", "Ruse", "Stara Zagora"] as const;

const CATEGORY_OPTIONS = [
  { value: "music", label: "Music" },
  { value: "art", label: "Art & Exhibitions" },
  { value: "food", label: "Food & Drink" },
  { value: "sports", label: "Sports" },
  { value: "family", label: "Family" },
  { value: "other", label: "Other" },
] as const;

export function SubmitEventForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<SubmitEventInput>({
    resolver: zodResolver(submitEventSchema),
    defaultValues: {
      title: "",
      date: "",
      city: "",
      categorySlug: "",
      email: "",
      description: "",
      honeypot: "",
    },
  });

  const categorySlug = useWatch({ control: form.control, name: "categorySlug" }) ?? "";
  const city = useWatch({ control: form.control, name: "city" }) ?? "";
  const date = useWatch({ control: form.control, name: "date" }) ?? "";

  async function onSubmit(values: SubmitEventInput) {
    setStatus("idle");
    setErrorMessage("");

    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });

    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      setStatus("error");
      setErrorMessage(payload.error ?? "Failed to submit event");
      return;
    }

    form.reset();
    setStatus("success");
  }

  return (
    <div className="rounded-[2rem] border border-border/70 bg-white/85 p-5 shadow-[0_24px_80px_rgba(74,154,222,0.14)] backdrop-blur-sm sm:p-8">
      <form
        className="space-y-8"
        data-testid="submit-event-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...form.register("honeypot")} />

        <div className="grid gap-4 rounded-[1.5rem] border border-primary/15 bg-gradient-to-br from-white via-[#F8FCFF] to-[#EAF5FF] p-5 sm:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              <Sparkles className="size-3.5" />
              Community submissions
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              Share an event with enough detail for a fast review
            </h2>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              Send the core information once and the team can turn it into a publishable listing.
              The clearer the submission, the faster it can be reviewed and approved.
            </p>
          </div>

          <div className="rounded-[1.25rem] border border-border/70 bg-white/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              What helps most
            </p>
            <div className="mt-3 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <CalendarClock className="mt-0.5 size-4 text-primary" />
                <p>Use the real start date and time whenever you have it.</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPinned className="mt-0.5 size-4 text-primary" />
                <p>Add the city clearly so the event lands in the right local feed.</p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 text-primary" />
                <p>Use an email you can access in case the team needs clarification.</p>
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-sm font-semibold">
                Event title <span className="text-destructive">*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="Example: Sofia Rooftop Jazz Night"
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm"
                data-testid="submit-title-input"
                {...form.register("title")}
              />
              {form.formState.errors.title ? (
                <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Keep it specific enough to identify the event quickly.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="date" className="text-sm font-semibold">
                Date and time <span className="text-destructive">*</span>
              </label>
              <input
                id="date"
                type="datetime-local"
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm"
                data-testid="submit-date-input"
                {...form.register("date")}
              />
              {form.formState.errors.date ? (
                <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Use local event time, not when you plan to announce it.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="city" className="text-sm font-semibold">
                City <span className="text-destructive">*</span>
              </label>
              <input
                id="city"
                type="text"
                list="submit-city-suggestions"
                placeholder="Start typing a city"
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm"
                data-testid="submit-city-input"
                {...form.register("city")}
              />
              <datalist id="submit-city-suggestions">
                {CITY_SUGGESTIONS.map((suggestion) => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
              <div className="flex flex-wrap gap-2 pt-1">
                {CITY_SUGGESTIONS.slice(0, 4).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() =>
                      form.setValue("city", suggestion, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                      city === suggestion
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              {form.formState.errors.city ? (
                <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="categorySlug" className="text-sm font-semibold">
                Category <span className="text-destructive">*</span>
              </label>
              <div className="rounded-[1.5rem] border border-border/70 bg-[#F8FCFF] p-4">
                <select
                  id="categorySlug"
                  className="w-full rounded-2xl border border-input bg-white px-4 py-3 text-sm"
                  data-testid="submit-category-input"
                  {...form.register("categorySlug")}
                >
                  <option value="">Select a category</option>
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {CATEGORY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        form.setValue("categorySlug", option.value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      className={cn(
                        "flex items-center gap-2 rounded-2xl border px-3 py-3 text-left text-sm font-semibold transition-all",
                        categorySlug === option.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-white text-foreground hover:border-primary/40"
                      )}
                    >
                      <Tag className="size-4" />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              {form.formState.errors.categorySlug ? (
                <p className="text-sm text-destructive">{form.formState.errors.categorySlug.message}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-semibold">
                Contact email <span className="text-destructive">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="organizer@example.com"
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm"
                data-testid="submit-email-input"
                {...form.register("email")}
              />
              {form.formState.errors.email ? (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  We may use this if something about the event needs clarification.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-1.5">
          <label htmlFor="description" className="text-sm font-semibold">
            Description
          </label>
          <textarea
            id="description"
            rows={6}
            placeholder="Add the essentials: venue details, lineup, audience, highlights, or anything else that helps the review team understand the event."
            className="w-full rounded-[1.5rem] border border-input bg-background px-4 py-3 text-sm leading-7"
            {...form.register("description")}
          />
          {form.formState.errors.description ? (
            <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Optional, but useful. A few good sentences are better than leaving reviewers to guess.
            </p>
          )}
        </section>

        <section className="rounded-[1.5rem] border border-border/70 bg-gradient-to-r from-[#F9FCFF] to-[#FFF8FC] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Submission preview
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-white/80 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Category</p>
              <p className="mt-1 font-semibold text-foreground">
                {CATEGORY_OPTIONS.find((option) => option.value === categorySlug)?.label ?? "Not selected"}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-white/80 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">City</p>
              <p className="mt-1 font-semibold text-foreground">{city || "Not added yet"}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-white/80 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Date</p>
              <p className="mt-1 font-semibold text-foreground">
                {date ? new Date(date).toLocaleString() : "Not scheduled yet"}
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-6 text-muted-foreground">
            Every event is reviewed before publication, so the clearer the submission, the easier the approval.
          </p>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90"
            data-testid="submit-button"
          >
            <Sparkles className="size-4" />
            {form.formState.isSubmitting ? "Submitting..." : "Submit for review"}
          </button>
        </div>

        {status === "success" ? (
          <div
            className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5"
            data-testid="submit-success"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5 text-emerald-700" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">
                  Thanks. Your event submission is now pending review.
                </p>
                <p className="mt-1 text-sm leading-6 text-emerald-700/90">
                  The team will review the details and publish it once everything looks good.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="rounded-[1.5rem] border border-destructive/20 bg-destructive/5 p-4" data-testid="submit-error">
            <div className="flex items-start gap-3">
              <CircleAlert className="mt-0.5 size-5 text-destructive" />
              <div>
                <p className="text-sm font-semibold text-destructive">We could not submit the event.</p>
                <p className="mt-1 text-sm text-destructive">{errorMessage}</p>
              </div>
            </div>
          </div>
        ) : null}
      </form>
    </div>
  );
}
