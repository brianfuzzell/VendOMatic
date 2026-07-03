<!-- Last updated: 2026-07-03 -->
<!-- Last change: Initial user stories creation -->

# Vend-O-Matic - User Stories

Generated from: dev-docs/PRD.md

Written from the perspective of the two personas named in the PRD: the **customer** (the human operator interacting with the machine, whether through the React client or raw HTTP) and the **reviewer** (who sets up and grades the project). Each story is numbered so it can be referenced from a GitHub issue.

## Customer stories

- **US-1**: As a customer, I want to insert a quarter into the machine, so that I can build up enough credit to buy a beverage.
- **US-2**: As a customer, I want to see how many coins I currently have inserted, so that I know when I've paid enough.
- **US-3**: As a customer, I want to get my coins back if I change my mind, so that I don't lose money I never intended to spend.
- **US-4**: As a customer, I want to see all the available beverages and how many of each are left, so that I know what I can buy before I start inserting coins.
- **US-5**: As a customer, I want to select a beverage to purchase, so that I receive that beverage in exchange for my coins.
- **US-6**: As a customer, I want change returned if I've inserted more than the price, so that I'm not overcharged for a beverage.
- **US-7**: As a customer, I want to be told when a beverage is sold out (and get my coins back), so that I don't lose money trying to buy something unavailable.
- **US-8**: As a customer, I want to be told when I haven't inserted enough money yet, so that I know to add more coins instead of losing my attempt.

## Reviewer stories

- **US-9**: As a reviewer, I want clear setup instructions, so that I can get the API and client running on a clean machine without guessing.
- **US-10**: As a reviewer, I want the API to respond with the exact status codes, headers, and body shapes documented in the spec, so that I can verify correctness by testing the endpoints directly.

## Notes

- Stories map to PRD Core Requirements 1-4 and the roadmap's acceptance criteria; they describe user-facing *value*, not implementation steps. Compare to `ROADMAP.md`, which breaks the same requirements into technical build steps.
- US-3 and US-7 both involve coins being returned, but they're different triggers (customer-initiated cancel vs. system-initiated refund on an out-of-stock item) and are kept as separate stories so each maps cleanly to one GitHub issue later.
- US-8 does **not** include getting coins back; per the PRD, insufficient-funds attempts keep the held coins rather than returning them.
