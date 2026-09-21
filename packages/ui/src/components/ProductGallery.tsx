import type { Image } from "@ecommerce/contracts";
import * as React from "react";
import { cn } from "../cn";

export function ProductGallery({ images, className }: { images: Image[]; className?: string }) {
  const [active, setActive] = React.useState(0);
  const current = images[active] ?? images[0];

  if (!images.length) {
    return <div className={cn("aspect-square rounded bg-ink-50", className)} />;
  }

  return (
    <div className={cn("flex flex-col-reverse gap-3 sm:flex-row", className)}>
      {images.length > 1 && (
        <div className="flex gap-2 sm:flex-col sm:w-16">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "aspect-square w-16 shrink-0 overflow-hidden rounded border transition-colors",
                i === active ? "border-moss-500" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="flex-1 overflow-hidden rounded bg-ink-50">
        {current && (
          <img src={current.url} alt={current.alt} className="h-full w-full object-cover" />
        )}
      </div>
    </div>
  );
}
