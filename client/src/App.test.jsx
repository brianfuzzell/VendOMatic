import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

function mockFetchResponses({ inventory = [5, 5, 5], insertedCoins = "1" } = {}) {
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
