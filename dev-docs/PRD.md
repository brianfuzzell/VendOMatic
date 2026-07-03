<!-- Last updated: 2026-07-03 -->
<!-- Last change: Added xUnit backend unit testing to scope (Step 2) -->

# Vend-O-Matic - Product Requirements Document

## Problem Statement

A take-home technical assessment project: build the HTTP service behind a beverage vending machine. The service will be exercised directly over HTTP by the company's own test suite/reviewer, so the API contract in the spec must be followed exactly. This is being built independently (no guided tutorial) within a 3-day window, using C#/.NET and React instead of the company's own Python/React stack, applying patterns from Nashville Software School's Book 4 (controllers) and the Vitest/React Testing Library lessons.

## Target Users

- **Primary: the reviewer/test suite.** They will clone the repo, follow the README to set it up on OSX, and send HTTP requests (`application/json`) directly against the endpoints below. Correctness of status codes, headers, and body shape is what's being graded.
- **Secondary: a human operator.** The optional React client simulates the physical machine (insert a coin, pick a drink, see change returned) for anyone who wants to interact with it visually instead of via raw HTTP calls.

## Core Requirements

From the assignment spec:

1. **Coins** - only US quarters, one at a time.
   - `PUT /` with `{ "coin": 1 }` - accept a quarter. `204`, header `X-Coins` = running count of coins currently held.
   - `DELETE /` - return all held coins and reset to 0. `204`, header `X-Coins` = number of coins returned.
2. **Inventory** - 3 beverages, 5 units each at start: **Cherry Coke, LaCroix, Sprite**.
   - `GET /inventory` - `200`, array of remaining quantities (ints), one per beverage.
   - `GET /inventory/:id` - `200`, remaining quantity (int) for that beverage.
3. **Purchase** - price is 2 quarters, one beverage dispensed per transaction, any excess coins returned as change.
   - `PUT /inventory/:id`
     - **Success** - `200`. Headers: `X-Coins` (change to return), `X-Inventory-Remaining` (new quantity). Body: `{ "quantity": <vended count, 1> }`. Decrement inventory by 1, reset held coins to 0.
     - **Out of stock** - `404`. Header `X-Coins` = full refund of coins currently held (item can't be sold, so nothing is kept).
     - **Insufficient coins** - `403`. Header `X-Coins` = coins currently held (will be `0` or `1`, since `2` would trigger a sale instead). Coins are *not* returned here - the machine keeps them and waits for more.
4. All requests/responses use `application/json`.

## Technical Stack

- **Backend:** ASP.NET Core Web API, C#, .NET 10, **controller-based routing** (replacing the default minimal-API template currently in `Program.cs`), matching the Book 4 pattern.
- **Data:** EF Core with **SQLite** (file-based), one `DbContext`, a `Beverage` entity (id, name, quantity) and machine coin state, seeded via migration to 5 units each of Cherry Coke, LaCroix, Sprite.
- **Frontend:** React + Vite (already scaffolded), single page (no `react-router-dom`), showing inventory, a "insert quarter" action, drink selection, and the transaction result (item vended / change returned / error).
- **Testing:** Vitest + React Testing Library for client-side unit tests. xUnit for backend unit tests (starting with the `Beverage` entity / `VendingDbContext`). Manual/`*.http`-file verification of the API contract against the spec table above.

### Stack Decisions

- **SQLite over the already-installed Postgres/Npgsql package:** same EF Core skills (DbContext, migrations, DI into controllers) from Book 4, but no external DB server for the reviewer to install or configure. Matches the assignment's own "as few dependencies as possible" note and the fact that it'll be graded on an unfamiliar OSX machine. The `Npgsql.EntityFrameworkCore.PostgreSQL` package reference should be swapped for `Microsoft.EntityFrameworkCore.Sqlite`.
- **Controllers over minimal APIs:** the current `Program.cs` is the default minimal-API template (`app.MapGet(...)`); converting to `[ApiController]`/`Controllers/` matches the Book 4 pattern this project is meant to practice.
- **No ASP.NET Identity / auth:** the spec has no concept of a user or account - it's a single anonymous machine. The already-installed `Microsoft.AspNetCore.Identity.EntityFrameworkCore` package won't be used; adding login would be unrequested scope a reviewer would have to puzzle over.
- **Single-page client, no router:** the whole interaction is one continuous flow (view inventory -> insert coins -> pick a drink -> see result), so there's nothing to route between. `react-router-dom` stays installed but unused for v1.
- **Vitest + RTL only, no E2E tooling:** matches what's already been learned; full browser E2E (Playwright/Cypress) is out of scope for a 3-day assessment.
- **xUnit for backend unit tests:** decided partway through Step 2, after the API-only scope (manual `.http` verification, no backend tests) started to feel thin for a project already using EF Core migrations and seed data worth verifying automatically. xUnit is the .NET ecosystem default (`dotnet new` scaffolds it), so it stays consistent with the "use the standard tool" approach already applied to controllers and EF Core.

## Scope

### In Scope (v1)

- Controller-based Web API implementing all 6 endpoints exactly per the spec table (status codes, headers, body shapes).
- SQLite database via EF Core: `Beverage` entity, migration seeding 3 drinks x 5 units, coin-count state.
- xUnit backend unit tests, starting with the `Beverage` entity / `VendingDbContext` seed data.
- README with step-by-step setup/run instructions verified on a clean clone (targeting OSX + noting any Windows differences).
- React client: inventory view, insert-coin control, drink buttons, and a result area showing vended item / change / error messages.
- A handful of Vitest + RTL unit tests on the client's coin/vend logic (e.g., running coin total, disabling a sold-out item, displaying returned change).
- Manual verification of the API against `Vend-O-Matic.http`.

### Out of Scope (future)

- User accounts / authentication (Identity).
- PostgreSQL or any hosted/production database.
- A restocking or admin endpoint (not in the spec).
- Any payment method other than a single quarter at a time (not in the spec).
- End-to-end browser tests (Playwright).
- CI/CD pipeline or deployment - this is run locally by the reviewer.

## Success Criteria

- Every endpoint returns the exact status code, headers, and body specified in the assignment table, confirmed manually via `Vend-O-Matic.http` (or an equivalent REST client) for all documented cases (success, 403, 404).
- All six vending constraints from the spec are honored (5-unit cap per drink, one item per transaction, unused coins refunded, etc.).
- A reviewer can clone the repo and get both the API and (optionally) the client running on a clean machine using only the README.
- Client-side Vitest tests pass.
- Backend xUnit tests pass.
- Delivered within the 3-day window.

## Learning Goals

- Apply Book 4 controller-based Web API patterns independently, without a guided tutorial, against a fixed external spec.
- Practice EF Core end-to-end with SQLite: entity/DbContext design, migrations, and DI into controllers.
- First experience translating a written API contract into working code solo, under a real deadline.
- First time writing Vitest + React Testing Library unit tests on a real (non-lesson) project.
