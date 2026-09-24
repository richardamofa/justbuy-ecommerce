import { z } from "zod";

export const adminLoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type AdminLoginInput = z.infer<typeof adminLoginInputSchema>;

export const adminUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.string(),
});

export type AdminUser = z.infer<typeof adminUserSchema>;

export const adminAuthResponseSchema = z.object({
  admin: adminUserSchema,
});

export type AdminAuthResponse = z.infer<typeof adminAuthResponseSchema>;