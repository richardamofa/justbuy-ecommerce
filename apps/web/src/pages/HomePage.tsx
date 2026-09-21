import { useHomepageConfig } from "../hooks/queries";
import { SectionRenderer } from "../components/homepage/SectionRenderer";
import { Skeleton } from "@ecommerce/ui";

export function HomePage() {
  const { data, isLoading, isError } = useHomepageConfig();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-12 sm:px-6">
        <Skeleton className="aspect-[16/9] w-full" />
        <div className="grid grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return <p className="mx-auto max-w-7xl px-4 py-24 text-center text-ink-500">Couldn't load the homepage.</p>;
  }

  return <SectionRenderer sections={data.sections} />;
}
