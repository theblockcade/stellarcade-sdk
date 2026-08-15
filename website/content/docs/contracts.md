# Soroban Smart Contracts Architecture

StellarCade's on-chain operations are powered by a suite of modular Rust smart contracts deployed to the **Soroban** environment on Stellar. The main repo's `contracts/` workspace holds 150+ crates in total — most are exploratory or not yet part of the v1 game surface. This page covers the ones the SDK and gateway actually integrate with.

---

## Status of the Core Contracts

None of these are "done, tested, production-ready" yet. Status below reflects the repo's own `contracts/STATUS.md` audit, not aspirational planning:

| Contract | Status | Notes |
| :--- | :--- | :--- |
| **`random-generator`** | Implemented | 1,456 lines, 32 tests — the most mature of the group |
| **`treasury`** | Implemented | 709 lines, 13 tests |
| **`quest-ledger-v2`** | Implemented | 401 lines, 4 tests |
| **`achievement-badge`** | Implemented | 920 lines, 24 tests — Soulbound quest/XP tokens |
| **`tournament-system`** | Implemented | 906 lines, 19 tests |
| **`access-control`** | Partial | Real RBAC logic, zero tests |
| **`coin-flip`** | Partial | Real logic (exposure tracking, round history), zero tests |
| **`prize-pool`** | Partial | Real logic, zero tests — this contract moves money, treat the missing tests as a blocker before relying on it |
| **`pattern-puzzle`** | Partial | 1,022 lines, 13 tests, 4 open TODOs |
| **`leaderboard`** | Partial | Real score-submission and ranking logic |

"Implemented" here means "has a real test suite," not "audited" — none of these contracts have had a third-party security audit yet.

---

## The `coin-flip` Contract

Public interface (subject to change while the contract is untested):

```rust
pub trait CoinFlipTrait {
    fn initialize(env: Env, admin: Address, vault: Address, fee_bps: u32);

    fn place_bet(
        env: Env,
        player: Address,
        wager: i128,
        side: u32, // 0 = Heads, 1 = Tails
        client_seed: BytesN<32>,
    ) -> Result<u64, Error>;

    fn settle_round(
        env: Env,
        round_id: u64,
        server_seed: BytesN<32>,
    ) -> Result<Address, Error>;

    fn get_round(env: Env, round_id: u64) -> Option<RoundData>;
}
```

---

## The `prize-pool` Contract

Real public functions, from `contracts/prize-pool/src/lib.rs`:

| Function | Purpose |
| :--- | :--- |
| `init(admin, token)` | One-time setup |
| `fund(from, amount)` | Deposit into the pool |
| `reserve(admin, game_id, amount)` / `release(admin, game_id, amount)` | Earmark and release funds per game |
| `payout(...)` | Pay out to a winner |
| `sync(admin)` | Reconcile pool accounting |
| `get_pool_state()`, `get_prize_pool_metrics()`, `get_config_snapshot()`, `get_prize_allocation_summary()`, `get_claim_pressure()` | Read-only state queries |

There's no jackpot-drawing or Merkle-proof-based claim function in the current contract — those were incorrectly documented here previously. Fee splits and payout percentages aren't fixed protocol constants; read `get_config_snapshot()` for the live configuration rather than assuming a specific split.

---

## How the SDK Talks to These Contracts

`@stellarcade/sdk` does **not** call Soroban RPC directly for game/prize state — it goes through the gateway's REST API (`client.games`, `client.prizes`, etc.), which is the layer that actually reads and writes the contracts above. The only direct on-chain interaction happening inside the SDK is transaction *signing*, via a registered `WalletConnector`:

```typescript
import { StellarCadeClient, FreighterConnector, createConfig } from "@stellarcade/sdk";

const client = new StellarCadeClient(createConfig({
  network: "testnet",
  gatewayUrl: "https://gateway.stellarcade.example",
  arbiterUrl: "https://arbiter.stellarcade.example",
  contracts: { /* ...contract addresses... */ },
}));

client.registerConnector(new FreighterConnector());
await client.connect("freighter");

// Reads go through the gateway, not directly to Soroban RPC:
const pool = await client.prizes.getPool("coin-flip");
```

See the [Quickstart](/quickstart) for the full connect-and-read flow.
