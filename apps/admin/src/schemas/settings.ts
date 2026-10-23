import { z } from "zod";

export const settingsFormSchema = z.object({
  storeName: z.string().min(1, "Enter a store name"),
  storeDescription: z.string().optional(),
  currency: z.string().min(1),
  contactEmail: z.string().email("Enter a valid email").optional().or(z.literal("")),
  supportPhone: z.string().optional(),
  deliveryFee: z.coerce.number().nonnegative(),
  pickupLocationsText: z.string().optional(),
  taxRatePercent: z.coerce.number().min(0).max(100),
});
export type SettingsFormValues = z.infer<typeof settingsFormSchema>;
