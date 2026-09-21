import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Category } from "@ecommerce/contracts";
import { categoryFormSchema, type CategoryFormValues } from "../../schemas/category";
import { Modal, FormField, Input, Textarea, Select, Button } from "@ecommerce/ui";

function toFormValues(category: Category | null): CategoryFormValues {
  return {
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    description: category?.description ?? "",
    parentId: category?.parentId ?? "",
    isVisible: category?.isVisible ?? true,
  };
}

export function CategoryFormModal({
  isOpen,
  onClose,
  category,
  categories,
  onSave,
  isSaving,
}: {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  categories: Category[];
  onSave: (category: Category) => void;
  isSaving?: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({ resolver: zodResolver(categoryFormSchema), defaultValues: toFormValues(category) });

  React.useEffect(() => {
    reset(toFormValues(category));
  }, [category, isOpen, reset]);

  function onSubmit(values: CategoryFormValues) {
    onSave({
      id: category?.id ?? "",
      name: values.name,
      slug: values.slug,
      description: values.description,
      parentId: values.parentId || null,
      position: category?.position ?? 0,
      isVisible: values.isVisible,
      image: category?.image,
    });
  }

  const parentOptions = categories.filter((c) => c.parentId === null && c.id !== category?.id);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={category ? "Edit category" : "New category"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Name" htmlFor="name" error={errors.name?.message}>
          <Input id="name" {...register("name")} />
        </FormField>
        <FormField label="Slug" htmlFor="slug" error={errors.slug?.message}>
          <Input id="slug" {...register("slug")} />
        </FormField>
        <FormField label="Description" htmlFor="description">
          <Textarea id="description" rows={2} {...register("description")} />
        </FormField>
        <FormField label="Parent category" htmlFor="parentId" hint="Leave blank for a top-level category">
          <Select id="parentId" {...register("parentId")}>
            <option value="">None (top-level)</option>
            {parentOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </FormField>
        <Controller
          name="isVisible"
          control={control}
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
              Visible on storefront
            </label>
          )}
        />
        <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSaving}>
            {category ? "Save changes" : "Create category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
