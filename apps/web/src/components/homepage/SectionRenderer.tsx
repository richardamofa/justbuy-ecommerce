import type { HomepageSection } from "@ecommerce/contracts";
import { HeroSection } from "./HeroSection";
import {
  ProductGridSection,
  ProductCarouselSection,
  CategoryGridSection,
  CollectionBlockSection,
  BannerSection,
  RichContentSection,
  NewsletterSection,
} from "./Sections";

/**
 * Renders a homepage from a config array of typed sections — the same
 * shape GET /homepage will eventually return. No section type is ever
 * hardcoded into a page; adding a new configured section here is enough
 * for it to show up on the homepage.
 */
export function SectionRenderer({ sections }: { sections: HomepageSection[] }) {
  const enabled = [...sections].filter((s) => s.isEnabled).sort((a, b) => a.position - b.position);

  return (
    <>
      {enabled.map((section) => {
        switch (section.type) {
          case "hero":
            return <HeroSection key={section.id} banners={section.banners} />;
          case "product-grid":
            return (
              <ProductGridSection
                key={section.id}
                title={section.title}
                subtitle={section.subtitle}
                products={section.products}
                viewAllHref={section.viewAllHref}
              />
            );
          case "product-carousel":
            return (
              <ProductCarouselSection
                key={section.id}
                title={section.title}
                subtitle={section.subtitle}
                products={section.products}
                viewAllHref={section.viewAllHref}
              />
            );
          case "category-grid":
            return <CategoryGridSection key={section.id} title={section.title} categories={section.categories} />;
          case "collection":
            return (
              <CollectionBlockSection
                key={section.id}
                title={section.title}
                subtitle={section.subtitle}
                products={section.products}
                collectionHref={section.collection ? `/collections/${section.collection.slug}` : undefined}
              />
            );
          case "banner":
            return (
              <BannerSection
                key={section.id}
                image={section.image}
                title={section.title}
                ctaLabel={section.ctaLabel}
                ctaHref={section.ctaHref}
              />
            );
          case "rich-content":
            return <RichContentSection key={section.id} html={section.html} />;
          case "newsletter":
            return <NewsletterSection key={section.id} heading={section.heading} body={section.body} />;
          default:
            return null;
        }
      })}
    </>
  );
}
