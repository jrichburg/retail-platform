# Backend Modules

## Auth Module
**Status**: Complete
**Entities**: AppUser, Role, Permission, AppUserRole, RolePermission
**Endpoints**: `GET /api/v1/auth/me`, `POST /api/v1/auth/sync`
**Seed data**: 3 roles (owner, manager, cashier), 18 permissions
**Notes**: Supabase JWT verification in middleware. SyncUser creates local user on first login and assigns default cashier role.

## Tenants Module
**Status**: Complete
**Entities**: TenantNode (ltree hierarchy), TenantSetting (JSONB + lock)
**Endpoints**: `GET/POST/PUT /api/v1/tenants/stores`, `GET /api/v1/tenants/tree`, `PUT /api/v1/tenants/settings`
**Seed data**: 1 root tenant "Demo Retailer" + 1 store "Main Street Store"
**Notes**: Single-level hierarchy for Phase 1 (root → stores). Settings support inheritance with lock mechanism.

## Catalog Module
**Status**: Feature-rich (largest module)
**Entities**: Product, ProductVariant, Category, Department, Supplier, SizeGrid, SizeGridValue

### Product fields
Name, Sku, CategoryId, SupplierId, Style, Color, MapDate (MAP expiry), SizeGridId, RetailPrice, CostPrice, Description, IsActive

### Product Variants
Each Product can have variants (size/width combos). ProductVariant: Dimension1Value, Dimension2Value, Upc. UPC lives on variants, not products.

### Size Grids
Reusable templates: "US Footwear 5-14" (2D: Size × Width), "Apparel S-3XL" (1D: Size only). SizeGridValue stores dimension (1 or 2), value, and sort order.

### Endpoints
- Products: `GET/POST/PUT /api/v1/catalog/products`, `GET /lookup?sku=X&upc=Y`
- Departments: `GET/POST /api/v1/catalog/departments`, `POST /{id}/categories`
- Suppliers: `GET/POST/PUT /api/v1/catalog/suppliers`
- Size Grids: `GET/POST/PUT /api/v1/catalog/size-grids`

### Lookup (Dapper)
`LookupProductQueryHandler` uses Dapper for fast POS lookups. Joins `product_variants` for UPC resolution. Returns `MatchedVariantId`, `MatchedDimension1Value`, `MatchedDimension2Value`.

## Inventory Module
**Status**: Feature-rich

### Stock Tracking
- `StockLevel`: current quantity per product/variant per store
- `StockTransaction`: append-only ledger (received, adjustment, sale, return)
- Existing endpoints: `GET /api/v1/inventory/stock`, `POST /receive`, `POST /adjust`

### Receiving (Phase A — Blind Receive)
- `ReceiveDocument` + `ReceiveDocumentLine`: multi-line receiving documents
- Handler generates doc number (RCV-YYYYMMDD-NNN), upserts stock per line, creates transactions
- Endpoints: `GET/POST /api/v1/inventory/receiving`, `GET /{id}`

### Purchase Orders (Phase B)
- `PurchaseOrder` + `PurchaseOrderLine`: draft → submitted → partially_received → fully_received → closed
- Lines track QuantityOrdered and QuantityReceived
- Endpoints: `GET/POST/PUT /api/v1/inventory/purchase-orders`, `POST /{id}/submit`, `POST /{id}/close`

### Receiving Against PO (Phase C)
- `ReceiveAgainstPOCommand`: validates PO status, creates receive document linked to PO, updates PO line received quantities, auto-transitions PO status
- Endpoint: `POST /api/v1/inventory/receiving/against-po`

## Sales Module
**Status**: Core complete
**Entities**: Sale, SaleLineItem, SaleTender

### Transaction Flow
1. CreateSaleCommand receives items + tenders (+ optional CustomerId)
2. Handler looks up products, calculates tax from tenant settings, validates tender amounts
3. Processes card payments via IPaymentService (Fullsteam) if tender type is "card"
4. Creates Sale + LineItems + Tenders, decrements inventory via MediatR DecrementStockCommand
5. Supports offline idempotency via ClientTransactionId

### Endpoints
`GET/POST /api/v1/sales`, `GET /{id}`, `POST /{id}/void`

### Fields on Sale
TransactionNumber (auto-generated), TransactionDate, Status, Subtotal, TaxRate, TaxAmount, TotalAmount, TenderedAmount, ChangeAmount, CustomerId, CustomerName, CashierId

