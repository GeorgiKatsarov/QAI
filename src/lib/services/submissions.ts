import { SubmissionStatus } from "@/generated/prisma";
import { prisma } from "@/lib/db/client";
import { submitEventSchema, type SubmitEventInput } from "@/lib/validation/events";

export async function createSubmission(input: SubmitEventInput) {
  const parsed = submitEventSchema.parse(input);

  if (!prisma) {
    return { id: `mock-${Date.now()}` };
  }

  return prisma.submission.create({
    data: {
      submitterEmail: parsed.email,
      eventDraftData: {
        title: parsed.title,
        city: parsed.city,
        categorySlug: parsed.categorySlug,
        startDateTime: parsed.date,
        description: parsed.description || null,
      },
      status: SubmissionStatus.PENDING,
    },
    select: { id: true },
  });
}

export async function listPendingSubmissions() {
  if (!prisma) {
    return [];
  }

  return prisma.submission.findMany({
    where: { status: SubmissionStatus.PENDING },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function approveSubmission(submissionId: string) {
  if (!prisma) {
    return;
  }

  await prisma.submission.update({
    where: { id: submissionId },
    data: { status: SubmissionStatus.APPROVED },
  });
}

export async function rejectSubmission(submissionId: string) {
  if (!prisma) {
    return;
  }

  await prisma.submission.update({
    where: { id: submissionId },
    data: { status: SubmissionStatus.REJECTED },
  });
}
