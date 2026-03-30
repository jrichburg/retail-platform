# Architecture

## System Overview

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Back Office  │  │   POS App   │  │ e-Commerce  │
│ React+Vite   │  │ Expo (RN)   │  │  Next.js    │
│ Vercel       │  │ iOS/Android │  │  Vercel     │
└──────┬───────┘  └──────┬──────┘  └──────┬──────┘
       │                 │                 │
       └────────┬────────┘─────────────────┘
                │
    ┌───────────▼───────────┐
    │   ASP.NET Core 8 API  │
    │   Modular Monolith    │
    │   Azure App Service   │
    └───────────┬───────────┘
         ┌──────┼──────┐
         ▼      ▼      ▼
    Supabase  Redis  Fullsteam
    (Postgres) (Cache) (Payments)
```

## Modular Monolith

Single deployable API organized into vertical slices. Each module owns its domain, application logic, persistence config, and controllers.

```
/src
  /Api                  ← Entry point, middleware, DI, seeds
  /SharedKernel         ← Base entities, CQRS interfaces, Result<T>
  /Infrastructure       ← AppDbContext, Dapper, Redis, services
  /Modules
    /Auth               ← Supabase JWT, RBAC, user sync
    /Tenants            ← Hierarchy (ltree), settings inheritance
    /Catalog            ← Products, variants, suppliers, size grids, departments
    /Inventory          ← Stock levels, receiving, purchase orders
    /Sales              ← POS transactions, tenders, void
    /Customers          ← Customer directory, CRM basics
    /Uniforms           ← (stub) Work orders, group orders
    /ECommerce          ← (stub) Storefront config
    /Reporting          ← (stub) Read models
    /Notifications      ← (stub) Email/SMS
    /Settings           ← (stub) Tenant config UI
```

## Module Internal Structure

```
/Modules/{Name}/
  /Domain/Entities/           ← Domain models (TenantScopedEntity)
  /Application/
    /Commands/{Verb}{Noun}/   ← Command.cs, CommandHandler.cs, CommandValidator.cs
    /Queries/Get{Noun}/       ← Query.cs, QueryHandler.cs
    /Dtos/                    ← Data transfer objects
  /Persistence/               ← EF Core IEntityTypeConfiguration (snake_case)
  /Controllers/               ← REST API controllers
```

## Key Patterns

### CQRS + MediatR
- Commands for writes, Queries for reads — all dispatched via MediatR
- `ValidationBehavior<T>` pipeline runs FluentValidation before every handler
- `Result<T>` return type — never throw for business logic failures

### Multi-Tenancy
- Every entity extends `TenantScopedEntity` (TenantNodeId + RootTenantId)
- `AppDbContext` applies global query filter on `RootTenantId`
- `TenantResolutionMiddleware` reads `X-Tenant-Node-Id` header or JWT claim
- Tenant hierarchy uses PostgreSQL `ltree` for fast ancestor/descendant queries

### Authentication
- Supabase Auth handles signup/login/password reset
- API verifies Supabase JWT in middleware
- Local `AppUser` table maps Supabase users to roles/permissions
- `SyncUserCommand` creates local user on first login

### Cross-Module Communication
- MediatR `Send()` for synchronous cross-module calls (e.g., Sales → Inventory DecrementStock)
- No direct DbContext queries across module boundaries
- Denormalize data on document lines for audit immutability

## Tech Stack

| Layer | Technology |
|-------|-----------|
| API Framework | ASP.NET Core 8 (C#) |
| ORM | EF Core 8 (writes/migrations) + Dapper (reads) |
| Database | PostgreSQL 16 via Supabase |
| Cache | Upstash Redis (or in-memory fallback) |
| Auth | Supabase Auth + custom RBAC |
| Payments | Fullsteam (card-present, server-side) |
| Message Bus | MediatR in-process (Phase 1), Hangfire async (Phase 2) |
| Back Office | React 18, Vite, Tailwind CSS, TanStack Query, Zustand |
| POS | React Native (Expo), expo-sqlite, NativeWind |
| e-Commerce | Next.js 14 App Router (stub) |
| Shared Types | Zod schemas + TypeScript interfaces |
| CI/CD | GitHub Actions + Expo EAS |
| Hosting | Azure App Service (API), Vercel (web), EAS (mobile) |
