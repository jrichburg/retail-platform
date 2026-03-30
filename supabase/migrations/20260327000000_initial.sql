CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;


DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260324153931_InitialCreate') THEN
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260324153931_InitialCreate') THEN
    CREATE EXTENSION IF NOT EXISTS "ltree";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260324153931_InitialCreate') THEN
    CREATE TABLE tenant_nodes (
        id uuid NOT NULL,
        root_tenant_id uuid NOT NULL,
        parent_id uuid,
        node_type character varying(20) NOT NULL,
        name character varying(200) NOT NULL,
        code character varying(20),
        path character varying(500) NOT NULL,
        depth integer NOT NULL,
        is_active boolean NOT NULL DEFAULT TRUE,
        created_by uuid NOT NULL,
        updated_by uuid,
        created_at timestamp with time zone NOT NULL,
        updated_at timestamp with time zone NOT NULL,
        CONSTRAINT "PK_tenant_nodes" PRIMARY KEY (id),
        CONSTRAINT "FK_tenant_nodes_tenant_nodes_parent_id" FOREIGN KEY (parent_id) REFERENCES tenant_nodes (id) ON DELETE RESTRICT
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260324153931_InitialCreate') THEN
    CREATE TABLE tenant_settings (
        id uuid NOT NULL,
        tenant_node_id uuid NOT NULL,
        settings_key character varying(100) NOT NULL,
        settings_value jsonb NOT NULL,
        is_locked boolean NOT NULL DEFAULT FALSE,
        created_at timestamp with time zone NOT NULL,
        updated_at timestamp with time zone NOT NULL,
        CONSTRAINT "PK_tenant_settings" PRIMARY KEY (id),
        CONSTRAINT "FK_tenant_settings_tenant_nodes_tenant_node_id" FOREIGN KEY (tenant_node_id) REFERENCES tenant_nodes (id) ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260324153931_InitialCreate') THEN
    CREATE INDEX "IX_tenant_nodes_parent_id" ON tenant_nodes (parent_id);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260324153931_InitialCreate') THEN
    CREATE INDEX ix_tenant_nodes_path ON tenant_nodes (path);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260324153931_InitialCreate') THEN
    CREATE INDEX ix_tenant_nodes_root ON tenant_nodes (root_tenant_id);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260324153931_InitialCreate') THEN
    CREATE UNIQUE INDEX ix_tenant_settings_node_key ON tenant_settings (tenant_node_id, settings_key);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260324153931_InitialCreate') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260324153931_InitialCreate', '8.0.25');
    END IF;
END $EF$;
COMMIT;

START TRANSACTION;


DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325171321_AddAuthEntities') THEN
    CREATE TABLE app_users (
        id uuid NOT NULL,
        supabase_user_id uuid NOT NULL,
        email character varying(255) NOT NULL,
        first_name character varying(100) NOT NULL,
        last_name character varying(100) NOT NULL,
        is_active boolean NOT NULL DEFAULT TRUE,
        created_by uuid NOT NULL,
        updated_by uuid,
        created_at timestamp with time zone NOT NULL,
        updated_at timestamp with time zone NOT NULL,
        tenant_node_id uuid NOT NULL,
        root_tenant_id uuid NOT NULL,
        CONSTRAINT "PK_app_users" PRIMARY KEY (id)
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325171321_AddAuthEntities') THEN
    CREATE TABLE permissions (
        id uuid NOT NULL,
        name character varying(100) NOT NULL,
        module character varying(50) NOT NULL,
        created_at timestamp with time zone NOT NULL,
        updated_at timestamp with time zone NOT NULL,
        CONSTRAINT "PK_permissions" PRIMARY KEY (id)
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325171321_AddAuthEntities') THEN
    CREATE TABLE roles (
        id uuid NOT NULL,
        name character varying(50) NOT NULL,
        description character varying(200),
        created_at timestamp with time zone NOT NULL,
        updated_at timestamp with time zone NOT NULL,
        CONSTRAINT "PK_roles" PRIMARY KEY (id)
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325171321_AddAuthEntities') THEN
    CREATE TABLE app_user_roles (
        id uuid NOT NULL,
        app_user_id uuid NOT NULL,
        role_id uuid NOT NULL,
        tenant_node_id uuid NOT NULL,
        created_at timestamp with time zone NOT NULL,
        updated_at timestamp with time zone NOT NULL,
        CONSTRAINT "PK_app_user_roles" PRIMARY KEY (id),
        CONSTRAINT "FK_app_user_roles_app_users_app_user_id" FOREIGN KEY (app_user_id) REFERENCES app_users (id) ON DELETE CASCADE,
        CONSTRAINT "FK_app_user_roles_roles_role_id" FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325171321_AddAuthEntities') THEN
    CREATE TABLE role_permissions (
        id uuid NOT NULL,
        role_id uuid NOT NULL,
        permission_id uuid NOT NULL,
        created_at timestamp with time zone NOT NULL,
        updated_at timestamp with time zone NOT NULL,
        CONSTRAINT "PK_role_permissions" PRIMARY KEY (id),
        CONSTRAINT "FK_role_permissions_permissions_permission_id" FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE,
        CONSTRAINT "FK_role_permissions_roles_role_id" FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325171321_AddAuthEntities') THEN
    CREATE INDEX "IX_app_user_roles_role_id" ON app_user_roles (role_id);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325171321_AddAuthEntities') THEN
    CREATE UNIQUE INDEX ix_app_user_roles_unique ON app_user_roles (app_user_id, role_id, tenant_node_id);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325171321_AddAuthEntities') THEN
    CREATE INDEX ix_app_users_email ON app_users (email);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325171321_AddAuthEntities') THEN
    CREATE UNIQUE INDEX ix_app_users_supabase_tenant ON app_users (supabase_user_id, tenant_node_id);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325171321_AddAuthEntities') THEN
    CREATE UNIQUE INDEX ix_permissions_name ON permissions (name);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325171321_AddAuthEntities') THEN
    CREATE INDEX "IX_role_permissions_permission_id" ON role_permissions (permission_id);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325171321_AddAuthEntities') THEN
    CREATE UNIQUE INDEX ix_role_permissions_unique ON role_permissions (role_id, permission_id);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325171321_AddAuthEntities') THEN
    CREATE UNIQUE INDEX ix_roles_name ON roles (name);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325171321_AddAuthEntities') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260325171321_AddAuthEntities', '8.0.25');
    END IF;
END $EF$;
COMMIT;

START TRANSACTION;


DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325171950_AddCatalogEntities') THEN
    CREATE TABLE departments (
        id uuid NOT NULL,
        name character varying(100) NOT NULL,
        sort_order integer NOT NULL,
        is_active boolean NOT NULL DEFAULT TRUE,
        created_by uuid NOT NULL,
        updated_by uuid,
        created_at timestamp with time zone NOT NULL,
        updated_at timestamp with time zone NOT NULL,
        tenant_node_id uuid NOT NULL,
        root_tenant_id uuid NOT NULL,
        CONSTRAINT "PK_departments" PRIMARY KEY (id)
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325171950_AddCatalogEntities') THEN
    CREATE TABLE categories (
        id uuid NOT NULL,
        department_id uuid NOT NULL,
        name character varying(100) NOT NULL,
        sort_order integer NOT NULL,
        is_active boolean NOT NULL DEFAULT TRUE,
        created_by uuid NOT NULL,
        updated_by uuid,
        created_at timestamp with time zone NOT NULL,
        updated_at timestamp with time zone NOT NULL,
        tenant_node_id uuid NOT NULL,
        root_tenant_id uuid NOT NULL,
        CONSTRAINT "PK_categories" PRIMARY KEY (id),
        CONSTRAINT "FK_categories_departments_department_id" FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325171950_AddCatalogEntities') THEN
    CREATE TABLE products (
        id uuid NOT NULL,
        name character varying(200) NOT NULL,
        sku character varying(50) NOT NULL,
        upc character varying(50),
        category_id uuid NOT NULL,
        retail_price numeric(10,2) NOT NULL,
        cost_price numeric(10,2),
        description character varying(1000),
        is_active boolean NOT NULL DEFAULT TRUE,
        created_by uuid NOT NULL,
        updated_by uuid,
        created_at timestamp with time zone NOT NULL,
        updated_at timestamp with time zone NOT NULL,
        tenant_node_id uuid NOT NULL,
        root_tenant_id uuid NOT NULL,
        CONSTRAINT "PK_products" PRIMARY KEY (id),
        CONSTRAINT "FK_products_categories_category_id" FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325171950_AddCatalogEntities') THEN
    CREATE UNIQUE INDEX ix_categories_dept_name ON categories (department_id, name);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325171950_AddCatalogEntities') THEN
    CREATE UNIQUE INDEX ix_departments_tenant_name ON departments (root_tenant_id, name);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325171950_AddCatalogEntities') THEN
    CREATE INDEX "IX_products_category_id" ON products (category_id);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325171950_AddCatalogEntities') THEN
    CREATE UNIQUE INDEX ix_products_tenant_sku ON products (root_tenant_id, sku);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325171950_AddCatalogEntities') THEN
    CREATE INDEX ix_products_upc ON products (upc);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325171950_AddCatalogEntities') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260325171950_AddCatalogEntities', '8.0.25');
    END IF;
END $EF$;
COMMIT;

START TRANSACTION;


DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325172407_AddInventoryEntities') THEN
    CREATE TABLE stock_levels (
        id uuid NOT NULL,
        product_id uuid NOT NULL,
        quantity_on_hand integer NOT NULL,
        quantity_reserved integer NOT NULL,
        reorder_point integer,
        created_at timestamp with time zone NOT NULL,
        updated_at timestamp with time zone NOT NULL,
        tenant_node_id uuid NOT NULL,
        root_tenant_id uuid NOT NULL,
        CONSTRAINT "PK_stock_levels" PRIMARY KEY (id)
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325172407_AddInventoryEntities') THEN
    CREATE TABLE stock_transactions (
        id uuid NOT NULL,
        product_id uuid NOT NULL,
        transaction_type character varying(30) NOT NULL,
        quantity integer NOT NULL,
        running_balance integer NOT NULL,
        reference character varying(200),
        notes character varying(500),
        created_by uuid NOT NULL,
        updated_by uuid,
        created_at timestamp with time zone NOT NULL,
        updated_at timestamp with time zone NOT NULL,
        tenant_node_id uuid NOT NULL,
        root_tenant_id uuid NOT NULL,
        CONSTRAINT "PK_stock_transactions" PRIMARY KEY (id)
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325172407_AddInventoryEntities') THEN
    CREATE UNIQUE INDEX ix_stock_levels_tenant_product ON stock_levels (tenant_node_id, product_id);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325172407_AddInventoryEntities') THEN
    CREATE INDEX ix_stock_transactions_tenant_product_date ON stock_transactions (tenant_node_id, product_id, created_at);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325172407_AddInventoryEntities') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260325172407_AddInventoryEntities', '8.0.25');
    END IF;
END $EF$;
COMMIT;

START TRANSACTION;


DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325172907_AddSalesEntities') THEN
    CREATE TABLE sales (
        id uuid NOT NULL,
        transaction_number character varying(50) NOT NULL,
        transaction_date timestamp with time zone NOT NULL,
        status character varying(20) NOT NULL,
        subtotal numeric(10,2) NOT NULL,
        tax_rate numeric(5,4) NOT NULL,
        tax_amount numeric(10,2) NOT NULL,
        total_amount numeric(10,2) NOT NULL,
        tendered_amount numeric(10,2) NOT NULL,
        change_amount numeric(10,2) NOT NULL,
        cashier_id uuid,
        created_by uuid NOT NULL,
        updated_by uuid,
        created_at timestamp with time zone NOT NULL,
        updated_at timestamp with time zone NOT NULL,
        tenant_node_id uuid NOT NULL,
        root_tenant_id uuid NOT NULL,
        CONSTRAINT "PK_sales" PRIMARY KEY (id)
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325172907_AddSalesEntities') THEN
    CREATE TABLE sale_line_items (
        id uuid NOT NULL,
        sale_id uuid NOT NULL,
        product_id uuid NOT NULL,
        sku character varying(50) NOT NULL,
        product_name character varying(200) NOT NULL,
        quantity integer NOT NULL,
        unit_price numeric(10,2) NOT NULL,
        line_total numeric(10,2) NOT NULL,
        discount_amount numeric(10,2) NOT NULL,
        created_at timestamp with time zone NOT NULL,
        updated_at timestamp with time zone NOT NULL,
        CONSTRAINT "PK_sale_line_items" PRIMARY KEY (id),
        CONSTRAINT "FK_sale_line_items_sales_sale_id" FOREIGN KEY (sale_id) REFERENCES sales (id) ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325172907_AddSalesEntities') THEN
    CREATE TABLE sale_tenders (
        id uuid NOT NULL,
        sale_id uuid NOT NULL,
        tender_type character varying(20) NOT NULL,
        amount numeric(10,2) NOT NULL,
        payment_reference character varying(100),
        payment_details jsonb,
        created_at timestamp with time zone NOT NULL,
        updated_at timestamp with time zone NOT NULL,
        CONSTRAINT "PK_sale_tenders" PRIMARY KEY (id),
        CONSTRAINT "FK_sale_tenders_sales_sale_id" FOREIGN KEY (sale_id) REFERENCES sales (id) ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325172907_AddSalesEntities') THEN
    CREATE INDEX "IX_sale_line_items_sale_id" ON sale_line_items (sale_id);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325172907_AddSalesEntities') THEN
    CREATE INDEX "IX_sale_tenders_sale_id" ON sale_tenders (sale_id);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325172907_AddSalesEntities') THEN
    CREATE INDEX ix_sales_tenant_date ON sales (tenant_node_id, transaction_date);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325172907_AddSalesEntities') THEN
    CREATE UNIQUE INDEX ix_sales_transaction_number ON sales (transaction_number);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325172907_AddSalesEntities') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260325172907_AddSalesEntities', '8.0.25');
    END IF;
END $EF$;
COMMIT;

START TRANSACTION;


DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327140626_AddProductEnhancements') THEN
    DROP INDEX ix_products_upc;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327140626_AddProductEnhancements') THEN
    ALTER TABLE products ADD color character varying(50);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327140626_AddProductEnhancements') THEN
    ALTER TABLE products ADD map_date timestamp with time zone;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327140626_AddProductEnhancements') THEN
    ALTER TABLE products ADD size_grid_id uuid;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327140626_AddProductEnhancements') THEN
    ALTER TABLE products ADD supplier_id uuid;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327140626_AddProductEnhancements') THEN
    CREATE TABLE product_variants (
        id uuid NOT NULL,
        product_id uuid NOT NULL,
        dimension1_value character varying(20),
        dimension2_value character varying(20),
        upc character varying(50),
        is_active boolean NOT NULL DEFAULT TRUE,
        created_at timestamp with time zone NOT NULL,
        updated_at timestamp with time zone NOT NULL,
        tenant_node_id uuid NOT NULL,
        root_tenant_id uuid NOT NULL,
        CONSTRAINT "PK_product_variants" PRIMARY KEY (id),
        CONSTRAINT "FK_product_variants_products_product_id" FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327140626_AddProductEnhancements') THEN
    CREATE TABLE size_grids (
        id uuid NOT NULL,
        name character varying(200) NOT NULL,
        dimension1_label character varying(50) NOT NULL,
        dimension2_label character varying(50),
        is_active boolean NOT NULL DEFAULT TRUE,
        created_by uuid NOT NULL,
        updated_by uuid,
        created_at timestamp with time zone NOT NULL,
        updated_at timestamp with time zone NOT NULL,
        tenant_node_id uuid NOT NULL,
        root_tenant_id uuid NOT NULL,
        CONSTRAINT "PK_size_grids" PRIMARY KEY (id)
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327140626_AddProductEnhancements') THEN
    CREATE TABLE suppliers (
        id uuid NOT NULL,
        name character varying(200) NOT NULL,
        code character varying(20),
        is_active boolean NOT NULL DEFAULT TRUE,
        created_by uuid NOT NULL,
        updated_by uuid,
        created_at timestamp with time zone NOT NULL,
        updated_at timestamp with time zone NOT NULL,
        tenant_node_id uuid NOT NULL,
        root_tenant_id uuid NOT NULL,
        CONSTRAINT "PK_suppliers" PRIMARY KEY (id)
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327140626_AddProductEnhancements') THEN
    CREATE TABLE size_grid_values (
        id uuid NOT NULL,
        size_grid_id uuid NOT NULL,
        dimension integer NOT NULL,
        value character varying(20) NOT NULL,
        sort_order integer NOT NULL,
        created_at timestamp with time zone NOT NULL,
        updated_at timestamp with time zone NOT NULL,
        CONSTRAINT "PK_size_grid_values" PRIMARY KEY (id),
        CONSTRAINT "FK_size_grid_values_size_grids_size_grid_id" FOREIGN KEY (size_grid_id) REFERENCES size_grids (id) ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327140626_AddProductEnhancements') THEN
    EXECUTE 'INSERT INTO product_variants (id, tenant_node_id, root_tenant_id, product_id, dimension1_value, dimension2_value, upc, is_active, created_at, updated_at) SELECT gen_random_uuid(), tenant_node_id, root_tenant_id, id, NULL, NULL, upc, is_active, NOW(), NOW() FROM products WHERE upc IS NOT NULL';
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327140626_AddProductEnhancements') THEN
    ALTER TABLE products DROP COLUMN upc;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327140626_AddProductEnhancements') THEN
    CREATE INDEX "IX_products_size_grid_id" ON products (size_grid_id);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327140626_AddProductEnhancements') THEN
    CREATE INDEX "IX_products_supplier_id" ON products (supplier_id);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327140626_AddProductEnhancements') THEN
    CREATE UNIQUE INDEX ix_product_variants_product_dims ON product_variants (product_id, dimension1_value, dimension2_value);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327140626_AddProductEnhancements') THEN
    CREATE UNIQUE INDEX ix_product_variants_tenant_upc ON product_variants (root_tenant_id, upc) WHERE upc IS NOT NULL;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327140626_AddProductEnhancements') THEN
    CREATE INDEX ix_product_variants_upc ON product_variants (upc);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327140626_AddProductEnhancements') THEN
    CREATE INDEX ix_size_grid_values_order ON size_grid_values (size_grid_id, dimension, sort_order);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327140626_AddProductEnhancements') THEN
    CREATE UNIQUE INDEX ix_size_grid_values_unique ON size_grid_values (size_grid_id, dimension, value);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327140626_AddProductEnhancements') THEN
    CREATE UNIQUE INDEX ix_size_grids_tenant_name ON size_grids (root_tenant_id, name);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327140626_AddProductEnhancements') THEN
    CREATE UNIQUE INDEX ix_suppliers_tenant_code ON suppliers (root_tenant_id, code) WHERE code IS NOT NULL;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327140626_AddProductEnhancements') THEN
    CREATE UNIQUE INDEX ix_suppliers_tenant_name ON suppliers (root_tenant_id, name);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327140626_AddProductEnhancements') THEN
    ALTER TABLE products ADD CONSTRAINT "FK_products_size_grids_size_grid_id" FOREIGN KEY (size_grid_id) REFERENCES size_grids (id) ON DELETE RESTRICT;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327140626_AddProductEnhancements') THEN
    ALTER TABLE products ADD CONSTRAINT "FK_products_suppliers_supplier_id" FOREIGN KEY (supplier_id) REFERENCES suppliers (id) ON DELETE RESTRICT;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327140626_AddProductEnhancements') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260327140626_AddProductEnhancements', '8.0.25');
    END IF;
END $EF$;
COMMIT;

START TRANSACTION;


DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327141735_AddVariantToInventoryAndSales') THEN
    ALTER TABLE stock_transactions ADD product_variant_id uuid;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327141735_AddVariantToInventoryAndSales') THEN
    ALTER TABLE stock_levels ADD product_variant_id uuid;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327141735_AddVariantToInventoryAndSales') THEN
    ALTER TABLE sale_line_items ADD product_variant_id uuid;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327141735_AddVariantToInventoryAndSales') THEN
    ALTER TABLE sale_line_items ADD variant_description character varying(100);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327141735_AddVariantToInventoryAndSales') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260327141735_AddVariantToInventoryAndSales', '8.0.25');
    END IF;
END $EF$;
COMMIT;

START TRANSACTION;


DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327144645_AddStyleToProduct') THEN
    ALTER TABLE products ADD style character varying(100);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260327144645_AddStyleToProduct') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260327144645_AddStyleToProduct', '8.0.25');
    END IF;
END $EF$;
COMMIT;

