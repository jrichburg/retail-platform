import { z } from 'zod';

// Supplier
export const SupplierSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  code: z.string().nullable(),
  isActive: z.boolean(),
});

export type Supplier = z.infer<typeof SupplierSchema>;

export const CreateSupplierSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  code: z.string().max(20).nullish(),
});

export type CreateSupplierRequest = z.infer<typeof CreateSupplierSchema>;

// Size Grid
export const SizeGridValueSchema = z.object({
  id: z.string().uuid(),
  dimension: z.number(),
  value: z.string(),
  sortOrder: z.number(),
});

export const SizeGridSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  dimension1Label: z.string(),
  dimension2Label: z.string().nullable(),
  isActive: z.boolean(),
  values: z.array(SizeGridValueSchema),
});

export type SizeGrid = z.infer<typeof SizeGridSchema>;
export type SizeGridValue = z.infer<typeof SizeGridValueSchema>;

export const CreateSizeGridSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  dimension1Label: z.string().min(1).max(50),
  dimension2Label: z.string().max(50).nullish(),
  values: z.array(z.object({
    dimension: z.number().min(1).max(2),
    value: z.string().min(1).max(20),
    sortOrder: z.number(),
  })).min(1, 'At least one size value is required'),
});

export type CreateSizeGridRequest = z.infer<typeof CreateSizeGridSchema>;

// Product Variant
export const ProductVariantSchema = z.object({
  id: z.string().uuid(),
  dimension1Value: z.string().nullable(),
  dimension2Value: z.string().nullable(),
  upc: z.string().nullable(),
  isActive: z.boolean(),
});

export type ProductVariant = z.infer<typeof ProductVariantSchema>;

// Product
export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  sku: z.string(),
  upc: z.string().nullable(),
  categoryId: z.string().uuid(),
  categoryName: z.string(),
  departmentName: z.string(),
  supplierId: z.string().uuid().nullable(),
  supplierName: z.string().nullable(),
  color: z.string().nullable(),
  mapDate: z.string().nullable(),
  sizeGridId: z.string().uuid().nullable(),
  sizeGridName: z.string().nullable(),
  retailPrice: z.number(),
  costPrice: z.number().nullable(),
  description: z.string().nullable(),
  isActive: z.boolean(),
  variantCount: z.number(),
  variants: z.array(ProductVariantSchema).nullable(),
});

export type Product = z.infer<typeof ProductSchema>;

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  sku: z.string().min(1, 'SKU is required').max(50),
  categoryId: z.string().uuid('Select a category'),
  supplierId: z.string().uuid().nullish(),
  color: z.string().max(50).nullish(),
  mapDate: z.string().nullish(),
  sizeGridId: z.string().uuid().nullish(),
  retailPrice: z.number().positive('Price must be positive'),
  costPrice: z.number().nonnegative().nullish(),
  description: z.string().max(1000).nullish(),
  variants: z.array(z.object({
    dimension1Value: z.string().nullish(),
    dimension2Value: z.string().nullish(),
    upc: z.string().max(50).nullish(),
  })).nullish(),
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
