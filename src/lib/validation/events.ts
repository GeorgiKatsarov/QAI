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
  title: z.string().trim().min(3, "Заглавието е задължително"),
  date: z.string().min(1, "Въведете валидна дата").refine((value) => !Number.isNaN(Date.parse(value)), "Въведете валидна дата"),
  city: z.string().trim().min(2, "Градът е задължителен"),
  categorySlug: z.string().trim().min(1, "Категорията е задължителна"),
  email: z.email("Въведете валиден имейл"),
  description: z.string().trim().max(5000).optional().or(z.literal("")),
  honeypot: z.string().max(0).optional(),
});

export type SubmitEventInput = z.infer<typeof submitEventSchema>;

export const notificationSubscriptionSchema = z.object({
  email: z.email("Въведете валиден имейл"),
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

export const subscriptionTokenSchema = z.object({
  token: z.string().trim().min(1, "Токенът е задължителен"),
});

export type SubscriptionTokenInput = z.infer<typeof subscriptionTokenSchema>;
