import { z } from "zod";

export const settingsFormSchema = z.object({
  storeName: z.string().min(1, "Enter a store name"),
  storeDescription: z.string().optional(),
  currency: z.string().min(1),
  contactEmail: z.string().email("Enter a valid email").optional().or(z.literal("")),
  supportPhone: z.string().optional(),
  shippingFlatRate: z.coerce.number().nonnegative(),
  taxRatePercent: z.coerce.number().min(0).max(100),
});
export type SettingsFormValues = z.infer<typeof settingsFormSchema>;
