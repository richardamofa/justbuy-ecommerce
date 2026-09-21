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
      z.array(z.string().url()).default(["http://localhost:5173", "http://localhost:5174"])
    ),
});

export type AppConfig = z.infer<typeof envSchema>;

export function loadConfig(environment: NodeJS.ProcessEnv = process.env): AppConfig {
  return envSchema.parse(environment);
}
