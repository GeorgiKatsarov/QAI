"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { BellRing, Check, Mail, MapPinned, Sparkles, Tag } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  notificationSubscriptionSchema,
  type NotificationSubscriptionInput,
} from "@/lib/validation/events";

const CITY_OPTIONS = ["Sofia", "Plovdiv", "Varna", "Burgas"] as const;

const CATEGORY_OPTIONS = [
  { value: "music", label: "Music" },
  { value: "art", label: "Art & Exhibitions" },
  { value: "food", label: "Food & Drink" },
  { value: "sports", label: "Sports" },
  { value: "family", label: "Family" },
] as const;

const FREQUENCY_OPTIONS = [
  {
    value: "DAILY" as const,
    label: "Daily",
    description: "Best if you want fresh event picks every day.",
  },
  {
    value: "WEEKLY" as const,
    label: "Weekly",
    description: "A lower-noise roundup of the most relevant events.",
  },
] as const;

function toggleValue(values: string[], nextValue: string) {
  return values.includes(nextValue)
    ? values.filter((value) => value !== nextValue)
    : [...values, nextValue];
}

function SelectionChip({
  label,
  selected,
  onClick,
  icon,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2 rounded-2xl border px-4 py-3 text-left text-sm transition-all",
        selected
          ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
          : "border-border bg-white/80 text-foreground hover:border-primary/50 hover:bg-white"
      )}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      <span className="font-semibold">{label}</span>
      <span
        className={cn(
          "ml-auto flex size-5 items-center justify-center rounded-full border text-[11px]",
          selected
            ? "border-white/40 bg-white/15 text-white"
            : "border-border bg-background text-muted-foreground group-hover:border-primary/40"
        )}
      >
        {selected ? <Check className="size-3" /> : null}
      </span>
    </button>
  );
}

