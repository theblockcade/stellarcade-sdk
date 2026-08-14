# Introduction to StellarCade SDK

`@stellarcade/sdk` is the official TypeScript/JavaScript client SDK for **TheBlockCade** (StellarCade), a provably-fair arcade platform built on Stellar and Soroban.

It handles client-side fairness verification, non-custodial wallet connections (Freighter and Passkey), Soroban contract reads/writes, prize pool queries, and quest progress tracking.

> [!TIP]
> Every game outcome can be independently recomputed and verified client-side using standard WebCrypto SHA-256 primitives — no server round-trip required.

---

## Architecture

StellarCade is split across a few repositories:

- **`@stellarcade/web`** — the Next.js frontend
- **`@stellarcade/sdk`** — this package: fairness verification, wallet adapters, contract clients, quest/XP registry
- **Soroban contracts** — `coin-flip` (duel logic), `random-generator` (RNG), `prize-pool` (vault escrow), `achievement-badge` (SBTs)
- **stellarcade-arbiter** — hash-chained audit log and dispute resolution

The SDK is the client layer between the web app and the on-chain contracts.

### Provably fair execution

Each round starts with a server seed commitment: the server publishes `SHA-256(serverSeed)` before the player bets. Once the round settles, the server reveals `serverSeed`, and the outcome can be recomputed from `serverSeed`, `clientSeed`, `nonce`, and the ledger hash. Any client can verify this offline once the seed is revealed.

### Non-custodial

The SDK never holds or transmits private keys. Every state-changing action (staking, entering a prize pool, claiming rewards) is signed by the user's own wallet (e.g. Freighter).

### Built on Soroban

Stellar's ~5 second ledger times and low transaction fees make it practical to settle arcade-style rounds on-chain.

---

## SDK Modules

| Module | Export | Description |
| :--- | :--- | :--- |
| **Fairness** | `verifyRound`, `computeCommitment` | Client-side commitment and entropy verification |
| **Wallets** | `FreighterAdapter`, `WalletSessionService` | Wallet session lifecycle and reconnection |
| **Contracts** | `SorobanClient`, `CoinFlipClient` | RPC bindings for deployed Soroban contracts |
| **Prize Pools** | `PrizePoolClient`, `fetchPoolState` | Pool balances and reserve state |
| **Telemetry** | `AuditLogger`, `ContractEventFeed` | Audit log and ledger event streams |

---

## Next Steps

- Follow the [Installation Guide](/docs/installation) to add `@stellarcade/sdk` to your project.
- Check the [Quickstart](/docs/quickstart) for a working example.
- Read the [Fairness Verification spec](/docs/fairness) for the full cryptographic details.
