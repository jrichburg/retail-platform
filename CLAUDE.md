# Retail Platform

Three-product retail management platform for footwear, apparel, and uniform retailers.
See `.claude/` for detailed documentation by topic.

## Quick Reference

- **Backend**: ASP.NET Core 8 (C#), modular monolith, CQRS via MediatR
- **Frontend**: React 18 + Vite (Back Office), React Native/Expo (POS), Next.js 14 (e-Commerce)
- **Database**: PostgreSQL via Supabase, EF Core 8 + Dapper
- **Auth**: Supabase Auth (JWT), RBAC from custom tables
- **Current Phase**: Phase 1 — Foundation

## Build Commands

```bash
# Backend
dotnet build
dotnet run --project src/Api
dotnet test

# Frontend (from /frontend dir)
npm run dev:backoffice    # port 3000
npm run dev:pos           # Expo
npm run dev:ecommerce     # port 3002

# Migrations
dotnet ef migrations add {Name} --project src/Infrastructure --startup-project src/Api --output-dir Persistence/Migrations

# Deploy
cd frontend && vercel deploy --prod --yes
```

## Key Rules

1. Every entity extends `TenantScopedEntity`. All queries filter by tenant.
2. Use `Result<T>` for expected failures — not exceptions.
3. Commands: `{Verb}{Noun}Command.cs` → `{Verb}{Noun}CommandHandler.cs`
4. Queries: `Get{Noun}Query.cs` → `Get{Noun}QueryHandler.cs`
5. API endpoints: `/api/v1/{module}/{resource}`
6. EF configs live in module `Persistence/` folder with snake_case table/column names.
7. Never edit existing migrations — always create new ones.
8. Cross-module communication via MediatR only — no direct repository calls.
9. Frontend uses demo mode (`isDemo` flag) when no Supabase is configured.
10. Denormalize audit data on document lines (product name, SKU stored at time of creation).

## Detailed Docs

- `.claude/architecture.md` — System architecture and module structure
- `.claude/backend-modules.md` — All backend modules with entities, endpoints, and status
- `.claude/frontend.md` — Frontend apps, pages, hooks, stores, and design system
- `.claude/database.md` — Schema, migrations, Supabase config
- `.claude/session-notes.md` — Session handoff notes for continuity
