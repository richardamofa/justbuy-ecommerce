import type { Order } from "@ecommerce/contracts";
import { Button, FormField, Input, formatDate, formatMoney } from "@ecommerce/ui";
import * as React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { initializePayment, lookupOrder } from "../services/orders";

export function OrdersPage() {
  const [searchParams] = useSearchParams();
  const orderNumberFromLink = searchParams.get("order") ?? "";
  const emailFromLink = searchParams.get("email") ?? "";
  const [order, setOrder] = React.useState<Order | null>(null);
  const [orderNumber, setOrderNumber] = React.useState(orderNumberFromLink);
  const [email, setEmail] = React.useState(emailFromLink);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isStartingPayment, setIsStartingPayment] = React.useState(false);

  React.useEffect(() => {
    setOrderNumber(orderNumberFromLink);
    setEmail(emailFromLink);
    if (!orderNumberFromLink || !emailFromLink) return;

    let active = true;
    setIsLoading(true);
    lookupOrder({ orderNumber: orderNumberFromLink, customerEmail: emailFromLink })
      .then((result) => { if (active) setOrder(result); })
      .catch((lookupError: unknown) => { if (active) setError(lookupError instanceof Error ? lookupError.message : "We could not find that order."); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [orderNumberFromLink, emailFromLink]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setOrder(null);
    setIsLoading(true);
    try {
      setOrder(await lookupOrder({ orderNumber, customerEmail: email }));
    } catch (lookupError) {
      setError(lookupError instanceof Error ? lookupError.message : "We could not find that order.");
    } finally {
      setIsLoading(false);
    }
  }

  async function payForOrder() {
    if (!order) return;
    setIsStartingPayment(true);
    setError("");
    try {
      const payment = await initializePayment({ orderId: order.id, customerEmail: order.customerEmail });
      if (!payment.available) {
        setError("Online payment is not configured yet. Your order remains pending.");
        return;
      }
      window.location.assign(payment.authorizationUrl);
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : "We could not start payment. Please try again.");
    } finally {
      setIsStartingPayment(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-2xl text-ink-900">Track an order</h1>
      <p className="mt-2 text-sm text-ink-500">Enter the order number from your confirmation and the email used at checkout.</p>
      <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
        <FormField label="Order number" htmlFor="orderNumber">
          <Input id="orderNumber" value={orderNumber} onChange={(event) => setOrderNumber(event.target.value)} required autoComplete="off" />
        </FormField>
        <FormField label="Email address" htmlFor="email">
          <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
        </FormField>
        <Button type="submit" isLoading={isLoading} className="sm:col-span-2">Find order</Button>
      </form>
      {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
      {order && (
        <section className="mt-8 border-t border-ink-100 pt-6" aria-live="polite">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-ink-900">{order.orderNumber}</h2>
              <p className="mt-1 text-sm text-ink-500">Placed {formatDate(order.createdAt)}</p>
            </div>
            <span className="rounded bg-moss-50 px-3 py-1 text-sm capitalize text-moss-900">{order.status} · payment {order.paymentStatus}</span>
          </div>
          <ul className="mt-5 divide-y divide-ink-100 border-y border-ink-100">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4 py-3 text-sm">
                <span className="text-ink-700">{item.name} × {item.quantity}</span>
                <span className="shrink-0 text-ink-900">{formatMoney(item.total, order.currency)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-right font-medium text-ink-900">Total {formatMoney(order.total, order.currency)}</p>
          <p className="mt-2 text-right text-sm text-ink-500">{order.fulfillmentMethod === "pickup" ? "Pickup" : "Delivery"}: {order.fulfillmentLocation}</p>
          {order.fulfillmentMethod === "delivery" && <p className="mt-1 text-right text-sm text-ink-500">Delivery fee {formatMoney(order.deliveryFee, order.currency)}</p>}
          {order.paymentStatus !== "paid" && <Button className="mt-5 w-full sm:w-auto" isLoading={isStartingPayment} onClick={payForOrder}>Retry secure payment</Button>}
        </section>
      )}
      <Link to="/shop" className="mt-8 inline-block text-sm text-ink-600 underline">Continue shopping</Link>
    </div>
  );
}

