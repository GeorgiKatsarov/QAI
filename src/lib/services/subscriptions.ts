import { NotificationFrequency } from "@/generated/prisma";
import { prisma } from "@/lib/db/client";
import {
  notificationSubscriptionSchema,
  type NotificationSubscriptionInput,
} from "@/lib/validation/events";

export async function createNotificationSubscription(input: NotificationSubscriptionInput) {
  const parsed = notificationSubscriptionSchema.parse(input);

  if (!prisma) {
    return { id: `mock-subscription-${Date.now()}`, confirmationToken: "mock-token" };
  }

  return prisma.notificationSubscription.create({
    data: {
      email: parsed.email,
      cities: parsed.cities,
      categoryIds: parsed.categoryIds,
      priceMax: parsed.priceMax,
      freeOnly: parsed.freeOnly,
      frequency:
        parsed.frequency === "DAILY"
          ? NotificationFrequency.DAILY
          : NotificationFrequency.WEEKLY,
      isConfirmed: false,
    },
    select: {
      id: true,
      confirmationToken: true,
    },
  });
}
