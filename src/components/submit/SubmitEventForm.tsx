"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { submitEventSchema, type SubmitEventInput } from "@/lib/validation/events";

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

  async function onSubmit(values: SubmitEventInput) {
    setStatus("idle");
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
    <form className="space-y-5" data-testid="submit-event-form" onSubmit={form.handleSubmit(onSubmit)}>
      <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...form.register("honeypot")} />
      <div className="space-y-1.5">
        <label htmlFor="title" className="text-sm font-medium">Event title <span className="text-destructive">*</span></label>
        <input id="title" type="text" className="w-full rounded-md border border-input px-3 py-2 text-sm" data-testid="submit-title-input" {...form.register("title")} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="date" className="text-sm font-medium">Date <span className="text-destructive">*</span></label>
        <input id="date" type="datetime-local" className="w-full rounded-md border border-input px-3 py-2 text-sm" data-testid="submit-date-input" {...form.register("date")} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="city" className="text-sm font-medium">City <span className="text-destructive">*</span></label>
        <input id="city" type="text" className="w-full rounded-md border border-input px-3 py-2 text-sm" data-testid="submit-city-input" {...form.register("city")} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="categorySlug" className="text-sm font-medium">Category <span className="text-destructive">*</span></label>
        <select id="categorySlug" className="w-full rounded-md border border-input px-3 py-2 text-sm" data-testid="submit-category-input" {...form.register("categorySlug")}>
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
        <label htmlFor="email" className="text-sm font-medium">Your email <span className="text-destructive">*</span></label>
        <input id="email" type="email" className="w-full rounded-md border border-input px-3 py-2 text-sm" data-testid="submit-email-input" {...form.register("email")} />
      </div>

      <button type="submit" className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" data-testid="submit-button">
        Submit for review
      </button>

      {status === "success" && <p className="text-sm text-green-600" data-testid="submit-success">Thanks! Your submission is pending review.</p>}
      {status === "error" && <p className="text-sm text-destructive" data-testid="submit-error">{errorMessage}</p>}
    </form>
  );
}
