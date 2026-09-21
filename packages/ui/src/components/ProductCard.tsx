import { getEffectivePrice, isOnSale, isOutOfStock, type Product } from "@ecommerce/contracts";
import * as React from "react";
import { cn } from "../cn";
import { formatMoney } from "../format";
import { Badge } from "./Badge";

export interface ProductCardProps {
  product: Product;
  href?: string;
  onQuickAdd?: (product: Product) => void;
  LinkComponent?: React.ElementType;
  className?: string;
}

export function ProductCard({ product, href, LinkComponent, className }: ProductCardProps) {
  const Wrapper: React.ElementType = LinkComponent ?? "a";
  const image = product.images[0];
  const hoverImage = product.images[1];
  const price = getEffectivePrice(product);
  const onSale = isOnSale(product);
  const outOfStock = isOutOfStock(product);

  return (
    <Wrapper
      href={href}
      to={href}
      className={cn("group block", className)}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded bg-ink-50">
        {image ? (
          <>
            <img
              src={image.url}
              alt={image.alt || product.name}
              loading="lazy"
              className={cn(
                "h-full w-full object-cover transition-[transform,opacity] duration-300 ease-out group-hover:scale-[1.02]",
                hoverImage && "group-hover:opacity-0"
              )}
            />
            {hoverImage && (
              <img
                src={hoverImage.url}
                alt={`${product.name} worn`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-[transform,opacity] duration-300 ease-out group-hover:scale-[1.02] group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-ink-300">No image</div>
        )}

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isNewArrival && <Badge tone="new">New</Badge>}
          {onSale && <Badge tone="sale">Sale</Badge>}
          {outOfStock && <Badge tone="stock">Sold out</Badge>}
        </div>
      </div>

      <div className="mt-3 space-y-0.5">
        <p className="text-sm font-medium text-ink-900">{product.name}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className={cn(onSale ? "text-signal-DEFAULT" : "text-ink-500")}>
            {formatMoney(price, product.currency)}
          </span>
          {onSale && (
            <span className="text-ink-300 line-through">{formatMoney(product.price, product.currency)}</span>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
