import type { Order } from "@ecommerce/contracts";
import { recordAdminEvent } from "./admin-event.service.js";
import {
    adminNewOrderNotification,
    adminOrderNotification,
    customerOrderConfirmation,
    customerOrderReceived,
    customerOrderStatusUpdate,
} from "./email-templates.js";

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

async function sendAndLog(order: Order, emails: Array<{ recipient: string; subject: string; html: string; label: string }>) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    await recordAdminEvent({
      severity: "warning",
      source: "email",
      title: "Email provider is not configured",
      message: `Could not send ${emails.map((email) => email.label).join(" and ")} for order ${order.orderNumber}.`,
      entityType: "order",
      entityId: order.id,
    }).catch((error: unknown) => console.error("Could not record email configuration warning.", error));
    return emails.map(() => false);
  }

  const results = await Promise.allSettled(emails.map((email) => sendEmail(email.recipient, email.subject, email.html)));
  for (const [index, result] of results.entries()) {
    if (result.status === "rejected" || (result.status === "fulfilled" && !result.value)) {
      const email = emails[index]!;
      console.error(`${email.label} email delivery failed.`, result.status === "rejected" ? result.reason : undefined);
      await recordAdminEvent({
        severity: "error",
        source: "email",
        title: `${email.label} email failed`,
        message: `Resend could not deliver ${email.label.toLowerCase()} for order ${order.orderNumber}.`,
        entityType: "order",
        entityId: order.id,
      }).catch((eventError: unknown) => console.error("Could not record email delivery failure.", eventError));
    }
  }
  return results.map((result) => result.status === "fulfilled" && result.value);
}

export async function sendOrderCreatedEmails(order: Order) {
  const customer = customerOrderReceived(order);
  const emails = [{ recipient: order.customerEmail, ...customer, label: "Customer order received" }];
  const admin = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (admin) emails.push({ recipient: admin, ...adminNewOrderNotification(order), label: "Admin new order" });
  const sent = await sendAndLog(order, emails);
  return { customerSent: sent[0] ?? false, adminSent: sent[1] ?? false };
}

export async function sendPaidOrderEmails(order: Order) {
  const customerEmail = customerOrderConfirmation(order);
  const emails = [{ recipient: order.customerEmail, ...customerEmail, label: "Customer payment confirmation" }];

  const adminEmailAddress = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (adminEmailAddress) {
    const adminEmail = adminOrderNotification(order);
    emails.push({ recipient: adminEmailAddress, ...adminEmail, label: "Admin payment notification" });
  }

  const results = await sendAndLog(order, emails);
  return {
    customerSent: results[0] ?? false,
    adminSent: results[1] ?? false,
  };
}

export async function sendOrderStatusEmail(order: Order) {
  const email = customerOrderStatusUpdate(order);
  const sent = await sendAndLog(order, [{
    recipient: order.customerEmail,
    ...email,
    label: "Customer fulfillment update",
  }]);
  return sent[0] ?? false;
}