# Frontend

## Monorepo Structure

```
/frontend/
  package.json              ← npm workspaces root
  vercel.json               ← Vercel build config (builds backoffice)
  /backoffice/              ← React 18 + Vite + Tailwind (port 3000)
  /pos/                     ← React Native (Expo) — iOS first
  /ecommerce/               ← Next.js 14 App Router (port 3002, stub)
  /shared-types/            ← @retail-platform/shared-types (Zod + TS)
  /shared-web-ui/           ← Shared web components (stub)
  /shared-native-ui/        ← Shared native components (stub)
```

## Shared Types (`/shared-types/src/`)

Zod schemas + TypeScript interfaces shared across all frontends:
- `api.ts` — PaginatedRequest, PaginatedResponse, ApiError
- `auth.ts` — LoginRequest, AuthUser
- `tenant.ts` — TenantNode, TenantSetting, NodeType
- `catalog.ts` — Product, ProductVariant, Supplier, SizeGrid, Department, Category, CreateProductSchema
- `inventory.ts` — StockLevel, StockTransaction, ReceiveDocument, PurchaseOrder, PurchaseOrderLine
- `sales.ts` — Sale, SaleLineItem, SaleTender, CreateSaleSchema
- `customer.ts` — Customer, CreateCustomerSchema
- `transfer.ts` — TransferDocument, TransferDocumentDetail, TransferDocumentLine, TransferStatus, CreateTransferRequest
- `work-order.ts` — WorkOrder, WorkOrderDetail, WorkOrderLine
- `accounts-receivable.ts` — Invoice, InvoiceDetail, InvoiceLineItem, InvoicePayment

## Back Office App

### Design System — "Warm Industrial"
- **Typography**: DM Sans (body), Instrument Serif (headings), JetBrains Mono (codes/SKUs)
- **Colors**: Deep slate-925 sidebar, warm amber accents, emerald success, red danger
- **Shadows**: soft/card/elevated hierarchy
- **CSS classes** (defined in `index.css`):
  - `.btn-primary`, `.btn-secondary`, `.btn-ghost`
  - `.input-field` (amber focus ring)
  - `.card` (rounded-xl, shadow-card)
  - `.badge-success`, `.badge-danger`, `.badge-neutral`
  - `.table-header`, `.table-cell`
  - `.page-title` (font-display text-2xl)
  - `.section-label` (xs uppercase tracking)

### Demo Mode
When `VITE_DEMO_MODE=true` or no Supabase URL configured, the app uses hardcoded demo data from `lib/demo-data.ts`. The `isDemo` flag (from `lib/api.ts`) is checked in every hook.

Demo data includes: 1 user, 3 stores, 6 suppliers, 3 size grids, 8 products with variants, 6 stock levels, 3 sales, 2 receive documents, 3 purchase orders, 5 customers.

### Pages and Routes

| Route | Page | Description |
|-------|------|-------------|
| `/login` | LoginPage | Split-panel login with Supabase auth |
| `/` | DashboardPage | KPI cards, recent transactions, inventory snapshot, POS launch link |
| `/catalog/products` | ProductsPage | Filter-first: supplier/category/search filters, then results table |
| `/catalog/products/new` | ProductFormPage | Create product with supplier, style, color, size grid, UPC matrix |
| `/catalog/products/:id/edit` | ProductFormPage | Edit mode |
| `/catalog/departments` | DepartmentsPage | Card-based department/category tree |
| `/catalog/suppliers` | SuppliersPage | Supplier directory with inline create |
| `/catalog/size-grids` | SizeGridsPage | Size grid cards with dimension previews |
| `/catalog/size-grids/new` | SizeGridFormPage | Create grid with dynamic value management |
| `/catalog/size-grids/:id/edit` | SizeGridFormPage | Edit mode |
| `/inventory` | StockLevelsPage | Stock levels table with low-stock alerts |
| `/inventory/receive` | ReceiveDocumentPage | Multi-line scan/manual receiving |
| `/inventory/receiving` | ReceiveDocumentsListPage | Past receiving documents |
| `/inventory/receiving/:id` | ReceiveDocumentDetailPage | Read-only receive detail |
| `/inventory/purchase-orders` | PurchaseOrdersPage | PO list with status filter tabs |
| `/inventory/purchase-orders/new` | PurchaseOrderFormPage | Create PO with line items |
| `/inventory/purchase-orders/:id` | PurchaseOrderDetailPage | PO detail with ordered/received/remaining |
| `/inventory/purchase-orders/:id/edit` | PurchaseOrderFormPage | Edit draft PO |
| `/inventory/purchase-orders/:id/receive` | ReceiveAgainstPOPage | Receive against PO with scan |
| `/inventory/transfers` | TransfersPage | Transfer list with status filter tabs |
| `/inventory/transfers/new` | TransferFormPage | Create transfer — destination picker, scan/manual add |
| `/inventory/transfers/:id` | TransferDetailPage | Transfer detail with Submit/Complete/Cancel actions |
| `/sales` | SalesPage | Transaction list |
| `/sales/:id` | SaleDetailPage | Transaction detail with line items + tenders |
| `/customers` | CustomersPage | Customer directory with search |
| `/customers/new` | CustomerFormPage | Create customer |
| `/customers/:id` | CustomerDetailPage | Customer detail + purchase history |
| `/customers/:id/edit` | CustomerFormPage | Edit mode |
| `/work-orders` | WorkOrdersPage | Work order list |
| `/work-orders/new` | WorkOrderFormPage | Create work order |
| `/work-orders/:id` | WorkOrderDetailPage | Work order detail |
| `/ar` | ArDashboardPage | Accounts receivable overview |
| `/ar/invoices` | InvoicesPage | Invoice list |
| `/ar/invoices/new` | InvoiceFormPage | Create invoice |
| `/ar/invoices/:id` | InvoiceDetailPage | Invoice detail + payment recording |
| `/settings` | SettingsPage | Store configuration |
| `/settings/users` | UsersPage | User management |
| `/platform/tenants` | TenantsPage | Platform admin — all tenants list |
| `/platform/tenants/new` | CreateTenantPage | Platform admin — create tenant + initial owner |
| `/platform/tenants/:id` | TenantDetailPage | Platform admin — tenant detail, stores, users |
| `/pos` | PosTransactionPage | Full-screen POS terminal |
| `/pos/tender` | PosTenderPage | Cash/card tender with keypad |
| `/pos/receipt` | PosReceiptPage | Sale complete confirmation |

