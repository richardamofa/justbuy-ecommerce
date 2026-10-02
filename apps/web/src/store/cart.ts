import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, ProductVariant } from "@ecommerce/contracts";
import { getEffectivePrice } from "@ecommerce/contracts";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
}

function lineId(productId: string, variantId?: string) {
  return variantId ? `${productId}::${variantId}` : productId;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      addItem: (product, variant, quantity = 1) => {
        const id = lineId(product.id, variant?.id);
        const existing = get().items.find((i) => i.id === id);
        const unitPrice = variant
          ? variant.salePrice != null && (variant.price == null || variant.salePrice < variant.price)
            ? variant.salePrice
            : variant.price ?? getEffectivePrice(product)
          : getEffectivePrice(product);

        if (existing) {
          set({
            items: get().items.map((i) => (i.id === id ? { ...i, quantity: i.quantity + quantity } : i)),
            isOpen: true,
          });
          return;
        }

        const newItem: CartItem = {
          id,
          productId: product.id,
          variantId: variant?.id,
          name: product.name,
          slug: product.slug,
          image: variant?.image ?? product.images[0],
          options: variant?.options ?? {},
          unitPrice,
          quantity,
          stock: variant?.stock ?? product.stock,
        };
        set({ items: [...get().items, newItem], isOpen: true });
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantity) =>
        set({
          items: get()
            .items.map((i) => (i.id === id ? { ...i, quantity } : i))
            .filter((i) => i.quantity > 0),
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "form-cart" }
  )
);

export function useCartTotals() {
  const items = useCartStore((s) => s.items);
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  return { subtotal, count };
}
