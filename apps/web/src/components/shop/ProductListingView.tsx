import * as React from "react";
import { Link } from "react-router-dom";
import type { ProductListQuery } from "@ecommerce/contracts";
import { useCategories, useProducts } from "../../hooks/queries";
import { ShopToolbar } from "./ShopToolbar";
import { CategorySidebar } from "./CategorySidebar";
import { ProductCard, ProductCardSkeleton, EmptyState, ErrorState, Button } from "@ecommerce/ui";
import { PackageSearch } from "lucide-react";

export function ProductListingView({
  title,
  description,
  baseQuery,
  activeCategorySlug,
}: {
  title: string;
  description?: string;
  baseQuery: Partial<ProductListQuery>;
  activeCategorySlug?: string;
}) {
  const [sort, setSort] = React.useState<ProductListQuery["sort"]>("newest");
  const { data: categories = [] } = useCategories();
  const { data, isLoading, isError, refetch } = useProducts({ ...baseQuery, sort });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink-900">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-sm text-ink-500">{description}</p>}
      </div>

      <div className="grid gap-8 md:grid-cols-[200px_1fr]">
        <div className="hidden md:block">
          <CategorySidebar categories={categories} activeSlug={activeCategorySlug} />
        </div>

        <div>
          <ShopToolbar total={data?.total ?? 0} sort={sort} onSortChange={setSort} />

          {isLoading && (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {isError && (
            <ErrorState
              description="We couldn't load these products. Try again."
              action={<Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>}
            />
          )}

          {!isLoading && !isError && data && data.items.length === 0 && (
            <EmptyState
              icon={<PackageSearch className="h-5 w-5" />}
              title="No products found"
              description="Try a different category or check back soon."
            />
          )}

          {!isLoading && data && data.items.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
              {data.items.map((product) => (
                <ProductCard key={product.id} product={product} href={`/product/${product.slug}`} LinkComponent={Link} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
