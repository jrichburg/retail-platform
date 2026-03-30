# Session Notes

Last updated: 2026-03-30

## What Was Built This Session

### Phase 1 Foundation (Complete)
Built the entire platform from scratch in a single session:

1. **Project scaffolding** — .NET solution with 16 projects, npm workspaces monorepo, docker-compose, GitHub Actions CI, CLAUDE.md
2. **SharedKernel** — CQRS abstractions (ICommand/IQuery), ValidationBehavior, Result<T>, ITenantContext, ICurrentUser, IPaymentService
3. **Infrastructure** — AppDbContext with global tenant filters + audit auto-set, Dapper, Redis, FullsteamPaymentService
4. **Auth module** — Supabase JWT, AppUser/Role/Permission RBAC, 3 roles, 18 permissions
5. **Tenants module** — TenantNode hierarchy (ltree), TenantSetting (JSONB + locks)
6. **Catalog module** — Products with variants (size grids), suppliers, departments/categories, Dapper UPC lookup
7. **Inventory module** — Stock levels/transactions, blind receiving (multi-line), purchase orders (full lifecycle), receive against PO
8. **Sales module** — Full POS transaction with tax calc, inventory decrement, Fullsteam payments, offline idempotency
9. **Customers module** — Customer directory CRUD, linked to sales
10. **Back Office frontend** — Full "Warm Industrial" design system, all pages for catalog/inventory/sales/customers, demo mode
11. **POS web preview** — Browser-based POS at /pos with transaction, tender, receipt screens
12. **POS native app** — React Native (Expo) with offline SQLite, sync service

### Product Management Enhancements
- Added Supplier (vendor/brand) with managed list
- Added Style, Color, MAP Date fields to Product
- Size Grid system: reusable templates with flexible 1D/2D dimensions
- ProductVariant: each size/width combo gets its own UPC
- UPC matrix in product form (2D table for footwear, 1D list for apparel)
- Filter-first product search (Supplier + Category + Name/SKU)

### Receiving Workflow (3 phases)
- **Phase A**: Blind receiving — scan UPC or manual add, multi-line document, stock auto-increments
- **Phase B**: Purchase orders — create/edit/submit/close lifecycle, supplier + line items with qty/cost
- **Phase C**: Receive against PO — scan flow with expected vs received, PO auto-transitions status

### UI Redesign
- "Warm Industrial" aesthetic: DM Sans + Instrument Serif, slate-925 sidebar, amber accents
- Custom CSS component classes in index.css
- Split-panel login, real dashboard with KPIs, premium data tables

## Current State

### What's Working
- All backend modules compile clean (`dotnet build` — 0 errors)
- All 11 EF Core migrations created and applied to Supabase
- Frontend builds and deploys to Vercel with demo mode
- Live demo: https://frontend-eight-alpha-66.vercel.app
- GitHub repo: https://github.com/jrichburg/retail-platform

### What's NOT Working Yet
- **API cannot connect to Supabase** — IPv6-only direct connection, pooler returns "Tenant or user not found". Need IPv4 add-on ($4/month) or wait for pooler propagation.
- **No real auth flow tested** — No Supabase Auth user created yet. Demo mode only.
- **No real data** — Only seed SQL applied via `supabase db push`. API seeders haven't run (blocked by connection).

### Blocked On
1. **Database connectivity** — Enable IPv4 add-on in Supabase OR wait for pooler to propagate. Once connected, `dotnet run` will auto-migrate and seed.
2. **Supabase Auth user** — Create a user in Supabase dashboard (Authentication > Users > Add user) to test real login flow.

## Supabase Credentials (in gitignored files)
- Project URL: `https://jaqibimumhdtbnnydaju.supabase.co`
- Anon key: in `frontend/backoffice/.env`
- JWT secret: in `src/Api/appsettings.Development.json`
- DB password: in `src/Api/appsettings.Development.json`

## Next Steps (Priority Order)

### Immediate
1. Enable Supabase IPv4 add-on → unblocks API connection
2. Run `dotnet run --project src/Api` → auto-migrates + seeds
3. Create Supabase Auth user → test real login
4. Test end-to-end: login → browse products → receive stock → ring sale

### Phase 1 Remaining
- [ ] Label printing integration (Zebra/Dymo) — Phase 2 feature
- [ ] Full offline POS testing with Expo Go on iOS
- [ ] Integration tests with TestContainers
- [ ] Basic reporting pages

### Phase 2 (Months 4-6)
- Full RBAC with permission-based authorization
- Full POS features: layaway, returns, gift cards, customer attach
- Tenant hierarchy (unlimited depth, not just root → stores)
- Import pipeline (CSV product import)
- Label printing
- SendGrid email integration
- Android POS build

### Phase 3 (Months 7-10)
- e-Commerce storefront (Next.js)
- Uniform work orders + group orders
- AR module
- Advanced reporting
- Tax engine (Avalara/TaxJar)

## Key Files to Know

| Purpose | File |
|---------|------|
| API entry point | `src/Api/Program.cs` |
| DB context | `src/Infrastructure/Persistence/AppDbContext.cs` |
| Tenant middleware | `src/Api/Middleware/TenantResolutionMiddleware.cs` |
| Product entity | `src/Modules/Catalog/Domain/Entities/Product.cs` |
| POS lookup (Dapper) | `src/Modules/Catalog/Application/Queries/LookupProduct/LookupProductQueryHandler.cs` |
| Sale handler | `src/Modules/Sales/Application/Commands/CreateSale/CreateSaleCommandHandler.cs` |
| Receive handler | `src/Modules/Inventory/Application/Commands/CreateReceiveDocument/CreateReceiveDocumentCommandHandler.cs` |
| Frontend demo data | `frontend/backoffice/src/lib/demo-data.ts` |
| Frontend API client | `frontend/backoffice/src/lib/api.ts` |
| Design system CSS | `frontend/backoffice/src/index.css` |
| Vercel config | `frontend/vercel.json` |
