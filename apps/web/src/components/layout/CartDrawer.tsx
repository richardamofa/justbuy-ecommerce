import { Button, EmptyState, formatMoney } from "@ecommerce/ui";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import * as React from "react";
import { Link } from "react-router-dom";
import { useCartStore, useCartTotals } from "../../store/cart";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const { subtotal } = useCartTotals();

  React.useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [isOpen]);

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            className="absolute inset-0 bg-ink-900/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            onClick={close}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-ink-100 bg-paper-50 will-change-transform"
          >
            <div className="flex items-center justify-between border-b border-ink-100 px-5 py-5">
              <div>
                <h2 className="font-display text-lg font-semibold text-ink-900">Your bag <span className="font-sans text-sm font-normal text-ink-400">({items.length})</span></h2>
              </div>
              <button onClick={close} aria-label="Close cart" className="rounded-full border border-ink-200 p-2 text-ink-500 transition-colors hover:border-ink-900 hover:text-ink-900">
                <X className="h-4 w-4" />
              </button>
            </div>

            {items.length === 0 ? (
              <EmptyState
                icon={<ShoppingBag className="h-5 w-5" />}
                title="Your bag is empty"
                description="Items you add will show up here."
                action={
                  <Button variant="outline" size="sm" onClick={close}>
                    Continue shopping
                  </Button>
                }
                className="flex-1"
              />
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto divide-y divide-ink-100 px-5">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3 py-4">
                      <div className="h-20 w-16 shrink-0 overflow-hidden rounded-sm bg-ink-50">
                        {item.image && (
                          <img src={item.image.url} alt={item.image.alt} className="h-full w-full object-cover" />
                        )}
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
                          <div className="flex items-center gap-2 rounded border border-ink-200">
                            <button
                              className="p-1.5 text-ink-500 hover:text-ink-900"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xs text-ink-900">{item.quantity}</span>
                            <button
                              className="p-1.5 text-ink-500 hover:text-ink-900"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm text-ink-900">{formatMoney(item.unitPrice * item.quantity)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label={`Delete ${item.name}`}
                        title="Delete item"
                        className="self-start rounded p-1 text-ink-300 transition-colors hover:bg-signal-50 hover:text-signal-DEFAULT"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-ink-100 bg-paper-50 px-5 py-5">
                  <p className="mb-4 text-xs text-moss-700">Complimentary delivery on orders over GHS 1,000.</p>
                  <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="text-ink-500">Subtotal</span>
                    <span className="font-medium text-ink-900">{formatMoney(subtotal)}</span>
                  </div>
                  <Link to="/checkout" onClick={close}>
                    <Button className="w-full" size="lg">
                      Checkout
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
