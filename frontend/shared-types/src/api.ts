import { z } from 'zod';

export const PaginatedRequestSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(25),
  sortBy: z.string().optional(),
  sortDirection: z.enum(['asc', 'desc']).default('asc'),
});

export type PaginatedRequest = z.infer<typeof PaginatedRequestSchema>;

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string[]>;
}
