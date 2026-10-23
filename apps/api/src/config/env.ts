import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .refine((value) => value.startsWith("postgresql://") || value.startsWith("postgres://"), "DATABASE_URL must be a PostgreSQL connection string"),
  CORS_ORIGIN: z
    .preprocess(
      (value) => (typeof value === "string" ? value.split(",").map((origin) => origin.trim()).filter(Boolean) : value),
      z.array(z.string().url()).default(["http://localhost:5173", "http://localhost:5174","https://justbuy-ecommerce-web-git-main-figoinc.vercel.app","https://justbuy-ecommerce.vercel.app/"])
    ),
  RESEND_API_KEY: z.string().optional(),
  RESEND_AUDIENCE_ID: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().optional(),
  ADMIN_NOTIFICATION_EMAIL: z.string().email().optional(),
  PAYSTACK_SECRET_KEY: z.string().optional(),
  PAYMENT_PROVIDER: z.string().default("paystack"),
  PAYMENT_PROVIDER_SECRET_KEY: z.string().optional(),
  PAYMENT_CALLBACK_URL: z.string().url().optional(),
  PAYSTACK_CALLBACK_URL: z.string().url().optional(),
});

export type AppConfig = z.infer<typeof envSchema>;

export function loadConfig(environment: NodeJS.ProcessEnv = process.env): AppConfig {
  return envSchema.parse(environment);
}
