import { Button, EmptyState, formatMoney, useToast } from "@ecommerce/ui";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore, useCartTotals } from "../store/cart";

export function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const { success } = useToast();
  const { subtotal } = useCartTotals();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          icon={<ShoppingBag className="h-5 w-5" />}
          title="Your bag is empty"
          description="Browse the shop to find something you'll love."
          action={
            <Link to="/shop">
              <Button>Shop all</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl text-ink-900">Your bag</h1>

      <ul className="mt-6 divide-y divide-ink-100 border-y border-ink-100">
        {items.map((item) => (
          <li key={item.id} className="flex gap-4 py-5">
            <div className="h-28 w-24 shrink-0 overflow-hidden rounded-sm bg-ink-50">
              {item.image && <img src={item.image.url} alt={item.image.alt} className="h-full w-full object-cover" />}
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="text-sm text-ink-900">{item.name}</p>
                {Object.keys(item.options).length > 0 && (
                  <p className="text-xs text-ink-400">
                    {Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 rounded border border-ink-200 px-2 py-1">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-4 text-center text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <span className="text-sm text-ink-900">{formatMoney(item.unitPrice * item.quantity)}</span>
              </div>
            </div>
            <button onClick={() => { removeItem(item.id); success("Removed from bag", `${item.name} was removed from your bag.`); }} aria-label={`Delete ${item.name}`} title="Delete item" className="self-start rounded p-1 text-ink-300 transition-colors hover:bg-signal-50 hover:text-signal-DEFAULT">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-end">
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-ink-500">Subtotal</span>
            <span className="text-ink-900">{formatMoney(subtotal)}</span>
          </div>
          <p className="text-xs text-ink-400">Shipping and tax calculated at checkout.</p>
          <Link to="/checkout">
            <Button size="lg" className="mt-2 w-full">Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
