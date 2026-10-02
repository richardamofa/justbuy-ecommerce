import type { Category, Image, Product, ProductOption, ProductVariant } from "@ecommerce/contracts";
import { Button, FormField, Input, Modal, Select, Textarea } from "@ecommerce/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { productFormSchema, type ProductFormValues } from "../../schemas/product";

function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function imageFromUrl(url: string, productName: string, position: number): Image {
  return {
    id: newId("image"),
    url,
    alt: productName,
    position,
  };
}

function variantImageFromUrl(url: string, productName: string, variantId: string): Image | undefined {
  return url.trim()
    ? { id: `${variantId}-image`, url: url.trim(), alt: productName, position: 0 }
    : undefined;
}

function combinations(options: ProductOption[]): Record<string, string>[] {
  return options.reduce<Record<string, string>[]>((result, option) => {
    if (!option.name.trim() || option.values.length === 0) return result;
    if (result.length === 0) return option.values.map((value) => ({ [option.name]: value }));
    return result.flatMap((current) => option.values.map((value) => ({ ...current, [option.name]: value })));
  }, []);
}

function toFormValues(product: Product | null): ProductFormValues {
  if (!product) {
    return {
      name: "",
      slug: "",
      description: "",
      price: 0,
      salePrice: "",
      sku: "",
      categoryId: "",
      tags: "",
      stock: 0,
      lowStockThreshold: 5,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
      visibility: "visible",
    };
  }
  return {
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    salePrice: product.salePrice ?? "",
    sku: product.sku,
    categoryId: product.categoryId ?? "",
    tags: product.tags.join(", "),
    stock: product.stock,
    lowStockThreshold: product.lowStockThreshold,
    isFeatured: product.isFeatured,
    isBestSeller: product.isBestSeller,
    isNewArrival: product.isNewArrival,
    visibility: product.visibility,
  };
}

