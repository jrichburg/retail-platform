import { z } from 'zod';

export const NodeType = z.enum(['root', 'group', 'store']);
export type NodeType = z.infer<typeof NodeType>;

export interface TenantNode {
  id: string;
  rootTenantId: string;
  parentId: string | null;
  nodeType: NodeType;
  name: string;
  code: string | null;
  path: string;
  depth: number;
  isActive: boolean;
}

export interface TenantSetting {
  id: string;
  tenantNodeId: string;
  settingsKey: string;
  settingsValue: unknown;
  isLocked: boolean;
}
