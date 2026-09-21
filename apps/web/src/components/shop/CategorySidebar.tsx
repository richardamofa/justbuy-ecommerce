import type { Category } from "@ecommerce/contracts";
import { cn } from "@ecommerce/ui";
import { Link } from "react-router-dom";

export function CategorySidebar({ categories, activeSlug }: { categories: Category[]; activeSlug?: string }) {
  const topLevel = categories.filter((c) => c.parentId === null);
  return (
    <nav
      aria-label="Categories"
      className="sticky top-20 max-h-[calc(100vh-6rem)] self-start overflow-y-auto pr-2 space-y-1"
    >
      <Link
        to="/shop"
        className={cn("block rounded px-2 py-1.5 text-sm", !activeSlug ? "bg-ink-100 text-ink-900" : "text-ink-500 hover:text-ink-900")}
      >
        All products
      </Link>
      {topLevel.map((category) => (
        <Link
          key={category.id}
          to={`/category/${category.slug}`}
          className={cn(
            "block rounded px-2 py-1.5 text-sm",
            activeSlug === category.slug ? "bg-ink-100 text-ink-900" : "text-ink-500 hover:text-ink-900"
          )}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}