export function ProductFormModal({
  isOpen,
  onClose,
  product,
  categories,
  onSave,
  isSaving,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
  onSave: (product: Product) => void;
  isSaving?: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: toFormValues(product),
  });
  const [images, setImages] = React.useState<Image[]>(product?.images ?? []);
  const [options, setOptions] = React.useState<ProductOption[]>(product?.options ?? []);
  const [variants, setVariants] = React.useState<ProductVariant[]>(product?.variants ?? []);
  const [imageUrl, setImageUrl] = React.useState("");
  const [imageError, setImageError] = React.useState("");

  React.useEffect(() => {
    reset(toFormValues(product));
    setImages(product?.images ?? []);
    setOptions(product?.options ?? []);
    setVariants(product?.variants ?? []);
    setImageUrl("");
    setImageError("");
  }, [product, isOpen, reset]);

  function addImage(url: string) {
    const trimmed = url.trim();
    if (!trimmed) return;
    try {
      new URL(trimmed);
    } catch {
      setImageError("Enter a valid image URL.");
      return;
    }
    setImages((current) => [...current, imageFromUrl(trimmed, product?.name ?? "Product", current.length)]);
    setImageUrl("");
    setImageError("");
  }

  function handleImageFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("Select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImages((current) => [...current, imageFromUrl(reader.result as string, product?.name ?? "Product", current.length)]);
        setImageError("");
      }
    };
    reader.onerror = () => setImageError("Unable to read that image.");
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function updateOption(index: number, patch: Partial<ProductOption>) {
    setOptions((current) => current.map((option, optionIndex) => optionIndex === index ? { ...option, ...patch } : option));
  }

  function generateVariants() {
    const generated = combinations(options);
    if (generated.length === 0) {
      setVariants([]);
      return;
    }
    setVariants(generated.map((optionMap) => {
      const existing = variants.find((variant) => Object.keys(optionMap).every((key) => variant.options[key] === optionMap[key]) && Object.keys(variant.options).length === Object.keys(optionMap).length);
      return existing ?? {
        id: newId("variant"),
        productId: product?.id ?? "",
        sku: `${product?.sku ?? "SKU"}-${Object.values(optionMap).join("-").toUpperCase().replace(/[^A-Z0-9-]/g, "")}`,
        options: optionMap,
        price: undefined,
        salePrice: undefined,
        stock: 0,
        isDefault: false,
      };
    }));
  }

  function onSubmit(values: ProductFormValues) {
    const merged: Product = {
      id: product?.id ?? "",
      name: values.name,
      slug: values.slug,
      description: values.description,
      shortDescription: product?.shortDescription,
      price: values.price,
      salePrice: values.salePrice === "" || values.salePrice == null ? undefined : Number(values.salePrice),
      currency: product?.currency ?? "GHS",
      sku: values.sku,
      images: product?.images ?? [],
      categoryId: values.categoryId,
      collectionIds: product?.collectionIds ?? [],
      tags: values.tags ? values.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      options: product?.options ?? [],
      variants: product?.variants ?? [],
      stock: values.stock,
      lowStockThreshold: values.lowStockThreshold,
      trackInventory: product?.trackInventory ?? true,
      isFeatured: values.isFeatured,
      isBestSeller: values.isBestSeller,
      isNewArrival: values.isNewArrival,
      visibility: values.visibility,
      rating: product?.rating,
      reviewCount: product?.reviewCount ?? 0,
    };
    merged.images = images.map((image, index) => ({ ...image, position: index }));
    merged.options = options.filter((option) => option.name.trim() && option.values.length > 0);
    merged.variants = variants.map((variant) => ({
      ...variant,
      productId: product?.id ?? "",
      image: variant.image?.url ? variant.image : undefined,
    }));
    onSave(merged);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product ? "Edit product" : "New product"} className="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Name" htmlFor="name" error={errors.name?.message}>
            <Input id="name" {...register("name")} />
          </FormField>
          <FormField label="Slug" htmlFor="slug" error={errors.slug?.message}>
            <Input id="slug" {...register("slug")} />
          </FormField>
        </div>

        <FormField label="Description" htmlFor="description" error={errors.description?.message}>
          <Textarea id="description" rows={3} {...register("description")} />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Price (GHS)" htmlFor="price" error={errors.price?.message}>
            <Input id="price" type="number" step="0.01" {...register("price")} />
          </FormField>
          <FormField label="Sale price (optional)" htmlFor="salePrice" error={errors.salePrice?.message as string | undefined}>
            <Input id="salePrice" type="number" step="0.01" {...register("salePrice")} />
          </FormField>
          <FormField label="SKU" htmlFor="sku" error={errors.sku?.message}>
            <Input id="sku" {...register("sku")} />
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Category" htmlFor="categoryId" error={errors.categoryId?.message}>
            <Select id="categoryId" {...register("categoryId")}>
              <option value="">Select…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Stock" htmlFor="stock" error={errors.stock?.message}>
            <Input id="stock" type="number" {...register("stock")} />
          </FormField>
          <FormField label="Low-stock threshold" htmlFor="lowStockThreshold" error={errors.lowStockThreshold?.message}>
            <Input id="lowStockThreshold" type="number" {...register("lowStockThreshold")} />
          </FormField>
        </div>

        <FormField label="Tags (comma-separated)" htmlFor="tags">
          <Input id="tags" {...register("tags")} />
        </FormField>

        <section className="space-y-3 rounded border border-ink-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-ink-900">Product images</h3>
              <p className="text-xs text-ink-500">Add image URLs or select files for an immediate preview.</p>
            </div>
            <ImagePlus className="h-4 w-4 text-ink-400" />
          </div>
          <div className="flex gap-2">
            <Input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="https://…" aria-label="Image URL" />
            <Button type="button" variant="outline" onClick={() => addImage(imageUrl)}>Add</Button>
            <label className="flex shrink-0 cursor-pointer items-center rounded border border-ink-200 px-3 text-sm text-ink-700 hover:border-ink-900">
              Select file
              <input type="file" accept="image/*" className="sr-only" onChange={handleImageFile} />
            </label>
          </div>
          {imageError && <p className="text-xs text-signal-DEFAULT">{imageError}</p>}
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image) => (
                <div key={image.id} className="relative aspect-square overflow-hidden rounded border border-ink-100 bg-ink-50">
                  <img src={image.url} alt={image.alt} className="h-full w-full object-cover" />
                  <button type="button" onClick={() => setImages((current) => current.filter((item) => item.id !== image.id))} className="absolute right-1 top-1 rounded bg-paper-50/90 p-1 text-ink-600 hover:text-signal-DEFAULT" aria-label="Remove image">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-3 rounded border border-ink-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-ink-900">Options and variants</h3>
              <p className="text-xs text-ink-500">Define any option names, then generate their actual purchasable combinations.</p>
            </div>
            <Button type="button" variant="outline" onClick={() => setOptions((current) => [...current, { name: "", values: [] }])}>
              <Plus className="h-4 w-4" /> Add option
            </Button>
          </div>
          {options.map((option, index) => (
            <div key={`${index}-${option.name}`} className="flex items-center gap-2">
              <Input value={option.name} onChange={(event) => updateOption(index, { name: event.target.value })} placeholder="Option name (e.g. Color)" aria-label="Option name" />
              <Input value={option.values.join(", ")} onChange={(event) => updateOption(index, { values: event.target.value.split(",").map((value) => value.trim()).filter(Boolean) })} placeholder="Values, comma-separated" aria-label="Option values" />
              <button type="button" onClick={() => setOptions((current) => current.filter((_, optionIndex) => optionIndex !== index))} className="rounded p-2 text-ink-400 hover:text-signal-DEFAULT" aria-label="Remove option"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          {options.length > 0 && <Button type="button" variant="outline" onClick={generateVariants}>Generate variants</Button>}
          {variants.length > 0 && (
            <div className="space-y-2">
              {variants.map((variant, index) => (
                <div key={variant.id} className="grid gap-2 rounded border border-ink-100 p-3 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]">
                  <div className="text-xs text-ink-600 sm:col-span-5">{Object.entries(variant.options).map(([name, value]) => `${name}: ${value}`).join(" / ")}</div>
                  <Input value={variant.sku} onChange={(event) => setVariants((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, sku: event.target.value } : item))} placeholder="SKU" aria-label="Variant SKU" />
                  <Input type="number" step="0.01" value={variant.price ?? ""} onChange={(event) => setVariants((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, price: event.target.value ? Number(event.target.value) : undefined } : item))} placeholder="Price" aria-label="Variant price" />
                  <Input type="number" step="0.01" value={variant.salePrice ?? ""} onChange={(event) => setVariants((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, salePrice: event.target.value ? Number(event.target.value) : undefined } : item))} placeholder="Sale price" aria-label="Variant sale price" />
                  <Input type="number" min="0" value={variant.stock} onChange={(event) => setVariants((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, stock: Number(event.target.value) } : item))} placeholder="Stock" aria-label="Variant stock" />
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-xs text-ink-600"><input type="radio" name="default-variant" checked={variant.isDefault} onChange={() => setVariants((current) => current.map((item, itemIndex) => ({ ...item, isDefault: itemIndex === index })))} /> Default</label>
                    <button type="button" onClick={() => setVariants((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="rounded p-2 text-ink-400 hover:text-signal-DEFAULT" aria-label="Remove variant"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  <Input value={variant.image?.url ?? ""} onChange={(event) => setVariants((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, image: variantImageFromUrl(event.target.value, product?.name ?? "Product", item.id) } : item))} placeholder="Optional variant image URL" aria-label="Variant image URL" />
                </div>
              ))}
            </div>
          )}
        </section>

        <FormField label="Visibility" htmlFor="visibility">
          <Select id="visibility" {...register("visibility")}>
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
            <option value="draft">Draft</option>
          </Select>
        </FormField>

        <div className="flex flex-wrap gap-5 pt-1">
          {(["isFeatured", "isBestSeller", "isNewArrival"] as const).map((name) => (
            <Controller
              key={name}
              name={name}
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm text-ink-700">
                  <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                  {name === "isFeatured" ? "Featured" : name === "isBestSeller" ? "Best seller" : "New arrival"}
                </label>
              )}
            />
          ))}
        </div>

        <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSaving}>
            {product ? "Save changes" : "Create product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
