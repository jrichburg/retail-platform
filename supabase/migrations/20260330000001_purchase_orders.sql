START TRANSACTION;

CREATE TABLE purchase_orders (
    id uuid NOT NULL,
    order_number character varying(50) NOT NULL,
    supplier_id uuid NOT NULL,
    supplier_name character varying(200) NOT NULL,
    status character varying(30) NOT NULL,
    notes character varying(500),
    expected_date timestamp with time zone,
    total_cost numeric(10,2) NOT NULL,
    created_by uuid NOT NULL,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    tenant_node_id uuid NOT NULL,
    root_tenant_id uuid NOT NULL,
    CONSTRAINT "PK_purchase_orders" PRIMARY KEY (id)
);

CREATE TABLE purchase_order_lines (
    id uuid NOT NULL,
    purchase_order_id uuid NOT NULL,
    product_id uuid NOT NULL,
    product_variant_id uuid,
    product_name character varying(200) NOT NULL,
    sku character varying(50) NOT NULL,
    variant_description character varying(100),
    quantity_ordered integer NOT NULL,
    quantity_received integer NOT NULL,
    unit_cost numeric(10,2) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_purchase_order_lines" PRIMARY KEY (id),
    CONSTRAINT "FK_purchase_order_lines_purchase_orders_purchase_order_id" FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders (id) ON DELETE CASCADE
);

CREATE INDEX ix_purchase_order_lines_order ON purchase_order_lines (purchase_order_id);

CREATE UNIQUE INDEX ix_purchase_orders_number ON purchase_orders (order_number);

CREATE INDEX ix_purchase_orders_supplier ON purchase_orders (supplier_id);

CREATE INDEX ix_purchase_orders_tenant_status ON purchase_orders (tenant_node_id, status);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260330135755_AddPurchaseOrders', '8.0.25');

COMMIT;

