# Session Notes

Last updated: 2026-04-01

## Session 1 Summary (2026-03-25 through 2026-03-31)

Built the entire retail platform from scratch in one session. Everything is committed and pushed to GitHub.

See original session 1 notes in git history (commit 6cc0439).

## Session 2 Summary (2026-04-01)

Built three major features on top of the Phase 1 foundation:

### 1. Platform SuperAdmin Module (`src/Modules/Platform/`)
- `PlatformAdmin` entity — non-tenant-scoped, identifies platform operators by Supabase user ID
- `[RequirePlatformAdmin]` authorization attribute — custom `IAsyncAuthorizationFilter` checking JWT `sub` against `platform_admins` table
- `TenantResolutionMiddleware` updated to bypass `/api/v1/platform/*`
- **Endpoints**: `GET/POST /api/v1/platform/tenants`, `GET /{id}`, `PUT /{id}/deactivate`
- `CreateTenantCommand` — all-in-one: root TenantNode + default store + settings + initial owner AppUser in one transaction
- `PlatformSeeder` bootstraps a demo admin on startup
- Migration: `AddPlatformAdmins` (`platform_admins` table)
- **Frontend**: `/platform/tenants` (list), `/platform/tenants/new` (create form), `/platform/tenants/:id` (detail with stores + users + deactivate)
- Sidebar "Platform" section with amber accent

### 2. Inter-Store Transfer Module (within `src/Modules/Inventory/`)
- `TransferDocument` + `TransferDocumentLine` entities
- Full state machine: `draft` → `in_transit` → `completed` (or `cancelled`)
- Stock validation before submit — per-item error messages with available quantities
- `transfer_out` / `transfer_in` / `transfer_cancelled` transaction types for full audit trail
- Cross-store stock access works because both stores share `RootTenantId` (no `IgnoreQueryFilters()` needed for stock, but used for `TenantNode` name resolution)
- `Modules.Inventory.csproj` now references `Modules.Tenants` for store name lookups
- Migration: `AddTransferDocuments` (`transfer_documents` + `transfer_document_lines`)
- **Frontend**: `/inventory/transfers` (list with status tabs), `/inventory/transfers/new` (destination picker + scan/manual add), `/inventory/transfers/:id` (detail with inline confirmation dialogs)

### 3. Additional modules completed (built earlier in session, now documented):
- **Uniforms module**: Work order scaffolding (entities + persistence), no endpoints yet
- **AccountsReceivable module**: Invoice CRUD + payment recording + customer balance
- **Auth module extensions**: User management endpoints (create, update, assign role, list)
- **Work Orders frontend**: Full CRUD pages
- **AR frontend**: Dashboard + invoice list/detail/create

### Current State

**Working:**
- All code compiles (`dotnet build` — 0 errors)
- Frontend builds and deploys to Vercel with demo mode
- GitHub: `https://github.com/jrichburg/retail-platform`
- Vercel live demo: `https://frontend-eight-alpha-66.vercel.app`
- All migrations generated (not yet applied to Supabase — API still not connected to cloud DB)

**NOT working yet:**
- .NET API cannot connect to Supabase (IPv6-only issue, local dev)
- No API hosting (Railway vs Azure decision still pending)
- No real Supabase Auth users (demo mode only)

### Decisions Made This Session
- Platform admins are a separate non-tenant-scoped entity (not a role within tenant RBAC)
- Transfer document number prefix: `TRF-YYYYMMDD-NNN`
- Transfer submit decrements stock atomically (no separate "reserved" step)
- CreateTenant is all-in-one (tenant + store + settings + owner) for simplest onboarding

## For Next Session — Start Here

### Priority 1: Get the API Running
Same blocker as session 1. Options:
1. **Enable Supabase IPv4 add-on** ($4/month) → direct connection
2. **Deploy API to Railway** (~$5/month) → cloud-to-cloud connection

Once live: apply all pending migrations (`supabase db push` or `dotnet ef database update`), create Supabase Auth users, test end-to-end.

### Priority 2: Apply Pending Migrations
New migrations since last Supabase push:
- `20260331135444_AddWorkOrders`
- `20260331141024_AddAccountsReceivable`
- `20260401134947_AddPlatformAdmins`
- `20260401154002_AddTransferDocuments`

Run: `supabase db push` (or via Railway once API is deployed)

### Priority 3: e-Commerce Storefront
Currently a stub. Product catalog browsing, detail pages, cart + checkout.

### Priority 4: Complete Uniforms Module
Work order endpoints, group orders, AR integration for uniform accounts.

### Priority 5: Reporting
Read models, dashboard charts with real data.

## Credentials (all in gitignored files)

| What | Where |
|------|-------|
| Supabase URL | `https://jaqibimumhdtbnnydaju.supabase.co` |
| Supabase anon key | `frontend/backoffice/.env` |
| Supabase JWT secret | `src/Api/appsettings.Development.json` |
| DB password | `src/Api/appsettings.Development.json` |
| GitHub repo | `https://github.com/jrichburg/retail-platform` |
| Vercel live demo | `https://frontend-eight-alpha-66.vercel.app` |

## Key Files Reference

| Purpose | File |
|---------|------|
| API entry + DI | `src/Api/Program.cs` |
| DB context + tenant filter | `src/Infrastructure/Persistence/AppDbContext.cs` |
| Tenant middleware | `src/Api/Middleware/TenantResolutionMiddleware.cs` |
| Platform admin auth | `src/Modules/Platform/Application/Authorization/RequirePlatformAdminAttribute.cs` |
| Transfer state machine (submit) | `src/Modules/Inventory/Application/Commands/SubmitTransfer/SubmitTransferCommandHandler.cs` |
| Transfer state machine (complete) | `src/Modules/Inventory/Application/Commands/CompleteTransfer/CompleteTransferCommandHandler.cs` |
| Sale handler | `src/Modules/Sales/Application/Commands/CreateSale/CreateSaleCommandHandler.cs` |
| Receive handler | `src/Modules/Inventory/Application/Commands/CreateReceiveDocument/CreateReceiveDocumentCommandHandler.cs` |
| Frontend demo data | `frontend/backoffice/src/lib/demo-data.ts` |
| Frontend API client | `frontend/backoffice/src/lib/api.ts` |
| Tenant store (stores list) | `frontend/backoffice/src/stores/tenant-store.ts` |
| Full architecture docs | `.claude/architecture.md` |
| Backend module docs | `.claude/backend-modules.md` |
| Frontend docs | `.claude/frontend.md` |
| Database docs | `.claude/database.md` |
