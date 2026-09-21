import type { ProductListQuery } from "@ecommerce/contracts";
import { Select } from "@ecommerce/ui";

const sortOptions: { value: ProductListQuery["sort"]; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to high" },
  { value: "price-desc", label: "Price: High to low" },
  { value: "best-selling", label: "Best selling" },
  { value: "featured", label: "Featured" },
];

export function ShopToolbar({
  total,
  sort,
  onSortChange,
}: {
  total: number;
  sort: ProductListQuery["sort"];
  onSortChange: (sort: ProductListQuery["sort"]) => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-ink-100 pb-4">
      <p className="text-sm text-ink-500">{total} products</p>
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm text-ink-500">
          Sort
        </label>
        <Select id="sort" value={sort} onChange={(e) => onSortChange(e.target.value as ProductListQuery["sort"])} className="w-auto">
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
