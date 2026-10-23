import { z } from "zod";

export const checkoutFormSchema = z.object({
  email: z.string().email("Enter a valid email"),
  fullName: z.string().min(2, "Enter your full name"),
  phone: z.string().min(6, "Enter a valid phone number"),
  fulfillmentMethod: z.enum(["delivery", "pickup"]),
  fulfillmentLocation: z.string().optional(),
  line1: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
}).superRefine((values, context) => {
  if (values.fulfillmentMethod === "pickup") {
    if (!values.fulfillmentLocation?.trim()) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["fulfillmentLocation"], message: "Choose a pickup location" });
    }
    return;
  }

  if (!values.line1 || values.line1.trim().length < 3) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["line1"], message: "Enter your delivery address" });
  }
  if (!values.city || values.city.trim().length < 2) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["city"], message: "Enter your city" });
  }
  if (!values.country || values.country.trim().length < 2) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["country"], message: "Enter your country" });
  }
});
export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
