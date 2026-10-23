import type { NewsletterSubscribeInput } from "@ecommerce/contracts";
import { HttpError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";

export async function subscribe(input: NewsletterSubscribeInput) {
  const email = input.email.toLowerCase();
  const subscriber = await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: { email },
    update: {},
  });

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    return { status: "pending" as const };
  }

  const response = await fetch(`https://api.resend.com/audiences/${encodeURIComponent(audienceId)}/contacts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, unsubscribed: false }),
  });

  if (!response.ok && response.status !== 409) {
    throw new HttpError(502, "internal_error", "We could not complete your subscription. Please try again.");
  }

  await prisma.newsletterSubscriber.update({
    where: { id: subscriber.id },
    data: { status: "subscribed" },
  });

  return { status: "subscribed" as const };
}