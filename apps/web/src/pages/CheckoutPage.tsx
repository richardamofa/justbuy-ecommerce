import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { checkoutFormSchema, type CheckoutFormValues } from "../schemas/checkout";
import { useCartStore, useCartTotals } from "../store/cart";
import { useStoreSettings } from "../hooks/queries";
import { Button, FormField, Input, Select, formatMoney, useToast } from "@ecommerce/ui";

export function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const { subtotal } = useCartTotals();
  const { data: settings } = useStoreSettings();
  const [placed, setPlaced] = React.useState(false);
  const { warning } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: { shippingMethod: "standard" },
  });

  const shippingMethod = watch("shippingMethod");
  const shipping = shippingMethod === "express" ? (settings?.shippingFlatRate ?? 0) * 2 : settings?.shippingFlatRate ?? 0;
  const total = subtotal + shipping;

  async function onSubmit(_values: CheckoutFormValues) {
    // Mocked: no real payment/order processing yet. This is where Paystack /
    // Stripe-ready payment flows and POST /orders will be wired in later.
    await new Promise((r) => setTimeout(r, 700));
    setPlaced(true);
    clear();
    warning("Order placed in demo mode", "No payment was processed because checkout is not connected to a payment provider yet.");
  }

  if (items.length === 0 && !placed) return <Navigate to="/cart" replace />;

  if (placed) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-moss-500" />
        <h1 className="font-display mt-4 text-2xl text-ink-900">Order placed</h1>
        <p className="mt-2 text-sm text-ink-500">
          This is a mocked confirmation — no payment was processed. Real order handling arrives with the API.
        </p>
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
          <h2 className="mb-4 text-sm font-semibold text-ink-900">Shipping address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Full name" htmlFor="fullName" error={errors.fullName?.message}>
              <Input id="fullName" {...register("fullName")} />
            </FormField>
            <FormField label="Phone" htmlFor="phone" error={errors.phone?.message}>
              <Input id="phone" {...register("phone")} />
            </FormField>
            <FormField label="Address" htmlFor="line1" error={errors.line1?.message} className="sm:col-span-2">
              <Input id="line1" {...register("line1")} />
            </FormField>
            <FormField label="City" htmlFor="city" error={errors.city?.message}>
              <Input id="city" {...register("city")} />
            </FormField>
            <FormField label="Country" htmlFor="country" error={errors.country?.message}>
              <Input id="country" {...register("country")} />
            </FormField>
            <FormField label="Postal code (optional)" htmlFor="postalCode">
              <Input id="postalCode" {...register("postalCode")} />
            </FormField>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold text-ink-900">Shipping method</h2>
          <FormField htmlFor="shippingMethod">
            <Select id="shippingMethod" {...register("shippingMethod")}>
              <option value="standard">Standard — {formatMoney(settings?.shippingFlatRate ?? 0)}</option>
              <option value="express">Express — {formatMoney((settings?.shippingFlatRate ?? 0) * 2)}</option>
            </Select>
          </FormField>
        </div>

        <p className="text-xs text-ink-400">
          Payment is mocked in this phase. Paystack and a Stripe-ready architecture will be wired in once the API exists.
        </p>

        <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
          Place order
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
            <span>Shipping</span>
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
