import type { Category, HeroBanner, HomepageSection, Product } from "@ecommerce/contracts";
import { Button, FormField, Input, Modal } from "@ecommerce/ui";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import * as React from "react";
import { sectionTypeLabels } from "../../mocks/homepage";

export function SectionEditModal({
  isOpen,
  onClose,
  section,
  products,
  categories,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  section: HomepageSection | null;
  products: Product[];
  categories: Category[];
  onSave: (section: HomepageSection) => void;
}) {
  const [draft, setDraft] = React.useState<HomepageSection | null>(section);

  React.useEffect(() => setDraft(section), [section, isOpen]);

  if (!draft) return null;
  const heroDraft = draft.type === "hero" ? draft : null;

  function toggleId(ids: string[], id: string) {
    return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
  }

  function update(patch: Partial<HomepageSection>) {
    setDraft((prev) => (prev ? ({ ...prev, ...patch } as HomepageSection) : prev));
  }

  function updateBanner(index: number, patch: Partial<HeroBanner>) {
    if (!heroDraft) return;
    update({ banners: heroDraft.banners.map((banner, bannerIndex) => bannerIndex === index ? { ...banner, ...patch } : banner) });
  }

  function moveBanner(index: number, direction: -1 | 1) {
    if (!heroDraft) return;
    const target = index + direction;
    if (target < 0 || target >= heroDraft.banners.length) return;
    const banners = [...heroDraft.banners];
    const current = banners[index]!;
    banners[index] = banners[target]!;
    banners[target] = current;
    update({ banners: banners.map((banner, bannerIndex) => ({ ...banner, position: bannerIndex })) });
  }

  function addBanner() {
    if (!heroDraft) return;
    const position = heroDraft.banners.length;
    update({
      banners: [
        ...heroDraft.banners,
        {
          id: `banner_${Date.now()}`,
          heading: "A considered new season",
          subheading: "Add a short line that gives this slide its own point of view.",
          image: { id: `banner_img_${Date.now()}`, url: "", alt: "", position },
          ctaLabel: "Shop now",
          ctaHref: "/shop",
          position,
          isActive: true,
        },
      ],
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit section — ${sectionTypeLabels[draft.type]}`} className="max-w-xl">
      <div className="space-y-4">
        <FormField label="Title" htmlFor="title">
          <Input id="title" value={draft.title ?? ""} onChange={(e) => update({ title: e.target.value })} />
        </FormField>
        {"subtitle" in draft && (
          <FormField label="Subtitle" htmlFor="subtitle">
            <Input id="subtitle" value={draft.subtitle ?? ""} onChange={(e) => update({ subtitle: e.target.value })} />
          </FormField>
        )}

        {(draft.type === "product-grid" || draft.type === "product-carousel") && (
          <div>
            <p className="mb-2 text-sm font-medium text-ink-800">Products ({draft.productIds.length} selected)</p>
            <div className="max-h-52 space-y-1 overflow-y-auto rounded border border-ink-100 p-2">
              {products.map((product) => (
                <label key={product.id} className="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-ink-50">
                  <input
                    type="checkbox"
                    checked={draft.productIds.includes(product.id)}
                    onChange={() =>
                      update({
                        productIds: toggleId(draft.productIds, product.id),
                        products: products.filter((p) => toggleId(draft.productIds, product.id).includes(p.id)),
                      })
                    }
                  />
                  {product.name}
                </label>
              ))}
            </div>
          </div>
        )}

        {draft.type === "category-grid" && (
          <div>
            <p className="mb-2 text-sm font-medium text-ink-800">Categories ({draft.categoryIds.length} selected)</p>
            <div className="max-h-52 space-y-1 overflow-y-auto rounded border border-ink-100 p-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-ink-50">
                  <input
                    type="checkbox"
                    checked={draft.categoryIds.includes(category.id)}
                    onChange={() =>
                      update({
                        categoryIds: toggleId(draft.categoryIds, category.id),
                        categories: categories.filter((c) => toggleId(draft.categoryIds, category.id).includes(c.id)),
                      })
                    }
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </div>
        )}

        {draft.type === "newsletter" && (
          <FormField label="Body" htmlFor="body">
            <Input id="body" value={draft.body ?? ""} onChange={(e) => update({ body: e.target.value })} />
          </FormField>
        )}

        {draft.type === "hero" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-800">Hero slides</p>
                <p className="text-xs text-ink-400">Each slide can have its own story, image, and CTA.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addBanner}>
                <Plus className="h-3.5 w-3.5" /> Add slide
              </Button>
            </div>
            {draft.banners.map((banner, index) => (
              <div key={banner.id} className="space-y-3 rounded border border-ink-100 bg-paper-100 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-moss-600">Slide {index + 1}</p>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => moveBanner(index, -1)} disabled={index === 0} aria-label="Move slide up" className="rounded p-1 text-ink-400 hover:bg-ink-100 disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => moveBanner(index, 1)} disabled={index === draft.banners.length - 1} aria-label="Move slide down" className="rounded p-1 text-ink-400 hover:bg-ink-100 disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => update({ banners: draft.banners.filter((_, bannerIndex) => bannerIndex !== index).map((item, bannerIndex) => ({ ...item, position: bannerIndex })) })} disabled={draft.banners.length <= 1} aria-label="Delete slide" className="rounded p-1 text-ink-400 hover:bg-signal-50 hover:text-signal-DEFAULT disabled:opacity-30"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
                <FormField label="Heading" htmlFor={`banner-heading-${index}`}>
                  <Input id={`banner-heading-${index}`} value={banner.heading} onChange={(e) => updateBanner(index, { heading: e.target.value })} />
                </FormField>
                <FormField label="Supporting text" htmlFor={`banner-subheading-${index}`}>
                  <Input id={`banner-subheading-${index}`} value={banner.subheading ?? ""} onChange={(e) => updateBanner(index, { subheading: e.target.value })} />
                </FormField>
                <FormField label="Desktop image URL" htmlFor={`banner-image-${index}`}>
                  <Input id={`banner-image-${index}`} value={banner.image.url} onChange={(e) => updateBanner(index, { image: { ...banner.image, url: e.target.value } })} />
                </FormField>
                <FormField label="Mobile image URL (optional)" htmlFor={`banner-mobile-image-${index}`}>
                  <Input id={`banner-mobile-image-${index}`} value={banner.mobileImage?.url ?? ""} onChange={(e) => updateBanner(index, { mobileImage: e.target.value ? { id: `${banner.id}_mobile`, url: e.target.value, alt: banner.image.alt, position: 0 } : undefined })} />
                </FormField>
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField label="CTA label" htmlFor={`banner-cta-label-${index}`}>
                    <Input id={`banner-cta-label-${index}`} value={banner.ctaLabel ?? ""} onChange={(e) => updateBanner(index, { ctaLabel: e.target.value })} />
                  </FormField>
                  <FormField label="CTA link" htmlFor={`banner-cta-href-${index}`}>
                    <Input id={`banner-cta-href-${index}`} value={banner.ctaHref ?? ""} onChange={(e) => updateBanner(index, { ctaHref: e.target.value })} />
                  </FormField>
                </div>
                <label className="flex items-center gap-2 text-xs text-ink-600">
                  <input type="checkbox" checked={banner.isActive} onChange={(e) => updateBanner(index, { isActive: e.target.checked })} />
                  Show this slide
                </label>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(draft);
              onClose();
            }}
          >
            Save section
          </Button>
        </div>
      </div>
    </Modal>
  );
}
