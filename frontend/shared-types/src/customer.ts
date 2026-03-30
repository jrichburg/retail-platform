import { z } from 'zod';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
}

export const CreateCustomerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email().max(255).nullish(),
  phone: z.string().max(20).nullish(),
  street: z.string().max(200).nullish(),
  city: z.string().max(100).nullish(),
  state: z.string().max(50).nullish(),
  zip: z.string().max(20).nullish(),
  notes: z.string().max(1000).nullish(),
});

export type CreateCustomerRequest = z.infer<typeof CreateCustomerSchema>;

export const UpdateCustomerSchema = CreateCustomerSchema.extend({
  isActive: z.boolean(),
});

export type UpdateCustomerRequest = z.infer<typeof UpdateCustomerSchema>;
