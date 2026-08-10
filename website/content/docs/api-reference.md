---
description: Full exported API surface.
---

## Client

- `StellarCadeClient` — the facade; owns `games`, `prizes`, `quests`,
  `leaderboard`, `tournaments`, and connector management.
- `createConfig(options)` — builds and validates a `StellarCadeConfig`.
- `isMainnet(config)`

## Domain clients

- `GamesClient` — `list`, `get`, `commitRound`, `play`, `getResult`
- `PrizesClient` — `listPools`, `getPool`, `claim`
- `QuestsClient` — `listForPlayer`, `claim`
- `LeaderboardClient` — `get`
- `TournamentsClient` — `list`, `get`, `enter`

## Wallets

- `ConnectorRegistry`, `WalletConnector` (interface)
- `FreighterConnector`

## Fairness

- `verifyCommitment(commitment, reveal)`
- `deriveOutcomeValue(reveal)`
- `mapToRange(value, size)`
- `verifyProof(commitment, proof)`

## Transactions

- `pollTxStatus(gatewayUrl, hash, options?)`
- `request(baseUrl, path, options?)` / `withTimeout(ms)` — the low-level fetch
  wrapper every client above is built on

## Errors

All SDK errors extend `StellarCadeError` and carry a stable `code`:

| Class | code |
|---|---|
| `ConfigError` | `CONFIG_ERROR` |
| `NetworkMismatchError` | `NETWORK_MISMATCH` |
| `RpcError` | `RPC_ERROR` |
| `NotConnectedError` | `NOT_CONNECTED` |
| `FairnessVerificationError` | `FAIRNESS_VERIFICATION_FAILED` |
| `TxTimeoutError` | `TX_TIMEOUT` |

Full type definitions ship in `dist/index.d.ts` — your editor's autocomplete
is the most current reference.
