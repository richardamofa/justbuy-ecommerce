import { Button, FormField, Input, Select, formatMoney } from "@ecommerce/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { useStoreSettings } from "../hooks/queries";
import { checkoutFormSchema, type CheckoutFormValues } from "../schemas/checkout";
import { createOrder, initializePayment } from "../services/orders";
import { useCartStore, useCartTotals } from "../store/cart";

export function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const { subtotal } = useCartTotals();
  const { data: settings } = useStoreSettings();
  const [order, setOrder] = React.useState<Awaited<ReturnType<typeof createOrder>> | null>(null);
  const [paymentUnavailable, setPaymentUnavailable] = React.useState(false);
  const [isStartingPayment, setIsStartingPayment] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: { fulfillmentMethod: "delivery" },
  });

  const fulfillmentMethod = watch("fulfillmentMethod");
  const shipping = fulfillmentMethod === "delivery" ? settings?.deliveryFee ?? 0 : 0;
  const total = subtotal + shipping;

  async function startPayment(orderId: string, email: string) {
    setIsStartingPayment(true);
    setSubmitError("");
    try {
      const payment = await initializePayment({ orderId, customerEmail: email });
      if (!payment.available) {
        setPaymentUnavailable(true);
        return;
      }
      window.location.assign(payment.authorizationUrl);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Payment could not be started. Your order is still pending.");
    } finally {
      setIsStartingPayment(false);
    }
  }

  async function onSubmit(values: CheckoutFormValues) {
    setSubmitError("");
    try {
      const order = await createOrder({
        customerEmail: values.email,
        customerName: values.fullName,
        customerPhone: values.phone,
        fulfillmentMethod: values.fulfillmentMethod,
        fulfillmentLocation: values.fulfillmentMethod === "pickup"
          ? values.fulfillmentLocation!
          : [values.line1, values.city, values.country].filter(Boolean).join(", "),
        ...(values.fulfillmentMethod === "delivery" ? {
          shippingAddress: {
            fullName: values.fullName,
            phone: values.phone,
            line1: values.line1!,
            city: values.city!,
            country: values.country!,
            isDefault: false,
            ...(values.postalCode ? { postalCode: values.postalCode } : {}),
          },
        } : {}),
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId ?? null,
          quantity: item.quantity,
        })),
      });
      setOrder(order);
      clear();
      await startPayment(order.id, values.email);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "We could not place your order. Please try again.");
    }
  }

  if (items.length === 0 && !order) return <Navigate to="/cart" replace />;

  if (order) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        {paymentUnavailable ? <AlertCircle className="mx-auto h-10 w-10 text-amber-600" /> : <CheckCircle2 className="mx-auto h-10 w-10 text-moss-500" />}
        <h1 className="font-display mt-4 text-2xl text-ink-900">Order {paymentUnavailable ? "created" : "awaiting payment"}</h1>
        <p className="mt-2 text-sm text-ink-500">Order {order.orderNumber} is saved. It will not be marked paid until the payment provider confirms it.</p>
        {paymentUnavailable && <p role="status" className="mt-3 text-sm text-amber-800">Online payment is not configured yet. Your order remains pending.</p>}
        {!paymentUnavailable && <Button className="mt-5 w-full" isLoading={isStartingPayment} onClick={() => startPayment(order.id, order.customerEmail)}>Continue to secure payment</Button>}
        {submitError && <p role="alert" className="mt-3 text-sm text-red-600">{submitError}</p>}
        <Link to="/orders" className="mt-4 inline-block text-sm text-ink-700 underline">Track this order</Link>
        <Link to="/shop">
          <Button className="mt-6">Continue shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1fr_360px]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="mb-4 text-sm font-semibold text-ink-900">Contact</h2>
          <FormField label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" {...register("email")} />
          </FormField>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold text-ink-900">Fulfillment</h2>
          <FormField label="Choose delivery or pickup" htmlFor="fulfillmentMethod">
            <Select id="fulfillmentMethod" {...register("fulfillmentMethod")}>
              <option value="delivery">Delivery — {formatMoney(settings?.deliveryFee ?? 0)}</option>
              <option value="pickup">Pickup — Free</option>
            </Select>
          </FormField>
          {fulfillmentMethod === "delivery" ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <FormField label="Street address" htmlFor="line1" error={errors.line1?.message} className="sm:col-span-2">
                <Input id="line1" autoComplete="street-address" {...register("line1")} />
              </FormField>
              <FormField label="City" htmlFor="city" error={errors.city?.message}>
                <Input id="city" autoComplete="address-level2" {...register("city")} />
              </FormField>
              <FormField label="Country" htmlFor="country" error={errors.country?.message}>
                <Input id="country" autoComplete="country-name" {...register("country")} />
              </FormField>
              <FormField label="Postal code (optional)" htmlFor="postalCode">
                <Input id="postalCode" {...register("postalCode")} />
              </FormField>
            </div>
          ) : (
            <FormField label="Pickup location" htmlFor="fulfillmentLocation" error={errors.fulfillmentLocation?.message} className="mt-4">
              <Select id="fulfillmentLocation" disabled={!settings?.pickupLocations.length} {...register("fulfillmentLocation")}>
                <option value="">{settings?.pickupLocations.length ? "Select a pickup point" : "No pickup locations configured"}</option>
                {settings?.pickupLocations.map((location) => <option key={location} value={location}>{location}</option>)}
              </Select>
            </FormField>
          )}
        </div>

        <p className="text-xs text-ink-400">
          Your order is created first. Payment is confirmed only after secure provider verification.
        </p>

        {submitError && <p role="alert" className="text-sm text-red-600">{submitError}</p>}
        <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
          Create order
        </Button>
      </form>

      <aside className="h-fit rounded-md border border-ink-100 p-5">
        <h2 className="mb-4 text-sm font-semibold text-ink-900">Order summary</h2>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between text-sm">
              <span className="text-ink-600">
                {item.name} × {item.quantity}
              </span>
              <span className="text-ink-900">{formatMoney(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1.5 border-t border-ink-100 pt-4 text-sm">
          <div className="flex justify-between text-ink-500">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink-500">
            <span>{fulfillmentMethod === "pickup" ? "Pickup" : "Delivery fee"}</span>
            <span>{formatMoney(shipping)}</span>
          </div>
          <div className="flex justify-between pt-1 text-base font-medium text-ink-900">
            <span>Total</span>
            <span>{formatMoney(total)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
