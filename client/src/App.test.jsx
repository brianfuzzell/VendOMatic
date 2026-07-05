import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

function mockFetchResponses({ inventory = [5, 5, 5], insertedCoins = "1", purchase } = {}) {
  globalThis.fetch = vi.fn((url, options) => {
    if (url === "/api/inventory") {
      return Promise.resolve({
        json: () => Promise.resolve(inventory),
      });
    }

    if (url === "/api/" && options?.method === "PUT") {
      return Promise.resolve({
        headers: { get: () => insertedCoins },
      });
    }

    if (url.startsWith("/api/inventory/") && options?.method === "PUT") {
      return Promise.resolve({
        status: purchase.status,
        headers: {
          get: (header) => (header === "X-Coins" ? purchase.coins : purchase.remaining),
        },
      });
    }

    return Promise.reject(new Error(`Unhandled fetch call: ${options?.method ?? "GET"} ${url}`));
  });
}

describe("coin total display", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("increments the displayed coin count when insert quarter is clicked", async () => {
    mockFetchResponses({ insertedCoins: "1" });
    const user = userEvent.setup();

    render(<App />);
    await screen.findByText("Cherry Coke: 5 remaining");

    expect(screen.getByText("Coins inserted: 0")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Insert quarter" }));

    expect(await screen.findByText("Coins inserted: 1")).toBeInTheDocument();
  });
});

describe("sold-out beverage disabled state", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("disables the select button only for the sold-out beverage", async () => {
    mockFetchResponses({ inventory: [0, 5, 5] });

    render(<App />);

    const soldOutItem = await screen.findByText("Cherry Coke: 0 remaining");
    const inStockItem = screen.getByText("LaCroix: 5 remaining");

    expect(within(soldOutItem).getByRole("button", { name: "Select" })).toBeDisabled();
    expect(within(inStockItem).getByRole("button", { name: "Select" })).not.toBeDisabled();
  });
});

describe("purchase result rendering", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("shows the vended item and change on a successful purchase", async () => {
    mockFetchResponses({ purchase: { status: 200, coins: "0", remaining: "4" } });
    const user = userEvent.setup();

    render(<App />);
    const cherryCokeItem = await screen.findByText("Cherry Coke: 5 remaining");
    await user.click(within(cherryCokeItem).getByRole("button", { name: "Select" }));

    expect(await screen.findByText("Vended Cherry Coke. Change returned: 0.")).toBeInTheDocument();
    expect(screen.getByText("Cherry Coke: 4 remaining")).toBeInTheDocument();
  });

  test("shows an insufficient-funds message and does not vend", async () => {
    mockFetchResponses({ purchase: { status: 403, coins: "1" } });
    const user = userEvent.setup();

    render(<App />);
    const cherryCokeItem = await screen.findByText("Cherry Coke: 5 remaining");
    await user.click(within(cherryCokeItem).getByRole("button", { name: "Select" }));

    expect(
      await screen.findByText("Insufficient funds for Cherry Coke. Insert more coins."),
    ).toBeInTheDocument();
    expect(screen.getByText("Cherry Coke: 5 remaining")).toBeInTheDocument();
  });

  test("shows an out-of-stock message when the server rejects a stale in-stock click", async () => {
    mockFetchResponses({ purchase: { status: 404, coins: "2" } });
    const user = userEvent.setup();

    render(<App />);
    const cherryCokeItem = await screen.findByText("Cherry Coke: 5 remaining");
    await user.click(within(cherryCokeItem).getByRole("button", { name: "Select" }));

    expect(
      await screen.findByText("Cherry Coke is out of stock. Coins returned: 2."),
    ).toBeInTheDocument();
  });
});
