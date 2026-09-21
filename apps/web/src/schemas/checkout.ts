import { z } from "zod";

export const checkoutFormSchema = z.object({
  email: z.string().email("Enter a valid email"),
  fullName: z.string().min(2, "Enter your full name"),
  phone: z.string().min(6, "Enter a valid phone number"),
  line1: z.string().min(3, "Enter your address"),
  city: z.string().min(2, "Enter your city"),
  country: z.string().min(2, "Enter your country"),
  postalCode: z.string().optional(),
  shippingMethod: z.enum(["standard", "express"]),
});
export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
