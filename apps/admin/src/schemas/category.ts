import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(2, "Enter a name"),
  slug: z
    .string()
    .min(2, "Enter a slug")
    .regex(/^[a-z0-9/]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and hyphens only"),
  description: z.string().optional(),
  parentId: z.string(),
  isVisible: z.boolean(),
});
export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
