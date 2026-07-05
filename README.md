# Vend-O-Matic

An ASP.NET Core Web API for a beverage vending machine, backed by SQLite via EF Core, with an optional React client that simulates the physical machine. See [dev-docs/PRD.md](dev-docs/PRD.md) for the full spec and [dev-docs/ARCHITECTURE.md](dev-docs/ARCHITECTURE.md) for the system design.

## The Assignment

This project implements the take-home assignment below. The original is in [dev-docs/Vend-O-Matic assignment.pdf](dev-docs/Vend-O-Matic%20assignment.pdf).

### Overview

You are responsible for designing a service that will support a beverage vending machine that is tested via HTTP before being placed into a production environment.

Please provide detailed instructions so that the API and client can be set up and run.

It is recommended (but not required) to use as few dependencies as possible.

### Vending Constraints

1. The machine only accepts US quarters. You physically cannot put anything else in, and you can only put one coin in at a time.
2. Purchase price of an item is two US quarters.
3. Machine only holds five of each of the three beverages available to purchase in its inventory.
4. Machine will accept more than the purchase price of coins, but will only dispense a single beverage per transaction.
5. Upon transaction completion, any unused quarters must be dispensed back to the customer.
6. All test interactions will be performed with a single content type of `application/json`.

### Specifications

| Verb | URI | Request Body | Response Code | Response Headers | Response Body |
|---|---|---|---|---|---|
| `PUT` | `/` | `{ "coin": 1 }` | 204 | `X-Coins`: number of coins currently held | |
| `DELETE` | `/` | | 204 | `X-Coins`: number of coins returned | |
| `GET` | `/inventory` | | 200 | | Array of remaining item quantities (array of integers) |
| `GET` | `/inventory/:id` | | 200 | | Remaining item quantity (an integer) |
| `PUT` | `/inventory/:id` | | 200 | `X-Coins`: change to return<br>`X-Inventory-Remaining`: new item quantity | `{ "quantity": 1 }` |
| `PUT` | `/inventory/:id` (out of stock) | | 404 | `X-Coins`: full refund of coins currently held | |
| `PUT` | `/inventory/:id` (insufficient coins) | | 403 | `X-Coins`: coins currently held (`0` or `1`) | |

## Prerequisites

- [.NET SDK 10](https://dotnet.microsoft.com/download) or later
- [Node.js](https://nodejs.org/) 20 or later (includes npm)
- The `dotnet-ef` global tool, used to apply EF Core migrations:

  ```
  dotnet tool install --global dotnet-ef
  ```

  If it's already installed, `dotnet ef --version` will print a version instead of an error.

## Backend Setup

Run these from the repository root.

1. Restore dependencies:

   ```
   dotnet restore
   ```

2. Apply migrations to create the SQLite database. This creates `vendomatic.db` in the repo root, seeded with 3 beverages (Cherry Coke, LaCroix, Sprite) at quantity 5 each:

   ```
   dotnet ef database update
   ```

3. Run the API:

   ```
   dotnet run
   ```

   By default this starts the API on `https://localhost:5001` (and `http://localhost:5000`, which redirects to the https URL). Leave this running in its own terminal.

4. (Optional) Run the backend unit tests:

   ```
   dotnet test
   ```

## Frontend Setup

![Vend-O-Matic React client demo](dev-docs/assets/VendomaticDemoClient.gif)

Run these from the `client/` directory, in a second terminal, while the API from the previous section is still running.

1. Install dependencies:

   ```
   npm install
   ```

2. Start the dev server:

   ```
   npm run dev
   ```

   Vite will print a local URL (typically `http://localhost:5173`) and open it in your browser. The client calls the API through Vite's dev proxy, so no extra configuration is needed as long as the backend is running on `https://localhost:5001`.

3. (Optional) Run the client unit tests:

   ```
   npm test -- run
   ```

   The trailing `run` is required. Without it, Vitest starts in interactive watch mode and won't exit on its own.

## Manual API Verification

![Vend-O-Matic manual API verification demo](dev-docs/assets/VendomaticDemoPostman.gif)

`Vend-O-Matic.http` exercises every documented request/response case directly against the API (coin insert/return, both inventory reads, and all three purchase outcomes), independent of the React client.

To run it in VS Code:

1. Install the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension.
2. Open `Vend-O-Matic.http` with the API running (see Backend Setup above).
3. Click **Send Request**, which appears above each request line, to fire that request and see the response in a side panel.

JetBrains IDEs (Rider, WebStorm, IntelliJ) have an equivalent built in: open `Vend-O-Matic.http` and click the green run icon that appears in the gutter next to each request.

Run the requests from top to bottom — several of them depend on coin state left behind by the ones before, as noted in the comments above each request.
