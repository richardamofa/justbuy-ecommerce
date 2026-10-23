import type { Order } from "@ecommerce/contracts";
import { adminOrderNotification, customerOrderConfirmation } from "./email-templates.js";

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });

  if (!response.ok) {
    console.error(`Resend email delivery failed with status ${response.status}.`);
    return false;
  }

  return true;
}

export async function sendPaidOrderEmails(order: Order) {
  const customerEmail = customerOrderConfirmation(order);
  const deliveries: Promise<boolean>[] = [
    sendEmail(order.customerEmail, customerEmail.subject, customerEmail.html),
  ];

  const adminEmailAddress = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (adminEmailAddress) {
    const adminEmail = adminOrderNotification(order);
    deliveries.push(sendEmail(adminEmailAddress, adminEmail.subject, adminEmail.html));
  }

  const results = await Promise.allSettled(deliveries);
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Order notification email could not be sent.", result.reason);
    }
  }

  return {
    customerSent: results[0]?.status === "fulfilled" && results[0].value,
    adminSent: results[1]?.status === "fulfilled" && results[1].value,
  };
}