## Customers Module
**Status**: Complete (basic CRUD)
**Entity**: Customer (FirstName, LastName, Email, Phone, Street, City, State, Zip, Notes, IsActive)
**Endpoints**: `GET/POST/PUT /api/v1/customers`, `GET /{id}`
**Sales linkage**: Sale has optional CustomerId + CustomerName

## Transfers Module
**Status**: Complete
**Entities**: TransferDocument (TenantScopedEntity + IAuditableEntity), TransferDocumentLine (BaseEntity)
**Endpoints**: `GET/POST /api/v1/inventory/transfers`, `GET /{id}`, `POST /{id}/submit`, `POST /{id}/complete`, `POST /{id}/cancel`

### Workflow
`draft` → `in_transit` → `completed` (or `cancelled` from draft/in_transit)

| Status | Stock Effect |
|--------|-------------|
| draft | None — lines recorded only |
| in_transit | Source stock decremented, `transfer_out` transactions created |
| completed | Destination stock upserted, `transfer_in` transactions created |
| cancelled (from in_transit) | Source stock restored, `transfer_cancelled` transactions created |

### Document Number
`TRF-YYYYMMDD-NNN` — sequential per source store per day

### Cross-Store Stock Access
Both stores share the same `RootTenantId`, so the global EF query filter doesn't block cross-store access. Handlers use explicit `TenantNodeId` values from the document (not `ITenantContext`) for all stock operations.

### Notes
- `TransferDocument.TenantNodeId` = source store (for scoping and list queries)
- `SourceTenantNodeId` mirrors `TenantNodeId` explicitly for clarity
- Submit validates stock availability before any changes; returns per-item error messages
- `Modules.Inventory.csproj` references `Modules.Tenants` for `TenantNode` store name resolution

## Platform Module
**Status**: Complete
**Entities**: PlatformAdmin (BaseEntity — NOT tenant-scoped)
**Endpoints**: `GET/POST /api/v1/platform/tenants`, `GET /{id}`, `PUT /{id}/deactivate`

### Authorization
`[RequirePlatformAdmin]` attribute — custom `IAsyncAuthorizationFilter` that checks the JWT `sub` claim against the `platform_admins` table. Returns 403 if not found.

### Tenant Resolution Bypass
`TenantResolutionMiddleware` skips `/api/v1/platform/*` paths (same pattern as `/api/v1/auth/*`).

### CreateTenant
Creates root `TenantNode` + default store + default `TenantSettings` (tax_rate, currency, receipt_footer) + initial owner `AppUser` in a single transaction. All queries use `IgnoreQueryFilters()` since this is cross-tenant.

### Bootstrapping
`PlatformSeeder` (in `src/Api/Seeds/`) creates a demo platform admin record on startup in Development. Production: manual DB insert or promote via admin tooling.

## Auth Module — Additional Endpoints
**Status**: Extended (beyond original)
**New endpoints**: `GET /api/v1/auth/users`, `POST /api/v1/auth/users`, `PUT /api/v1/auth/users/{id}`, `PUT /api/v1/auth/users/{id}/role`, `GET /api/v1/auth/roles`
**New DTOs**: `AppUserListDto`
**New Commands**: `CreateUserCommand`, `UpdateUserCommand`, `AssignRoleCommand`
**New Queries**: `GetUsersQuery`, `GetRolesQuery`

## Uniforms Module
**Status**: Stub scaffolded — domain entities + persistence config in place, no endpoints yet
**Entities**: WorkOrder, WorkOrderLine
**Tables**: `work_orders`, `work_order_lines` (migrated)
**Planned**: Work order CRUD, group orders, AR integration

## AccountsReceivable Module
**Status**: Core complete
**Entities**: Invoice (TenantScopedEntity), InvoiceLineItem (BaseEntity), InvoicePayment (BaseEntity)
**Tables**: `invoices`, `invoice_line_items`, `invoice_payments` (migrated)
**Endpoints**: Accounts receivable CRUD — invoice list/detail, create invoice, record payments, customer balance

## Stub Modules (not yet implemented)
- **ECommerce**: Storefront configuration, online orders
- **Reporting**: Read models, report generation
- **Notifications**: Email (SendGrid), SMS, in-app
- **Settings**: Tenant config UI with inheritance visualization
