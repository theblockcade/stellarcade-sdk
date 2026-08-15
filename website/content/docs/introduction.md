# Introduction to StellarCade SDK

`@stellarcade/sdk` is the official TypeScript/JavaScript client SDK for **TheBlockCade** (StellarCade), a provably-fair arcade platform built on Stellar and Soroban.

It handles client-side fairness verification, non-custodial wallet connections (Freighter today, with a `WalletConnector` interface for adding others), transaction submission/polling, and REST access to games, prize pools, quests, the leaderboard, and tournaments.

> [!TIP]
> Every game outcome can be independently recomputed and verified client-side using standard WebCrypto SHA-256 primitives — no server round-trip required.

---

## Architecture

StellarCade is split across a few repositories:

- **`@stellarcade/web`** — the Next.js frontend
- **`@stellarcade/sdk`** — this package: fairness verification, wallet connectors, and REST clients for games/prizes/quests/leaderboard/tournaments
- **stellarcade-arbiter** — the service that commits round seeds, settles rounds, and maintains the hash-chained audit log the SDK's fairness functions verify against
- **stellarcade-bot** — the Telegram/Discord bot, a separate deployable service (not part of this SDK package)
- **Soroban contracts** — see [Soroban Smart Contracts](/contracts) for current status; most are in active development, not yet production-audited

The SDK's `StellarCadeClient` talks to the **gateway** (games/prizes/quests/leaderboard/tournaments, over REST) and the **arbiter** (round commitments and settlement) — it does not call Soroban RPC directly for any of that. The one thing that runs fully offline, client-side, with no API trust required, is fairness verification.

### Provably fair execution

Each round starts with a server seed commitment: the arbiter publishes `SHA-256(serverSeed)` before the player bets. Once the round settles, the arbiter reveals `serverSeed`, and the outcome can be recomputed from `serverSeed`, `clientSeed`, `nonce`, and the Stellar ledger hash. Any client can verify this offline once the seed is revealed — see the [Provable Fairness Spec](/fairness).

### Non-custodial

The SDK never holds or transmits private keys. Every state-changing action is signed by the user's own wallet through a registered `WalletConnector` (e.g. `FreighterConnector`).

### Built on Soroban

Stellar's ~5 second ledger times and low transaction fees make it practical to settle arcade-style rounds on-chain.

---

## SDK Modules

| Module | Export | Description |
| :--- | :--- | :--- |
| **Client** | `StellarCadeClient`, `createConfig` | Single entry point wrapping every domain client plus wallet-connector management and tx submission |
| **Fairness** | `verifyProof`, `verifyCommitment`, `deriveOutcomeValue`, `mapToRange` | Offline, client-side commitment and outcome verification |
| **Wallets** | `ConnectorRegistry`, `FreighterConnector`, `WalletConnector` (interface) | Wallet connector registration and the Freighter implementation |
| **Games / Prizes / Quests / Leaderboard / Tournaments** | `GamesClient`, `PrizesClient`, `QuestsClient`, `LeaderboardClient`, `TournamentsClient` | REST clients for the gateway, each exposed as a property on `StellarCadeClient` |
| **Transactions** | `pollTxStatus` | Polls the gateway for a submitted transaction's settled status |
| **Errors** | `StellarCadeError`, `ConfigError`, `NetworkMismatchError`, `RpcError`, `NotConnectedError`, `FairnessVerificationError`, `TxTimeoutError` | Typed error hierarchy shared across every module |

---

## Next Steps

- Follow the [Installation Guide](/installation) to add `@stellarcade/sdk` to your project.
- Check the [Quickstart](/quickstart) for a working example.
- Read the [Fairness Verification spec](/fairness) for the full cryptographic details.
