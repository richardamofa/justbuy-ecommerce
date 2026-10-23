import type { Order } from "@ecommerce/contracts";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]!);
}

function itemRows(order: Order) {
  return order.items.map((item) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #e7e5e2">${escapeHtml(item.name)} × ${item.quantity}</td>
      <td style="padding:12px 0;border-bottom:1px solid #e7e5e2;text-align:right">${order.currency} ${item.total.toFixed(2)}</td>
    </tr>`).join("");
}

export function customerOrderConfirmation(order: Order) {
  return {
    subject: `Payment confirmed for ${order.orderNumber}`,
    html: `<div style="font-family:Arial,sans-serif;color:#171717;max-width:600px;margin:auto;padding:32px">
      <p style="color:#1f3a36;font-weight:bold;letter-spacing:2px">JUSTBUY</p>
      <h1 style="font-size:24px">Your payment is confirmed</h1>
      <p>We have received your payment for order <strong>${escapeHtml(order.orderNumber)}</strong>.</p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0">${itemRows(order)}</table>
      <p style="text-align:right;font-weight:bold">Total paid: ${order.currency} ${order.total.toFixed(2)}</p>
      <p style="font-size:13px;color:#6b6b6b">Keep your order number for tracking. We will email you again when your order ships.</p>
    </div>`,
  };
}

export function adminOrderNotification(order: Order) {
  return {
    subject: `Paid order ${order.orderNumber}`,
    html: `<div style="font-family:Arial,sans-serif;color:#171717;max-width:600px;margin:auto;padding:32px">
      <p style="color:#1f3a36;font-weight:bold;letter-spacing:2px">JUSTBUY ORDER ALERT</p>
      <h1 style="font-size:24px">Payment received</h1>
      <p>Order <strong>${escapeHtml(order.orderNumber)}</strong> is paid by ${escapeHtml(order.customerEmail)}.</p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0">${itemRows(order)}</table>
      <p style="text-align:right;font-weight:bold">Total: ${order.currency} ${order.total.toFixed(2)}</p>
      ${order.inventoryIssue ? "<p style=\"color:#b91c1c;font-weight:bold\">Inventory needs attention: one or more items could not be deducted from stock.</p>" : ""}
      <p style="font-size:13px;color:#6b6b6b">Shipping address: ${escapeHtml(order.shippingAddress?.fullName ?? "")}, ${escapeHtml(order.shippingAddress?.line1 ?? "")}, ${escapeHtml(order.shippingAddress?.city ?? "")}</p>
    </div>`,
  };
}