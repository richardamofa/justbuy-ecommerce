import { ArrowRight, Package, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

export function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex items-center gap-3">
        <UserRound className="h-5 w-5 text-moss-700" />
        <h1 className="font-display text-2xl text-ink-900">Your account</h1>
      </div>
      <p className="mt-3 max-w-xl text-sm leading-6 text-ink-600">
        Orders are linked to the email used at checkout. Use your order number and email to view the latest status and items.
      </p>
      <Link to="/orders" className="mt-7 flex items-center justify-between border-y border-ink-100 py-5 text-ink-900 hover:text-moss-700">
        <span className="flex items-center gap-3"><Package className="h-4 w-4" />Track an order</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

