import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  sku: z.string(),
  upc: z.string().nullable(),
  categoryId: z.string().uuid(),
  categoryName: z.string(),
  departmentName: z.string(),
  retailPrice: z.number(),
  costPrice: z.number().nullable(),
  description: z.string().nullable(),
  isActive: z.boolean(),
});

export type Product = z.infer<typeof ProductSchema>;

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  sku: z.string().min(1, 'SKU is required').max(50),
  upc: z.string().max(50).optional(),
  categoryId: z.string().uuid('Select a category'),
  retailPrice: z.number().positive('Price must be positive'),
  costPrice: z.number().nonnegative().optional(),
  description: z.string().max(1000).optional(),
});

export type CreateProductRequest = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = CreateProductSchema.extend({
  isActive: z.boolean(),
});

export type UpdateProductRequest = z.infer<typeof UpdateProductSchema>;

export interface Department {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
}
