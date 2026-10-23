import { Button, formatMoney } from "@ecommerce/ui";
import { AlertTriangle, CheckCircle2, LoaderCircle } from "lucide-react";
import * as React from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Order } from "@ecommerce/contracts";
import { verifyPayment } from "../services/orders";

type PaymentState = "checking" | "paid" | "failed" | "error";

export function PaymentReturnPage() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference") ?? searchParams.get("trxref") ?? "";
  const [state, setState] = React.useState<PaymentState>("checking");
  const [order, setOrder] = React.useState<Order | null>(null);
  const [confirmationEmailSent, setConfirmationEmailSent] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let isCurrent = true;
    if (!reference) {
      setError("We could not find a payment reference. Use your order number to check its status.");
      setState("error");
      return () => { isCurrent = false; };
    }

    verifyPayment({ reference })
      .then((result) => {
        if (!isCurrent) return;
        setOrder(result.order);
        setConfirmationEmailSent(result.customerEmailSent ?? false);
        setState(result.status === "paid" ? "paid" : "failed");
      })
      .catch((verificationError: unknown) => {
        if (!isCurrent) return;
        setError(verificationError instanceof Error ? verificationError.message : "We could not verify this payment.");
        setState("error");
      });

    return () => { isCurrent = false; };
  }, [reference]);

  const paid = state === "paid";
  const heading = state === "checking"
    ? "Confirming your payment"
    : paid
      ? "Payment confirmed"
      : state === "failed"
        ? "Payment not completed"
        : "Payment status unavailable";

  return (
    <main className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      {state === "checking" ? (
        <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-moss-600" aria-hidden="true" />
      ) : paid ? (
        <CheckCircle2 className="mx-auto h-10 w-10 text-moss-600" aria-hidden="true" />
      ) : (
        <AlertTriangle className="mx-auto h-10 w-10 text-red-600" aria-hidden="true" />
      )}
      <h1 className="font-display mt-5 text-2xl text-ink-900">{heading}</h1>
      {state === "checking" && <p role="status" className="mt-2 text-sm text-ink-500">We are checking the payment directly with the provider. Please keep this page open.</p>}
      {paid && order && (
        <>
          <p className="mt-2 text-sm text-ink-600">Order {order.orderNumber} is paid. {confirmationEmailSent ? `A confirmation email was sent to ${order.customerEmail}.` : "Email delivery is not configured or could not be confirmed; your order is still paid."}</p>
          <p className="mt-3 text-sm font-medium text-ink-900">Paid {formatMoney(order.total, order.currency)}</p>
          {order.inventoryIssue && <p role="status" className="mt-3 text-sm text-amber-800">Payment is secure, but our team needs to confirm item availability.</p>}
        </>
      )}
      {state === "failed" && order && <p className="mt-2 text-sm text-ink-600">Order {order.orderNumber} is still unpaid. You can return to checkout and retry.</p>}
      {state === "error" && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        {order && (
          <Link to={`/orders?order=${encodeURIComponent(order.orderNumber)}&email=${encodeURIComponent(order.customerEmail)}`}>
            <Button variant="outline" className="w-full sm:w-auto">View order</Button>
          </Link>
        )}
        <Link to="/shop"><Button className="w-full sm:w-auto">Continue shopping</Button></Link>
      </div>
    </main>
  );
}