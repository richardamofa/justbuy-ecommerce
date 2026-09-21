import { useParams } from "react-router-dom";
import { useCategory } from "../hooks/queries";
import { ProductListingView } from "../components/shop/ProductListingView";
import { ErrorState } from "@ecommerce/ui";

export function CategoryPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: category, isLoading } = useCategory(slug);

  if (!isLoading && !category) {
    return <ErrorState title="Category not found" className="mx-auto max-w-7xl px-4 py-24" />;
  }

  return (
    <ProductListingView
      title={category?.name ?? "…"}
      description={category?.description}
      baseQuery={{ categorySlug: slug }}
      activeCategorySlug={slug}
    />
  );
}
