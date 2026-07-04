<!-- Last updated: 2026-07-04 -->
<!-- Last change: Marked Step 6 complete -->

# Vend-O-Matic - Implementation Roadmap

Generated from: dev-docs/PRD.md

## Steps

- [x] **Step 1: Convert backend to controller-based routing**
  Replace the default minimal-API template in `Program.cs` (the `MapGet("/weatherforecast", ...)` sample) with controller-based routing: `builder.Services.AddControllers()`, `app.MapControllers()`, and a `Controllers/` folder. This matches the Book 4 pattern the rest of the project builds on. Also confirm `.gitignore` excludes `bin/`, `obj/`, `node_modules/`, and any SQLite `.db` file.

  **Acceptance Criteria:**
  - **Given** the app is running, **When** a request hits a route defined by an `[ApiController]`, **Then** it responds successfully, confirming controllers are wired up correctly.

- [x] **Step 2: Model inventory with EF Core + SQLite**
  Add a `Beverage` entity (`Id`, `Name`, `Quantity`), a `VendingDbContext`, and a SQLite connection string in `appsettings.json`. Register the context in DI. Create the initial migration and seed 3 beverages (Cherry Coke, LaCroix, Sprite) at quantity 5 each. Set up an xUnit test project and write a backend unit test that verifies the seeded data (3 beverages, quantity 5 each) via the `DbContext`.

  **Acceptance Criteria:**
  - **Given** a fresh clone with no existing database file, **When** migrations are applied, **Then** the SQLite database is created containing exactly 3 beverages, each with quantity 5.
  - **Given** the xUnit test project, **When** the seed-data test is run, **Then** it passes, confirming the `Beverage` entity and `DbContext` are wired up correctly.

- [x] **Step 3: Track held-coin state**
  Add a small singleton service (e.g. `CoinBank`) with methods to add a coin, read the current held count, and reset to 0. Register it as a singleton in DI. This state is intentionally kept in memory rather than in the database. It's transient machine state, not durable inventory. That keeps the coin logic simple and isolates persistence to the one thing that actually needs it (inventory).

  **Acceptance Criteria:**
  - **Given** the service starts at 0 coins, **When** a coin is added, **Then** the held count is 1, and **When** the service is reset, **Then** the held count returns to 0.

- [x] **Step 4: Coin endpoints (`PUT /`, `DELETE /`)**
  Implement `PUT /` accepting `{ "coin": 1 }`, incrementing the `CoinBank`, returning `204` with an `X-Coins` header for the running total. Implement `DELETE /` resetting the `CoinBank` to 0 and returning `204` with `X-Coins` set to however many coins were just returned.

  **Acceptance Criteria:**
  - **Given** the machine holds 0 coins, **When** `PUT /` is called with `{ "coin": 1 }`, **Then** it responds `204` with `X-Coins: 1`.
  - **Given** the machine holds 2 coins, **When** `DELETE /` is called, **Then** it responds `204` with `X-Coins: 2`, and the held count is 0 afterward.

- [x] **Step 5: Inventory read endpoints (`GET /inventory`, `GET /inventory/:id`)**
  Implement `GET /inventory` returning a `200` with an array of remaining quantities (in a consistent, stable order). Implement `GET /inventory/:id` returning a `200` with that single beverage's remaining quantity.

  **Acceptance Criteria:**
  - **Given** the 3 seeded beverages, **When** `GET /inventory` is called, **Then** it returns `200` with an array of 3 integers matching their current quantities.
  - **Given** a valid beverage id, **When** `GET /inventory/:id` is called, **Then** it returns `200` with that beverage's quantity as an integer.

- [x] **Step 6: Purchase endpoint core logic (`PUT /inventory/:id`)**
  This is the heart of the assessment. Implement the three-way branch exactly per the spec table: out of stock, insufficient coins, and success.

  **Acceptance Criteria:**
  - **Given** a beverage with quantity 0, **When** `PUT /inventory/:id` is called, **Then** it responds `404` with `X-Coins` equal to the full refund of coins currently held, and the held count resets to 0.
  - **Given** a beverage in stock and fewer than 2 coins held, **When** `PUT /inventory/:id` is called, **Then** it responds `403` with `X-Coins` equal to the coins currently held (`0` or `1`), and the held coins are **not** cleared.
  - **Given** a beverage in stock and 2 or more coins held, **When** `PUT /inventory/:id` is called, **Then** it responds `200` with `X-Inventory-Remaining` decremented by 1, `X-Coins` equal to the change owed (held coins minus 2), a body of `{ "quantity": 1 }`, and the held coins reset to 0.

- [ ] **Step 7: Manual API verification against the spec**
  Expand `Vend-O-Matic.http` to cover every documented case: inserting coins, deleting/returning coins, both `GET /inventory` variants, and all three `PUT /inventory/:id` outcomes. Run each request and confirm the exact status code, headers, and body against the PRD's Core Requirements section.

  **Acceptance Criteria:**
  - **Given** the running API, **When** each request in `Vend-O-Matic.http` is executed in order, **Then** every response matches the status code, headers, and body documented in the spec.

- [ ] **Step 8: React client - inventory display and coin insert**
  Wire up fetch calls to the API. Display the 3 beverages with their current quantities from `GET /inventory`. Add an "insert quarter" control that calls `PUT /` and shows the running coin total from the `X-Coins` header.

  **Acceptance Criteria:**
  - **Given** the client loads, **When** the page renders, **Then** it displays all 3 beverages with quantities fetched from `GET /inventory`.
  - **Given** a user clicks "insert quarter", **When** the request completes, **Then** the displayed coin total increases by 1.

- [ ] **Step 9: React client - purchase flow and result display**
  Add drink-selection controls that call `PUT /inventory/:id`. Display the outcome (item vended + change returned, out of stock, or insufficient funds). Disable the control for any beverage at quantity 0.

  **Acceptance Criteria:**
  - **Given** enough coins inserted and an in-stock item, **When** the user selects that drink, **Then** the UI shows the vended item and any change returned, and the displayed quantity updates.
  - **Given** a beverage's quantity is 0, **When** inventory is displayed, **Then** that beverage's selection control is disabled.
  - **Given** fewer than 2 coins inserted, **When** the user attempts to select a drink, **Then** the UI shows an insufficient-funds message and nothing is vended.

- [ ] **Step 10: Client unit tests with Vitest + React Testing Library**
  Write unit tests covering the coin-total display, the disabled state for sold-out items, and the rendering of vend/change/error results.

  **Acceptance Criteria:**
  - **Given** the test suite, **When** run via `vitest run`, **Then** all client unit tests pass.

- [ ] **Step 11: README and setup instructions**
  Write step-by-step setup/run instructions (`dotnet restore`, applying EF Core migrations, `dotnet run`, `npm install`, `npm run dev`), verified against a clean clone.

  **Acceptance Criteria:**
  - **Given** a clean clone and only the README for guidance, **When** the documented steps are followed in order, **Then** both the API and the client start successfully.

- [ ] **Step 12: Final pass against the vending constraints**
  Re-check the implementation against all 6 vending constraints in the original assignment (quarters only, 2-quarter price, 5-unit cap per beverage, single item per transaction, unused coins returned, `application/json` throughout). Fix any gaps found.

  **Acceptance Criteria:**
  - **Given** the finished project, **When** each of the 6 vending constraints is checked against the running implementation, **Then** all 6 are satisfied.