### Hooks (`/hooks/`)
- `use-products.ts` — useProducts, useProduct, useCreateProduct, useUpdateProduct
- `use-departments.ts` — useDepartments, useCreateDepartment, useCreateCategory
- `use-suppliers.ts` — useSuppliers, useCreateSupplier
- `use-size-grids.ts` — useSizeGrids, useSizeGrid, useCreateSizeGrid
- `use-inventory.ts` — useStockLevels, useReceiveStock
- `use-receiving.ts` — useReceiveDocuments, useReceiveDocument, useCreateReceiveDocument, useReceiveAgainstPO
- `use-purchase-orders.ts` — usePurchaseOrders, usePurchaseOrder, useCreatePurchaseOrder, useUpdatePurchaseOrder, useSubmitPurchaseOrder, useClosePurchaseOrder
- `use-sales.ts` — useSales, useSale
- `use-customers.ts` — useCustomers, useCustomer, useCreateCustomer, useUpdateCustomer
- `use-work-orders.ts` — useWorkOrders, useWorkOrder, useCreateWorkOrder, useUpdateWorkOrder
- `use-accounts-receivable.ts` — useInvoices, useInvoice, useCreateInvoice, useCustomerBalance
- `use-transfers.ts` — useTransfers, useTransfer, useCreateTransfer, useSubmitTransfer, useCompleteTransfer, useCancelTransfer
- `use-users.ts` — useUsers, useCreateUser, useUpdateUser, useAssignRole
- `use-settings.ts` — useSettings, useUpdateSetting
- `use-platform.ts` — useTenants, useTenantDetail, useCreateTenant, useDeactivateTenant

### Zustand Stores (`/stores/`)
- `auth-store.ts` — user, isAuthenticated, login/logout/syncUser/loadUser
- `tenant-store.ts` — nodes, currentStoreId, loadTree/selectStore
- `receive-document-store.ts` — multi-line receiving accumulator (addLine, updateQuantity, removeLine)
- `transfer-document-store.ts` — multi-line transfer accumulator with destinationTenantNodeId (addLine, updateQuantity, removeLine, setDestination)

## POS App (React Native)

### Screens (file-based routing via Expo Router)
- `(auth)/login` — Email/password login
- `(tabs)/index` — Transaction screen with SQLite product lookup
- `(tabs)/history` — Sales history
- `(tabs)/settings` — Account, sync, logout
- `tender` — Cash tender modal with keypad
- `receipt` — Sale complete confirmation

### Offline Architecture
- `expo-sqlite` stores local product cache + transaction queue
- `sync.ts` pulls catalog on login, flushes pending transactions periodically
- Transactions queue locally when API is unreachable, sync on reconnect

### Web Preview
A browser-friendly POS preview exists at `/pos` in the Back Office app for UI review. Uses demo data, not native features.

## Vercel Deployment

```json
// frontend/vercel.json
{
  "buildCommand": "VITE_DEMO_MODE=true npm run build:backoffice",
  "outputDirectory": "backoffice/dist",
  "installCommand": "npm install"
}
```

Live demo: https://frontend-eight-alpha-66.vercel.app
