START TRANSACTION;

CREATE TABLE receive_documents (
    id uuid NOT NULL,
    document_number character varying(50) NOT NULL,
    purchase_order_id uuid,
    status character varying(30) NOT NULL,
    notes character varying(500),
    created_by uuid NOT NULL,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    tenant_node_id uuid NOT NULL,
    root_tenant_id uuid NOT NULL,
    CONSTRAINT "PK_receive_documents" PRIMARY KEY (id)
);

CREATE TABLE receive_document_lines (
    id uuid NOT NULL,
    receive_document_id uuid NOT NULL,
    product_id uuid NOT NULL,
    product_variant_id uuid,
    product_name character varying(200) NOT NULL,
    sku character varying(50) NOT NULL,
    upc character varying(50),
    variant_description character varying(100),
    quantity integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_receive_document_lines" PRIMARY KEY (id),
    CONSTRAINT "FK_receive_document_lines_receive_documents_receive_document_id" FOREIGN KEY (receive_document_id) REFERENCES receive_documents (id) ON DELETE CASCADE
);

CREATE INDEX ix_receive_document_lines_document ON receive_document_lines (receive_document_id);

CREATE UNIQUE INDEX ix_receive_documents_number ON receive_documents (document_number);

CREATE INDEX ix_receive_documents_tenant_date ON receive_documents (tenant_node_id, created_at);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260330132936_AddReceiveDocuments', '8.0.25');

COMMIT;

