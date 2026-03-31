# Session Notes

Last updated: 2026-03-31

## Session 1 Summary (2026-03-25 through 2026-03-31)

Built the entire retail platform from scratch in one session. Everything is committed and pushed to GitHub.

### What Was Built

**Backend (269 C# files, 11 migrations)**
1. Project scaffolding — .NET 8 solution, 16 projects, modular monolith
2. SharedKernel — CQRS abstractions, Result<T>, ValidationBehavior, tenant/user context
3. Infrastructure — AppDbContext with global tenant filters, Dapper, Redis, Fullsteam payments
4. Auth module — Supabase JWT verification, RBAC (3 roles, 18 permissions), user sync
5. Tenants module — TenantNode hierarchy (ltree), TenantSetting (JSONB + locks)
6. Catalog module — Products with variants (size grids), suppliers, departments, Dapper UPC lookup
7. Inventory module — Stock levels/transactions, blind receiving, purchase orders (full lifecycle), receive against PO
8. Sales module — Full POS transaction with tax calc, inventory decrement, Fullsteam payments, offline idempotency
9. Customers module — Customer directory CRUD, linked to sales

**Frontend (48 TSX/TS files in backoffice, 8 shared type files)**
1. Back Office — "Warm Industrial" design (DM Sans + Instrument Serif + amber accents)
2. All pages: Dashboard, Products (filter-first), Departments, Suppliers, Size Grids, Stock Levels, Receiving (multi-line scan), Purchase Orders (status workflow), Receive Against PO, Sales, Customers
3. POS web preview at /pos — transaction, tender (cash/card keypad), receipt screens
4. POS native app (Expo) — offline SQLite, sync service, transaction flow
5. Demo mode with comprehensive sample data
6. Deployed to Vercel: https://frontend-eight-alpha-66.vercel.app

**Database**
- Supabase project configured (PostgreSQL)
- All 11 migrations applied via `supabase db push`
- Seed data applied (tenant, roles, permissions, suppliers, departments, products)

### Current State

**Working:**
- All code compiles (`dotnet build` — 0 errors, 0 warnings)
- Frontend builds and deploys to Vercel with demo mode
- GitHub repo fully up to date: https://github.com/jrichburg/retail-platform
- Supabase database has all tables + seed data

**NOT working yet:**
- .NET API cannot connect to Supabase (IPv6-only, local network doesn't support it)
- No API hosting set up (discussed Railway vs Azure — decision deferred)
- No real Supabase Auth user created (demo mode only)
- No end-to-end testing with live API

### Decisions Made
- **Size grids**: Reusable templates, flexible 1D/2D dimensions
- **Supplier**: Vendor/brand, managed list
- **Product model**: Product = style level, ProductVariant = sellable unit (size/width/UPC)
- **Receiving**: Multi-line documents, scan resolves to variant level
- **PO workflow**: draft → submitted → partially_received → fully_received → closed
- **API hosting**: Discussed Railway ($5/month) vs Azure vs eliminating .NET for Supabase Edge Functions — **decision deferred to next session**

## For Next Session — Start Here

### Priority 1: Get the API Running
The main blocker is connecting the .NET API to Supabase. Options:
1. **Enable Supabase IPv4 add-on** ($4/month) → API can connect directly
2. **Deploy API to Railway** (~$5/month) → Railway has IPv6 support, API connects from cloud
3. **Rewrite to Supabase Edge Functions** → Eliminates .NET, major effort

Once the API is live:
- Create a Supabase Auth user (dashboard → Authentication → Add user)
- Test real login → Back Office → browse products → receive stock → ring a sale

### Priority 2: e-Commerce Storefront
Currently a stub. User expressed interest in viewing it. Build out:
- Product catalog browsing
- Product detail pages with size selection
- Cart + checkout flow

### Priority 3: Continue Phase 1 Completion
- Integration tests with TestContainers
- Basic reporting pages
- Full offline POS testing via Expo Go

### Stub Modules (Future Phases)
- Uniforms — work orders, group orders, AR
- ECommerce — storefront config, online orders
- Reporting — read models, report generation
- Notifications — SendGrid email
- Settings — tenant config UI

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
| DB context | `src/Infrastructure/Persistence/AppDbContext.cs` |
| Tenant middleware | `src/Api/Middleware/TenantResolutionMiddleware.cs` |
| Product entity | `src/Modules/Catalog/Domain/Entities/Product.cs` |
| POS lookup (Dapper) | `src/Modules/Catalog/Application/Queries/LookupProduct/LookupProductQueryHandler.cs` |
| Sale handler | `src/Modules/Sales/Application/Commands/CreateSale/CreateSaleCommandHandler.cs` |
| Receive handler | `src/Modules/Inventory/Application/Commands/CreateReceiveDocument/CreateReceiveDocumentCommandHandler.cs` |
| PO receive handler | `src/Modules/Inventory/Application/Commands/ReceiveAgainstPO/ReceiveAgainstPOCommandHandler.cs` |
| Frontend demo data | `frontend/backoffice/src/lib/demo-data.ts` |
| Frontend API client | `frontend/backoffice/src/lib/api.ts` |
| Design system CSS | `frontend/backoffice/src/index.css` |
| Vercel config | `frontend/vercel.json` |
| Supabase migrations | `supabase/migrations/` |
| Full architecture docs | `.claude/architecture.md` |
| Backend module docs | `.claude/backend-modules.md` |
| Frontend docs | `.claude/frontend.md` |
| Database docs | `.claude/database.md` |
