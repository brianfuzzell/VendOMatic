<!-- Last updated: 2026-07-03 -->
<!-- Last change: Initial wireframes creation -->

# Vend-O-Matic - Wireframes

Generated from: dev-docs/PRD.md

## Layout Overview

Single page, no router (per PRD Stack Decisions). Three fixed regions stacked vertically:

1. **Coin area** - running coin total and an "insert quarter" button.
2. **Inventory grid** - one card per beverage, showing name, remaining quantity, and a select button.
3. **Result area** - feedback from the last purchase attempt (vended + change, out of stock, or insufficient funds). Empty until the first purchase attempt.

Every state below is the same page; only the coin total, inventory numbers, button states, and result area change.

## State 1: Idle (initial load, 0 coins)

```
+-----------------------------------------------+
|  Vend-O-Matic                                  |
|  Coins inserted: 0        [ Insert Quarter ]   |
+-----------------------------------------------+
|  Cherry Coke      qty: 5      [ Select ]       |
|  LaCroix          qty: 5      [ Select ]       |
|  Sprite           qty: 5      [ Select ]       |
+-----------------------------------------------+
|  (no result yet)                               |
+-----------------------------------------------+
```

## State 2: Coins inserted, not enough yet (1 quarter)

```
+-----------------------------------------------+
|  Vend-O-Matic                                  |
|  Coins inserted: 1        [ Insert Quarter ]   |
+-----------------------------------------------+
|  Cherry Coke      qty: 5      [ Select ]       |
|  LaCroix          qty: 5      [ Select ]       |
|  Sprite           qty: 5      [ Select ]       |
+-----------------------------------------------+
|  (no result yet)                               |
+-----------------------------------------------+
```

## State 3: Successful vend (2 coins inserted, Cherry Coke selected)

```
+-----------------------------------------------+
|  Vend-O-Matic                                  |
|  Coins inserted: 0        [ Insert Quarter ]   |
+-----------------------------------------------+
|  Cherry Coke      qty: 4      [ Select ]       |
|  LaCroix          qty: 5      [ Select ]       |
|  Sprite           qty: 5      [ Select ]       |
+-----------------------------------------------+
|  Vended: Cherry Coke                           |
|  Change returned: 0 coins                      |
+-----------------------------------------------+
```

## State 4: Out of stock (Sprite at quantity 0)

```
+-----------------------------------------------+
|  Vend-O-Matic                                  |
|  Coins inserted: 0        [ Insert Quarter ]   |
+-----------------------------------------------+
|  Cherry Coke      qty: 4      [ Select ]       |
|  LaCroix          qty: 5      [ Select ]       |
|  Sprite           qty: 0      [ Sold Out ]     |  <- disabled
+-----------------------------------------------+
|  (no result yet, or previous result)           |
+-----------------------------------------------+
```

## State 5: Insufficient funds attempt (1 coin inserted, LaCroix selected)

```
+-----------------------------------------------+
|  Vend-O-Matic                                  |
|  Coins inserted: 1        [ Insert Quarter ]   |
+-----------------------------------------------+
|  Cherry Coke      qty: 4      [ Select ]       |
|  LaCroix          qty: 5      [ Select ]       |
|  Sprite           qty: 0      [ Sold Out ]     |
+-----------------------------------------------+
|  Insufficient funds. Insert more coins.        |
|  (1 coin held, not returned)                   |
+-----------------------------------------------+
```

## Notes

- **Button state maps directly to inventory quantity.** A beverage's `[ Select ]` button is disabled exactly when its `qty` is 0 (Roadmap Step 9 acceptance criteria), no separate flag needed.
- **The result area is the same region across all three purchase outcomes** (success, out of stock, insufficient funds); only its content changes based on the API response status code. This keeps the component logic to "render based on last result," rather than three different UI regions to manage.
- **Coins inserted display always reflects `X-Coins`.** After `PUT /` it's the running total; after a successful vend or a reset it drops back toward 0; after an insufficient-funds attempt it stays exactly where it was (coins aren't returned in that case, per the PRD).
