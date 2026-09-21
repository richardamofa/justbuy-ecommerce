import { useSearchParams } from "react-router-dom";
import { ProductListingView } from "../components/shop/ProductListingView";

export function ShopPage() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") ?? undefined;

  return (
    <ProductListingView
      title={search ? `Search results for “${search}”` : "Shop all"}
      description={search ? "Showing the closest matches from the collection." : "Every product, in one place."}
      baseQuery={{ search }}
    />
  );
}
