import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Category, Product } from "@ecommerce/contracts";
import { productFormSchema, type ProductFormValues } from "../../schemas/product";
import { Modal, FormField, Input, Textarea, Select, Button } from "@ecommerce/ui";

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

  React.useEffect(() => {
    reset(toFormValues(product));
  }, [product, isOpen, reset]);

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
