import { z } from "zod";

export const eventQuerySchema = z.object({
  search: z.string().trim().optional(),
  city: z.string().trim().optional(),
  category: z.string().trim().optional(),
  freeOnly: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),
  source: z.string().trim().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type EventQueryInput = z.input<typeof eventQuerySchema>;
export type EventQuery = z.output<typeof eventQuerySchema>;

export const submitEventSchema = z.object({
  title: z.string().trim().min(3, "Title is required"),
  date: z.string().min(1, "Valid date is required").refine((value) => !Number.isNaN(Date.parse(value)), "Valid date is required"),
  city: z.string().trim().min(2, "City is required"),
  categorySlug: z.string().trim().min(1, "Category is required"),
  email: z.email("Valid email is required"),
  description: z.string().trim().max(5000).optional().or(z.literal("")),
  honeypot: z.string().max(0).optional(),
});

export type SubmitEventInput = z.infer<typeof submitEventSchema>;

export const notificationSubscriptionSchema = z.object({
  email: z.email("Valid email is required"),
  cities: z.array(z.string().trim().min(1)).default([]),
  categoryIds: z.array(z.string().trim().min(1)).default([]),
  priceMax: z
    .union([z.coerce.number().min(0), z.nan()])
    .optional()
    .transform((value) => (typeof value === "number" && !Number.isNaN(value) ? value : undefined)),
  freeOnly: z.boolean().default(false),
  frequency: z.enum(["DAILY", "WEEKLY"]).default("WEEKLY"),
});

export type NotificationSubscriptionInput = z.infer<typeof notificationSubscriptionSchema>;
