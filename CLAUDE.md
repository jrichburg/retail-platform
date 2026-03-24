# Retail Platform — CLAUDE.md

## Project
Three-product retail management platform for footwear, apparel, and uniform retailers.
ASP.NET Core 8 (C#) API + React/TypeScript (Back Office) + React Native/Expo (POS) + Next.js (e-Comm).
PostgreSQL via Supabase. Upstash Redis. Azure App Service (API). Vercel (web frontends). EAS (mobile builds).

## Architecture
- Modular monolith. Each module in /src/Modules/{ModuleName}/
- Modules communicate via MediatR (in-process) or Hangfire jobs (async, Phase 1–2)
- All business logic in Application layer (CQRS pattern: Commands + Queries)
- No direct cross-module repository calls — use mediator or events only
- Every entity has TenantNodeId. All queries must filter by resolved tenant context.
- Supabase Auth JWTs verified in middleware; RBAC claims resolved from our own tables
- POS is React Native (Expo). Uses expo-sqlite for offline catalog + transaction queue.
- Payments via Fullsteam payment rails.

## Conventions
- Commands: {Verb}{Noun}Command.cs → handled by {Verb}{Noun}CommandHandler.cs
- Queries: Get{Noun}Query.cs → handled by Get{Noun}QueryHandler.cs
- API endpoints: /api/v1/{module}/{resource}
- DB migrations: always create a new migration, never edit existing ones
- Error handling: use Result<T> (not exceptions) for expected failures
- Storage: use Supabase Storage client via IStorageService abstraction
- Email: use IEmailService abstraction backed by SendGrid

## Module Structure
Each module follows this layout:
```
/Modules/{Name}/
  /Domain/Entities/    — domain models
  /Application/
    /Commands/         — write operations (CQRS)
    /Queries/          — read operations (CQRS)
  /Controllers/        — API endpoints
```

## Frontend
- Back Office: React 18 + Vite + Tailwind (port 3000)
- POS: React Native (Expo) — iOS first
- e-Commerce: Next.js 14 App Router (port 3002)
- Shared types: @retail-platform/shared-types (Zod schemas + TS types)
- State: Zustand (global) + TanStack Query (server state)
- Forms: React Hook Form + Zod

## Testing
- xUnit for all .NET tests
- Integration tests use TestContainers (spins up real PostgreSQL)
- Run `dotnet test` before any PR

## Build Commands
- Backend: `dotnet build` / `dotnet run --project src/Api`
- Back Office: `cd frontend && npm run dev:backoffice`
- e-Commerce: `cd frontend && npm run dev:ecommerce`
- POS: `cd frontend && npm run dev:pos`
- Tests: `dotnet test`

## Current Phase
Phase 1 — Foundation
