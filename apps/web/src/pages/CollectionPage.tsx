import { useParams } from "react-router-dom";
import { useCollection } from "../hooks/queries";
import { ProductListingView } from "../components/shop/ProductListingView";
import { ErrorState } from "@ecommerce/ui";

export function CollectionPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: collection, isLoading } = useCollection(slug);

  if (!isLoading && !collection) {
    return <ErrorState title="Collection not found" className="mx-auto max-w-7xl px-4 py-24" />;
  }

  return (
    <ProductListingView
      title={collection?.name ?? "…"}
      description={collection?.description}
      baseQuery={{ collectionSlug: slug }}
    />
  );
}
