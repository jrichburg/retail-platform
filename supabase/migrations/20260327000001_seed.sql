-- Seed data

DO $$ 
DECLARE
  empty_uuid uuid := '00000000-0000-0000-0000-000000000000';
  root_id uuid := '10000000-0000-0000-0000-000000000001';
  store_id uuid := '10000000-0000-0000-0000-000000000002';
BEGIN
  -- Tenant nodes
  INSERT INTO tenant_nodes (id, root_tenant_id, parent_id, node_type, name, code, path, depth, is_active, created_by, created_at, updated_at)
  VALUES (root_id, root_id, NULL, 'root', 'Demo Retailer', 'DEMO', 'demo', 0, true, empty_uuid, NOW(), NOW())
  ON CONFLICT DO NOTHING;

  INSERT INTO tenant_nodes (id, root_tenant_id, parent_id, node_type, name, code, path, depth, is_active, created_by, created_at, updated_at)
  VALUES (store_id, root_id, root_id, 'store', 'Main Street Store', 'MAIN', 'demo.main', 1, true, empty_uuid, NOW(), NOW())
  ON CONFLICT DO NOTHING;

  -- Settings
  INSERT INTO tenant_settings (id, tenant_node_id, settings_key, settings_value, is_locked, created_at, updated_at)
  VALUES (gen_random_uuid(), root_id, 'tax_rate', '{"rate": 0.08}', false, NOW(), NOW())
  ON CONFLICT DO NOTHING;

  -- Roles
  INSERT INTO roles (id, name, description, created_at, updated_at) VALUES
    ('20000000-0000-0000-0000-000000000001', 'owner', 'Full access', NOW(), NOW()),
    ('20000000-0000-0000-0000-000000000002', 'manager', 'Store management', NOW(), NOW()),
    ('20000000-0000-0000-0000-000000000003', 'cashier', 'POS operations', NOW(), NOW())
  ON CONFLICT DO NOTHING;

  -- Permissions
  INSERT INTO permissions (id, name, module, created_at, updated_at) VALUES
    ('30000000-0000-0000-0000-000000000001', 'catalog:read', 'catalog', NOW(), NOW()),
    ('30000000-0000-0000-0000-000000000002', 'catalog:write', 'catalog', NOW(), NOW()),
    ('30000000-0000-0000-0000-000000000003', 'inventory:read', 'inventory', NOW(), NOW()),
    ('30000000-0000-0000-0000-000000000004', 'inventory:write', 'inventory', NOW(), NOW()),
    ('30000000-0000-0000-0000-000000000005', 'sales:create', 'sales', NOW(), NOW()),
    ('30000000-0000-0000-0000-000000000006', 'sales:read', 'sales', NOW(), NOW()),
    ('30000000-0000-0000-0000-000000000007', 'sales:void', 'sales', NOW(), NOW()),
    ('30000000-0000-0000-0000-000000000008', 'tenants:read', 'tenants', NOW(), NOW()),
    ('30000000-0000-0000-0000-000000000009', 'tenants:write', 'tenants', NOW(), NOW()),
    ('30000000-0000-0000-0000-000000000010', 'settings:read', 'settings', NOW(), NOW()),
    ('30000000-0000-0000-0000-000000000011', 'settings:write', 'settings', NOW(), NOW()),
    ('30000000-0000-0000-0000-000000000012', 'reporting:read', 'reporting', NOW(), NOW()),
    ('30000000-0000-0000-0000-000000000013', 'users:read', 'auth', NOW(), NOW()),
    ('30000000-0000-0000-0000-000000000014', 'users:write', 'auth', NOW(), NOW()),
    ('30000000-0000-0000-0000-000000000015', 'customers:read', 'customers', NOW(), NOW()),
    ('30000000-0000-0000-0000-000000000016', 'customers:write', 'customers', NOW(), NOW()),
    ('30000000-0000-0000-0000-000000000017', 'inventory:receive', 'inventory', NOW(), NOW()),
    ('30000000-0000-0000-0000-000000000018', 'inventory:adjust', 'inventory', NOW(), NOW())
  ON CONFLICT DO NOTHING;

  -- Owner gets all permissions
  INSERT INTO role_permissions (id, role_id, permission_id, created_at, updated_at)
  SELECT gen_random_uuid(), '20000000-0000-0000-0000-000000000001', id, NOW(), NOW()
  FROM permissions
  ON CONFLICT DO NOTHING;

  -- Suppliers
  INSERT INTO suppliers (id, tenant_node_id, root_tenant_id, name, code, is_active, created_by, created_at, updated_at) VALUES
    ('40000000-0000-0000-0000-000000000001', root_id, root_id, 'Brooks', 'BRK', true, empty_uuid, NOW(), NOW()),
    ('40000000-0000-0000-0000-000000000002', root_id, root_id, 'Nike', 'NKE', true, empty_uuid, NOW(), NOW()),
    ('40000000-0000-0000-0000-000000000003', root_id, root_id, 'ASICS', 'ASC', true, empty_uuid, NOW(), NOW()),
    ('40000000-0000-0000-0000-000000000004', root_id, root_id, 'New Balance', 'NB', true, empty_uuid, NOW(), NOW())
  ON CONFLICT DO NOTHING;

  -- Departments
  INSERT INTO departments (id, tenant_node_id, root_tenant_id, name, sort_order, is_active, created_by, created_at, updated_at) VALUES
    ('50000000-0000-0000-0000-000000000001', root_id, root_id, 'Men''s Footwear', 1, true, empty_uuid, NOW(), NOW()),
    ('50000000-0000-0000-0000-000000000002', root_id, root_id, 'Women''s Footwear', 2, true, empty_uuid, NOW(), NOW()),
    ('50000000-0000-0000-0000-000000000003', root_id, root_id, 'Apparel', 3, true, empty_uuid, NOW(), NOW())
  ON CONFLICT DO NOTHING;

  -- Categories
  INSERT INTO categories (id, department_id, tenant_node_id, root_tenant_id, name, sort_order, is_active, created_by, created_at, updated_at) VALUES
    ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', root_id, root_id, 'Running', 1, true, empty_uuid, NOW(), NOW()),
    ('60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000001', root_id, root_id, 'Casual', 2, true, empty_uuid, NOW(), NOW()),
    ('60000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000002', root_id, root_id, 'Running', 1, true, empty_uuid, NOW(), NOW()),
    ('60000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000003', root_id, root_id, 'Tops', 1, true, empty_uuid, NOW(), NOW()),
    ('60000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000003', root_id, root_id, 'Bottoms', 2, true, empty_uuid, NOW(), NOW())
  ON CONFLICT DO NOTHING;

  -- Products
  INSERT INTO products (id, tenant_node_id, root_tenant_id, name, sku, category_id, supplier_id, style, color, retail_price, cost_price, is_active, created_by, created_at, updated_at) VALUES
    ('70000000-0000-0000-0000-000000000001', root_id, root_id, 'Brooks Ghost 16', 'BRK-GH16-BLK', '60000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Ghost 16', 'Black', 139.99, 70.00, true, empty_uuid, NOW(), NOW()),
    ('70000000-0000-0000-0000-000000000002', root_id, root_id, 'New Balance 990v6', 'NB-990V6-GRY', '60000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000004', '990v6', 'Grey', 199.99, 100.00, true, empty_uuid, NOW(), NOW()),
    ('70000000-0000-0000-0000-000000000003', root_id, root_id, 'ASICS Gel-Kayano 30', 'ASC-KAY30-BLK', '60000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000003', 'Gel-Kayano 30', 'Black', 159.99, 80.00, true, empty_uuid, NOW(), NOW()),
    ('70000000-0000-0000-0000-000000000004', root_id, root_id, 'Nike Dri-FIT Tee', 'NK-DRFT-BLK', '60000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000002', 'Dri-FIT Tee', 'Black', 34.99, 17.50, true, empty_uuid, NOW(), NOW())
  ON CONFLICT DO NOTHING;

END $$;
