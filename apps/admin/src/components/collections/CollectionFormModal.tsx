import * as React from "react";
import type { Collection, Product } from "@ecommerce/contracts";
import { Modal, FormField, Input, Textarea, Button } from "@ecommerce/ui";

export function CollectionFormModal({
  isOpen,
  onClose,
  collection,
  products,
  onSave,
  isSaving,
}: {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection | null;
  products: Product[];
  onSave: (collection: Collection) => void;
  isSaving?: boolean;
}) {
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [productIds, setProductIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    setName(collection?.name ?? "");
    setSlug(collection?.slug ?? "");
    setDescription(collection?.description ?? "");
    setProductIds(collection?.productIds ?? []);
  }, [collection, isOpen]);

  function toggleProduct(id: string) {
    setProductIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      id: collection?.id ?? "",
      name,
      slug,
      description,
      image: collection?.image,
      isVisible: collection?.isVisible ?? true,
      productIds,
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={collection ? "Edit collection" : "New collection"} className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Name" htmlFor="name">
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </FormField>
        <FormField label="Slug" htmlFor="slug">
          <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </FormField>
        <FormField label="Description" htmlFor="description">
          <Textarea id="description" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        </FormField>

        <div>
          <p className="mb-2 text-sm font-medium text-ink-800">Products ({productIds.length} selected)</p>
          <div className="max-h-56 space-y-1 overflow-y-auto rounded border border-ink-100 p-2">
            {products.map((product) => (
              <label key={product.id} className="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-ink-50">
                <input type="checkbox" checked={productIds.includes(product.id)} onChange={() => toggleProduct(product.id)} />
                {product.name}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSaving}>
            {collection ? "Save changes" : "Create collection"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
