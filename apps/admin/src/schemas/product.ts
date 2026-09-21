import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(2, "Enter a product name"),
  slug: z
    .string()
    .min(2, "Enter a slug")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and hyphens only"),
  description: z.string().min(1, "Enter a description"),
  price: z.coerce.number().positive("Enter a price"),
  salePrice: z.union([z.coerce.number().positive(), z.literal("")]).optional(),
  sku: z.string().min(1, "Enter a SKU"),
  categoryId: z.string().min(1, "Choose a category"),
  tags: z.string().optional(),
  stock: z.coerce.number().int().nonnegative(),
  lowStockThreshold: z.coerce.number().int().nonnegative(),
  isFeatured: z.boolean(),
  isBestSeller: z.boolean(),
  isNewArrival: z.boolean(),
  visibility: z.enum(["visible", "hidden", "draft"]),
});
export type ProductFormValues = z.infer<typeof productFormSchema>;
