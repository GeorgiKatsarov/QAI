"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  notificationSubscriptionSchema,
  type NotificationSubscriptionInput,
} from "@/lib/validation/events";

export function NotificationSubscriptionForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmationToken, setConfirmationToken] = useState("");
  const [unsubscribeToken, setUnsubscribeToken] = useState("");

  const form = useForm<NotificationSubscriptionInput>({
    resolver: zodResolver(notificationSubscriptionSchema),
    defaultValues: {
      email: "",
      cities: [],
      categoryIds: [],
      priceMax: undefined,
      freeOnly: false,
      frequency: "WEEKLY",
    },
  });

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
    <form
      className="space-y-5"
      data-testid="subscription-form"
      aria-label="Notification subscription form"
      onSubmit={form.handleSubmit(onSubmit)}
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
          {...form.register("email")}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="sub-city" className="text-sm font-medium">
          City
        </label>
        <select
          id="sub-city"
          multiple
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          data-testid="subscription-city-select"
          {...form.register("cities")}
        >
          <option value="Sofia">Sofia</option>
          <option value="Plovdiv">Plovdiv</option>
          <option value="Varna">Varna</option>
          <option value="Burgas">Burgas</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="sub-category" className="text-sm font-medium">
          Category
        </label>
        <select
          id="sub-category"
          multiple
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          data-testid="subscription-category-select"
          {...form.register("categoryIds")}
        >
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
          {...form.register("frequency")}
        >
          <option value="DAILY">Daily digest</option>
          <option value="WEEKLY">Weekly digest</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
        data-testid="subscription-submit-button"
      >
        Subscribe
      </button>

      {status === "success" ? (
        <div data-testid="subscription-success" className="space-y-2 text-sm text-green-700">
          <p>Subscription saved. Please confirm from your email.</p>
          {confirmationToken ? (
            <p>
              Demo confirmation link:{" "}
              <Link
                href={`/notifications/confirm?token=${confirmationToken}`}
                data-testid="subscription-confirm-link"
                className="underline"
              >
                Confirm subscription
              </Link>
            </p>
          ) : null}
          {unsubscribeToken ? (
            <p>
              Demo unsubscribe link:{" "}
              <Link
                href={`/notifications/unsubscribe?token=${unsubscribeToken}`}
                data-testid="subscription-unsubscribe-link"
                className="underline"
              >
                Unsubscribe
              </Link>
            </p>
          ) : null}
        </div>
      ) : null}
      {status === "error" ? (
        <p data-testid="subscription-error" className="text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