export function NotificationSubscriptionForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmationToken, setConfirmationToken] = useState("");
  const [unsubscribeToken, setUnsubscribeToken] = useState("");

  const form = useForm<NotificationSubscriptionInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(notificationSubscriptionSchema) as any,
    defaultValues: {
      email: "",
      cities: [],
      categoryIds: [],
      priceMax: undefined,
      freeOnly: false,
      frequency: "WEEKLY",
    },
  });

  const selectedCities = useWatch({ control: form.control, name: "cities" }) ?? [];
  const selectedCategories = useWatch({ control: form.control, name: "categoryIds" }) ?? [];
  const freeOnly = useWatch({ control: form.control, name: "freeOnly" }) ?? false;
  const frequency = useWatch({ control: form.control, name: "frequency" }) ?? "WEEKLY";
  const priceMax = useWatch({ control: form.control, name: "priceMax" });

  async function onSubmit(values: NotificationSubscriptionInput) {
    setStatus("idle");
    setErrorMessage("");
    setConfirmationToken("");
    setUnsubscribeToken("");

    const response = await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });

    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      setStatus("error");
      setErrorMessage(payload.error ?? "Failed to create subscription");
      return;
    }

    setStatus("success");
    setConfirmationToken(payload.confirmationToken ?? "");
    setUnsubscribeToken(payload.unsubscribeToken ?? "");
  }

  return (
    <div className="rounded-[2rem] border border-border/70 bg-white/85 p-5 shadow-[0_24px_80px_rgba(74,154,222,0.14)] backdrop-blur-sm sm:p-8">
      <form
        className="space-y-8"
        data-testid="subscription-form"
        aria-label="Notification subscription form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid gap-4 rounded-[1.5rem] border border-primary/15 bg-gradient-to-br from-white via-[#F8FCFF] to-[#EAF5FF] p-5 sm:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              <BellRing className="size-3.5" />
              Personalized event digests
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              Set up the events you actually want to hear about
            </h2>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              Pick cities, categories, cadence, and budget once. We will filter the noise and send
              a tighter shortlist that matches your preferences.
            </p>
          </div>

          <div className="rounded-[1.25rem] border border-border/70 bg-white/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              At a glance
            </p>
            <div className="mt-3 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 text-primary" />
                <p>Confirmation stays double opt-in so subscriptions are explicit.</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPinned className="mt-0.5 size-4 text-primary" />
                <p>City picks are optional. Leave them empty to get a broader digest.</p>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 size-4 text-primary" />
                <p>You can unsubscribe at any time from every email you receive.</p>
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="sub-email" className="text-sm font-semibold">
              Email address <span className="text-destructive">*</span>
            </label>
            <input
              id="sub-email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground"
              data-testid="subscription-email-input"
              {...form.register("email")}
            />
            <p className="text-xs text-muted-foreground">
              We only use this to send the digest and confirmation links.
            </p>
            {form.formState.errors.email ? (
              <p className="text-sm text-destructive" data-testid="subscription-error">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold">Cities</p>
              <p className="text-xs text-muted-foreground">
                Choose one or more cities, or leave this blank for all locations.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {CITY_OPTIONS.map((city) => (
                <SelectionChip
                  key={city}
                  label={city}
                  selected={selectedCities.includes(city)}
                  onClick={() =>
                    form.setValue("cities", toggleValue(selectedCities, city), {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  icon={<MapPinned className="size-4" />}
                />
              ))}
            </div>
            <select
              multiple
              value={selectedCities}
              onChange={(event) =>
                form.setValue(
                  "cities",
                  Array.from(event.currentTarget.selectedOptions, (option) => option.value),
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  }
                )
              }
              className="sr-only"
              data-testid="subscription-city-select"
              aria-hidden="true"
              tabIndex={-1}
            >
              {CITY_OPTIONS.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold">Categories</p>
              <p className="text-xs text-muted-foreground">
                Select the kinds of events that should make it into your digest.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {CATEGORY_OPTIONS.map((category) => (
                <SelectionChip
                  key={category.value}
                  label={category.label}
                  selected={selectedCategories.includes(category.value)}
                  onClick={() =>
                    form.setValue("categoryIds", toggleValue(selectedCategories, category.value), {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  icon={<Tag className="size-4" />}
                />
              ))}
            </div>
            <select
              multiple
              value={selectedCategories}
              onChange={(event) =>
                form.setValue(
                  "categoryIds",
                  Array.from(event.currentTarget.selectedOptions, (option) => option.value),
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  }
                )
              }
              className="sr-only"
              data-testid="subscription-category-select"
              aria-hidden="true"
              tabIndex={-1}
            >
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold">Delivery frequency</p>
              <p className="text-xs text-muted-foreground">
                Pick how often you want us to bundle matching events.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {FREQUENCY_OPTIONS.map((option) => {
                const active = frequency === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      form.setValue("frequency", option.value, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    className={cn(
                      "rounded-[1.25rem] border p-4 text-left transition-all",
                      active
                        ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "border-border bg-white/80 hover:border-primary/40"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{option.label}</p>
                      <span
                        className={cn(
                          "flex size-6 items-center justify-center rounded-full border",
                          active
                            ? "border-white/40 bg-white/15"
                            : "border-border bg-background text-muted-foreground"
                        )}
                      >
                        {active ? <Check className="size-3.5" /> : null}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "mt-2 text-sm leading-6",
                        active ? "text-primary-foreground/85" : "text-muted-foreground"
                      )}
                    >
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
            <select
              value={frequency}
              onChange={(event) =>
                form.setValue("frequency", event.currentTarget.value as "DAILY" | "WEEKLY", {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              className="sr-only"
              data-testid="subscription-frequency-select"
              aria-hidden="true"
              tabIndex={-1}
            >
              <option value="DAILY">Daily digest</option>
              <option value="WEEKLY">Weekly digest</option>
            </select>
          </div>

          <div className="rounded-[1.5rem] border border-border/70 bg-[#F8FCFF] p-5">
            <div>
              <p className="text-sm font-semibold">Extra filters</p>
              <p className="text-xs text-muted-foreground">
                These help trim the digest down further.
              </p>
            </div>

            <div className="mt-4 space-y-4">
              <label className="flex items-start gap-3 rounded-2xl border border-border bg-white px-4 py-3">
                <input
                  type="checkbox"
                  className="mt-1 size-4 accent-[var(--primary)]"
                  {...form.register("freeOnly")}
                />
                <span>
                  <span className="block text-sm font-semibold text-foreground">
                    Show only free events
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    Useful for low-friction weekend ideas and public festivals.
                  </span>
                </span>
              </label>

              <div className="space-y-1.5">
                <label htmlFor="sub-price-max" className="text-sm font-semibold">
                  Maximum ticket price
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="sub-price-max"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Any budget"
                    className="w-full rounded-2xl border border-input bg-white px-4 py-3 text-sm"
                    {...form.register("priceMax", { valueAsNumber: true })}
                  />
                  <span className="text-sm font-semibold text-muted-foreground">BGN</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Leave blank if price should not affect the digest.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-border/70 bg-gradient-to-r from-[#F9FCFF] to-[#FFF8FC] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Current summary
          </p>
          <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border/70 bg-white/80 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Cities</p>
              <p className="mt-1 font-semibold text-foreground">
                {selectedCities.length ? selectedCities.join(", ") : "All cities"}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-white/80 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Categories</p>
              <p className="mt-1 font-semibold text-foreground">
                {selectedCategories.length
                  ? CATEGORY_OPTIONS.filter((option) => selectedCategories.includes(option.value))
                      .map((option) => option.label)
                      .join(", ")
                  : "All categories"}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-white/80 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Cadence</p>
              <p className="mt-1 font-semibold text-foreground">
                {frequency === "DAILY" ? "Daily digest" : "Weekly digest"}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-white/80 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Budget</p>
              <p className="mt-1 font-semibold text-foreground">
                {freeOnly
                  ? "Free only"
                  : typeof priceMax === "number" && !Number.isNaN(priceMax)
                    ? `Up to ${priceMax} BGN`
                    : "Any budget"}
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-6 text-muted-foreground">
            By subscribing, you are asking for curated event emails for the filters above.
          </p>
          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            data-testid="subscription-submit-button"
          >
            <BellRing className="size-4" />
            {form.formState.isSubmitting ? "Saving preferences..." : "Start my digest"}
          </button>
        </div>

        {status === "success" ? (
          <div
            data-testid="subscription-success"
            className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800"
          >
            <p className="font-semibold">Subscription saved. Confirm it from your inbox to activate delivery.</p>
            <p className="mt-1 text-emerald-700/90">
              For this demo, the confirmation and unsubscribe links are exposed below.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {confirmationToken ? (
                <Link
                  href={`/notifications/confirm?token=${confirmationToken}`}
                  data-testid="subscription-confirm-link"
                  className="rounded-2xl border border-emerald-300 bg-white px-4 py-3 font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
                >
                  Confirm subscription
                </Link>
              ) : null}
              {unsubscribeToken ? (
                <Link
                  href={`/notifications/unsubscribe?token=${unsubscribeToken}`}
                  data-testid="subscription-unsubscribe-link"
                  className="rounded-2xl border border-emerald-300 bg-white px-4 py-3 font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
                >
                  Manage or unsubscribe
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}

        {status === "error" ? (
          <div
            className="rounded-[1.5rem] border border-destructive/20 bg-destructive/5 p-4"
            data-testid="subscription-error"
          >
            <p className="text-sm font-semibold text-destructive">We could not save your subscription.</p>
            <p className="mt-1 text-sm text-destructive">{errorMessage}</p>
          </div>
        ) : null}
      </form>
    </div>
  );
}
