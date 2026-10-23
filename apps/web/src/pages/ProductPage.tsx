import { getEffectivePrice, isLowStock, isOnSale, isOutOfStock } from "@ecommerce/contracts";
import {
    Badge,
    Button, ErrorState, formatMoney, ProductCard,
    ProductGallery, Skeleton, useToast
} from "@ecommerce/ui";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { useProduct } from "../hooks/queries";
import * as productsApi from "../services/products";
import { useCartStore } from "../store/cart";

export function ProductPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProduct(slug);
  const addItem = useCartStore((s) => s.addItem);
  const { warning } = useToast();

  const [selectedOptions, setSelectedOptions] = React.useState<Record<string, string>>({});
  const [quantity, setQuantity] = React.useState(1);

  React.useEffect(() => {
    if (product) {
      const defaultVariant = product.variants.find((v) => v.isDefault) ?? product.variants[0];
      setSelectedOptions(defaultVariant?.options ?? {});
      setQuantity(1);
    }
  }, [product]);

  const { data: related = [] } = useQuery({
    queryKey: ["related", product?.id],
    queryFn: () => productsApi.listRelatedProducts(product!),
    enabled: !!product,
  });

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-2">
        <Skeleton className="aspect-square w-full" />
        <div className="space-y-3">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return <ErrorState title="Product not found" className="mx-auto max-w-7xl px-4 py-24" />;
  }

  const selectedVariant = product.variants.length
    ? product.variants.find((variant) => product.options.every((option) => variant.options[option.name] === selectedOptions[option.name]))
    : undefined;
  const price = selectedVariant?.salePrice ?? selectedVariant?.price ?? getEffectivePrice(product);
  const onSale = selectedVariant?.salePrice != null
    ? selectedVariant.salePrice < (selectedVariant.price ?? product.price)
    : isOnSale(product);
  const outOfStock = product.variants.length ? (selectedVariant?.stock ?? 0) <= 0 : isOutOfStock(product);
  const lowStock = !outOfStock && (selectedVariant ? selectedVariant.stock <= 5 : isLowStock(product));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav className="mb-6 text-xs text-ink-400">
        <Link to="/shop" className="hover:text-ink-900">Shop</Link> / <span className="text-ink-600">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery images={selectedVariant?.image ? [selectedVariant.image, ...product.images] : product.images} />

        <div>
          <h1 className="font-display text-2xl text-ink-900 sm:text-3xl">{product.name}</h1>

          {product.rating != null && (
            <div className="mt-2 flex items-center gap-1.5 text-sm text-ink-500">
              <Star className="h-3.5 w-3.5 fill-current text-ink-900" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-ink-300">({product.reviewCount} reviews)</span>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2">
            <span className={onSale ? "text-lg text-signal-DEFAULT" : "text-lg text-ink-900"}>
              {formatMoney(price, product.currency)}
            </span>
            {onSale && (
              <span className="text-ink-300 line-through">{formatMoney(selectedVariant?.price ?? product.price, product.currency)}</span>
            )}
            {onSale && <Badge tone="signal">Sale</Badge>}
          </div>

          {product.shortDescription && <p className="mt-4 text-sm text-ink-600">{product.shortDescription}</p>}

          {product.options.map((option) => (
            <div key={option.name} className="mt-6">
              <p className="mb-2 text-sm font-medium text-ink-800">{option.name}</p>
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const active = selectedOptions[option.name] === value;
                  const available = !product.variants.length || product.variants.some((variant) =>
                    product.options.every((otherOption) => otherOption.name === option.name
                      ? variant.options[otherOption.name] === value
                      : !selectedOptions[otherOption.name] || variant.options[otherOption.name] === selectedOptions[otherOption.name])
                  );
                  return (
                    <button
                      key={value}
                      disabled={!available}
                      onClick={() => setSelectedOptions((prev) => ({ ...prev, [option.name]: value }))}
                      className={
                        "rounded border px-3 py-1.5 text-sm transition-colors " +
                        (active ? "border-ink-900 bg-ink-900 text-paper-50" : available ? "border-ink-200 text-ink-700 hover:border-ink-900" : "cursor-not-allowed border-ink-100 text-ink-300 line-through")
                      }
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center gap-3 rounded border border-ink-200 px-3 py-2">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="text-ink-500">
                −
              </button>
              <span className="w-4 text-center text-sm">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity" className="text-ink-500">
                +
              </button>
            </div>
            <Button
              size="lg"
              className="flex-1"
              disabled={outOfStock}
              onClick={() => {
                if (product.variants.length && !selectedVariant) {
                  warning("Choose an available variant", "Select one value for each product option.");
                  return;
                }
                addItem(product, selectedVariant, quantity);
              }}
            >
              {outOfStock ? "Sold out" : "Add to bag"}
            </Button>
          </div>

          {lowStock && <p className="mt-2 text-xs text-signal-DEFAULT">Only a few left</p>}

          <div className="mt-8 border-t border-ink-100 pt-6 text-sm text-ink-600">
            <p>{product.description}</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display mb-6 text-xl text-ink-900">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} href={`/product/${p.slug}`} LinkComponent={Link} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
