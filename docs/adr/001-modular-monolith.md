# ADR-001: Modular Monolith Architecture

## Status
Accepted

## Context
We need an architecture that lets a small team ship quickly while retaining the ability to extract services later as scale demands.

## Decision
Build the backend as a modular monolith — a single deployable ASP.NET Core application organized into vertical slices (modules). Each module owns its domain models, application logic, and API controllers. Modules communicate via MediatR (in-process) and Hangfire jobs (async).

## Consequences
- **Faster development**: single deployment, shared database, no network overhead between modules
- **Clear boundaries**: modules are isolated by namespace and project references
- **Future extraction**: modules can be extracted to separate services if needed — the mediator boundary makes this straightforward
- **Trade-off**: all modules share the same process, so a bug in one module can affect others
