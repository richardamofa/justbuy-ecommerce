import { z } from "zod";

export const imageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  alt: z.string().default(""),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  position: z.number().int().nonnegative().default(0),
});
export type Image = z.infer<typeof imageSchema>;

export const moneySchema = z.number().nonnegative();

export const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Must be a URL-safe slug");

export const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});
export type Seo = z.infer<typeof seoSchema>;

export const timestampsSchema = z.object({
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/** Generic paginated envelope the API will eventually return. */
export const paginatedSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  });

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
