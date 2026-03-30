# Database

## Connection

**Provider**: Supabase (hosted PostgreSQL 16)
**Project**: jaqibimumhdtbnnydaju
**Region**: US East 1 (North Virginia)
**URL**: https://jaqibimumhdtbnnydaju.supabase.co
**Direct host**: db.jaqibimumhdtbnnydaju.supabase.co (IPv6 only — requires Supabase CLI for access)

### Connection Issue
The direct connection is IPv6-only. Local network doesn't support IPv6. The Supabase pooler (`aws-0-us-east-1.pooler.supabase.com`) returns "Tenant or user not found" — likely needs time to propagate for new projects. **Workaround**: Use `supabase db push` via CLI to apply migrations, or enable the IPv4 add-on ($4/month).

### Config Files (gitignored)
- `src/Api/appsettings.Development.json` — DB connection string, Supabase URL, JWT secret
- `frontend/backoffice/.env` — VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

## Schema

### Tables (17 total)

**Core**:
- `__EFMigrationsHistory` — EF Core migration tracking
- `tenant_nodes` — Hierarchy with ltree paths
- `tenant_settings` — JSONB settings with lock support

**Auth**:
- `app_users` — Local user records linked to Supabase Auth
- `roles` — owner, manager, cashier
- `permissions` — 18 module-scoped permissions
- `app_user_roles` — User ↔ Role ↔ TenantNode join
- `role_permissions` — Role ↔ Permission join

**Catalog**:
- `departments` — Top-level grouping (Men's Footwear, Apparel, etc.)
- `categories` — Under departments (Running, Casual, Tops, etc.)
- `products` — Style-level (name, SKU, supplier, style, color, price, MAP date, size grid)
- `product_variants` — Size/width combos with UPCs
- `suppliers` — Vendor/brand directory
- `size_grids` — Reusable size templates
- `size_grid_values` — Dimension values (sizes, widths)

**Inventory**:
- `stock_levels` — Current qty per product/variant per store
- `stock_transactions` — Append-only ledger
- `receive_documents` — Multi-line receiving documents
- `receive_document_lines` — Lines on receive documents
- `purchase_orders` — PO header with status workflow
- `purchase_order_lines` — PO lines with ordered/received quantities

**Sales**:
- `sales` — Transaction header (number, date, totals, customer, cashier)
- `sale_line_items` — Line items with product snapshots
- `sale_tenders` — Payment methods (cash, card with Fullsteam details)

**Customers**:
- `customers` — Customer directory

## Migrations (11)

| # | Name | Date | Description |
|---|------|------|-------------|
| 1 | InitialCreate | 2026-03-24 | tenant_nodes, tenant_settings, ltree extension |
| 2 | AddAuthEntities | 2026-03-25 | app_users, roles, permissions, joins |
| 3 | AddCatalogEntities | 2026-03-25 | departments, categories, products |
| 4 | AddInventoryEntities | 2026-03-25 | stock_levels, stock_transactions |
| 5 | AddSalesEntities | 2026-03-25 | sales, sale_line_items, sale_tenders |
| 6 | AddProductEnhancements | 2026-03-27 | suppliers, size_grids, size_grid_values, product_variants; add supplier/style/color/map_date/size_grid to products; remove UPC from products |
| 7 | AddVariantToInventoryAndSales | 2026-03-27 | product_variant_id on stock_levels, stock_transactions, sale_line_items |
| 8 | AddStyleToProduct | 2026-03-27 | style column on products |
| 9 | AddReceiveDocuments | 2026-03-30 | receive_documents, receive_document_lines |
| 10 | AddPurchaseOrders | 2026-03-30 | purchase_orders, purchase_order_lines |
| 11 | AddCustomers | 2026-03-30 | customers table; customer_id + customer_name on sales |

## Supabase Migrations

Located in `/supabase/migrations/`. Applied via `supabase db push --yes`.

When generating new migrations:
```bash
# Generate EF migration
dotnet ef migrations add {Name} --project src/Infrastructure --startup-project src/Api --output-dir Persistence/Migrations

# Generate SQL for only the new migration
dotnet ef migrations script {PreviousMigration} {NewMigration} --project src/Infrastructure --startup-project src/Api --output /tmp/migration.sql

# Strip BOM and push
sed -i '' '1s/^\xEF\xBB\xBF//' /tmp/migration.sql
cp /tmp/migration.sql supabase/migrations/{timestamp}_{name}.sql
export SUPABASE_DB_PASSWORD='...' && supabase db push --yes
```

**Known issue**: EF Core idempotent scripts use `DO $EF$ ... END $EF$` blocks. If raw SQL inside these blocks contains semicolons, it breaks PL/pgSQL. Workaround: use `EXECUTE '...'` wrapper for inline SQL, or generate non-idempotent scripts for specific migration ranges.

## Naming Conventions
- Tables: `snake_case` (e.g., `purchase_order_lines`)
- Columns: `snake_case` (e.g., `tenant_node_id`, `created_at`)
- Indexes: `ix_{table}_{columns}` (e.g., `ix_products_tenant_sku`)
- Configured in EF Core `IEntityTypeConfiguration<T>` classes per module
