import { z } from 'zod';

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export interface AuthUser {
  id: string;
  email: string;
  tenantNodeId: string;
  rootTenantId: string;
  roles: string[];
  permissions: string[];
}
