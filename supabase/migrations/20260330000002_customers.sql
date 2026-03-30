START TRANSACTION;

ALTER TABLE sales ADD customer_id uuid;

ALTER TABLE sales ADD customer_name character varying(200);

CREATE TABLE customers (
    id uuid NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(255),
    phone character varying(20),
    street character varying(200),
    city character varying(100),
    state character varying(50),
    zip character varying(20),
    notes character varying(1000),
    is_active boolean NOT NULL DEFAULT TRUE,
    created_by uuid NOT NULL,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    tenant_node_id uuid NOT NULL,
    root_tenant_id uuid NOT NULL,
    CONSTRAINT "PK_customers" PRIMARY KEY (id)
);

CREATE INDEX ix_customers_phone ON customers (phone);

CREATE UNIQUE INDEX ix_customers_tenant_email ON customers (root_tenant_id, email) WHERE email IS NOT NULL;

CREATE INDEX ix_customers_tenant_lastname ON customers (root_tenant_id, last_name);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260330143851_AddCustomers', '8.0.25');

COMMIT;

