import { NotificationFrequency } from "@/generated/prisma";
import { prisma } from "@/lib/db/client";
import {
  notificationSubscriptionSchema,
  subscriptionTokenSchema,
  type NotificationSubscriptionInput,
} from "@/lib/validation/events";

export async function createNotificationSubscription(input: NotificationSubscriptionInput) {
  const parsed = notificationSubscriptionSchema.parse(input);

  if (!prisma) {
    return {
      id: `mock-subscription-${Date.now()}`,
      confirmationToken: "mock-token",
      unsubscribeToken: "mock-unsubscribe-token",
    };
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
      unsubscribeToken: true,
    },
  });
}

export async function confirmNotificationSubscription(token: string) {
  const parsedToken = subscriptionTokenSchema.parse({ token });

  if (!prisma) {
    return parsedToken.token === "mock-token";
  }

  const result = await prisma.notificationSubscription.updateMany({
    where: {
      confirmationToken: parsedToken.token,
      isConfirmed: false,
    },
    data: {
      isConfirmed: true,
    },
  });

  return result.count > 0;
}

export async function unsubscribeNotificationSubscription(token: string) {
  const parsedToken = subscriptionTokenSchema.parse({ token });

  if (!prisma) {
    return parsedToken.token === "mock-unsubscribe-token";
  }

  const result = await prisma.notificationSubscription.deleteMany({
    where: {
      unsubscribeToken: parsedToken.token,
    },
  });

  return result.count > 0;
}
