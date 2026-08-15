# Complete SDK API Reference

Every export from `@stellarcade/sdk`'s entry point.

---

## 1. Client

### `class StellarCadeClient`
The single entry point most integrators use. Wraps every domain client plus wallet-connector management and transaction submission around one shared config.

```typescript
constructor(config: StellarCadeConfig)
```

| Member | Type | Description |
| :--- | :--- | :--- |
| `.games` | `GamesClient` | Games catalog and round lifecycle |
| `.prizes` | `PrizesClient` | Prize pool state and claims |
| `.quests` | `QuestsClient` | Quest progress and claims |
| `.leaderboard` | `LeaderboardClient` | Ranked player scores |
| `.tournaments` | `TournamentsClient` | Tournament listing and entry |
| `.connectors` | `ConnectorRegistry` | Registered wallet connectors |
| `.registerConnector(connector)` | `void` | Registers a `WalletConnector` |
| `.connect(connectorId)` | `Promise<string>` | Activates a registered connector and returns the connected address |
| `.signTransaction(xdr)` | `Promise<string>` | Signs an XDR envelope with the active connector |
| `.waitForTx(hash, options?)` | `Promise<TxSubmitResult>` | Polls the gateway until the transaction settles |

### `createConfig(options: CreateConfigOptions): StellarCadeConfig`
Builds and validates a `StellarCadeConfig`. `network` is required and has no default — passing a `networkPassphrase` that doesn't match `network` throws `NetworkMismatchError` rather than silently connecting to the wrong ledger.

```typescript
interface CreateConfigOptions {
  network: "testnet" | "mainnet" | "futurenet" | "local";
  rpcUrl?: string;          // defaults per network
  horizonUrl?: string;      // defaults per network
  networkPassphrase?: string; // defaults per network
  gatewayUrl: string;
  arbiterUrl: string;
  contracts: ContractAddresses;
}
```

### `isMainnet(config: StellarCadeConfig): boolean`

---

## 2. Fairness

### `verifyProof(commitment: RoundCommitment, proof: FairnessProof): Promise<VerifyProofResult>`
Full end-to-end verification: checks the commitment matches the revealed seed, then recomputes the derived value and confirms it matches what the proof claims. The one function a player or auditor needs — no API trust required, only the published proof.

```typescript
interface VerifyProofResult {
  valid: boolean;
  derivedValue: string; // hex
  reason?: string;      // present when valid === false
}
```

### `verifyCommitment(commitment: RoundCommitment, reveal: RoundReveal): Promise<boolean>`
Recomputes `sha256(reveal.serverSeed)` and compares it against `commitment.commitHash`.

### `deriveOutcomeValue(reveal: RoundReveal): Promise<bigint>`
Derives the pseudo-random value from `serverSeed:clientSeed:nonce:ledgerHash`, SHA-256'd and read as a full 256-bit unsigned integer.

### `mapToRange(value: bigint, size: number): number`
Maps a derived value onto `[0, size)` via `value % BigInt(size)` on the full digest. Throws `FairnessVerificationError` if `size <= 0`.

---

## 3. Wallets

### `interface WalletConnector`
Implement this to add a wallet beyond the built-in Freighter connector.

```typescript
interface WalletConnector {
  readonly id: string;
  readonly name: string;
  isAvailable(): Promise<boolean>;
  connect(): Promise<string>;
  disconnect(): Promise<void>;
  getAddress(): Promise<string | null>;
  signTransaction(xdr: string, opts: { networkPassphrase: string }): Promise<string>;
}
```

### `class FreighterConnector implements WalletConnector`
Wraps the Freighter browser-extension API (`window.freighterApi`). Never sees a secret key — only signed XDR coming back out of `signTransaction`.

### `class ConnectorRegistry`
`register(connector)`, `list()`, `get(id)`, `setActive(id)`, `getActive()`. `StellarCadeClient` owns one of these at `.connectors`; you rarely construct it directly.

---

## 4. Games, Prizes, Quests, Leaderboard, Tournaments

All five are thin REST clients over the gateway. Access them via `client.games`, `client.prizes`, etc., or construct directly with a `gatewayUrl`.

### `class GamesClient`
| Method | Returns |
| :--- | :--- |
| `list()` | `Promise<GameSummary[]>` |
| `get(gameId)` | `Promise<GameSummary>` |
| `commitRound(gameId)` | `Promise<RoundCommitment>` — request a fresh commitment before any stake is placed |
| `play(input: PlayRoundInput)` | `Promise<TxSubmitResult>` |
| `getResult(roundId)` | `Promise<RoundResult>` |

### `class PrizesClient`
`getPool(gameId)`, `listPools()`, `claim(poolId, playerAddress)`.

### `class QuestsClient`
`listForPlayer(playerAddress)`, `claim(questId, playerAddress)`.

### `class LeaderboardClient`
`get(query?: { gameId?, limit? })`.

### `class TournamentsClient`
`list()`, `get(tournamentId)`, `enter(tournamentId, playerAddress)`.

---

## 5. Transactions

### `pollTxStatus(gatewayUrl, hash, options?): Promise<TxSubmitResult>`
Polls the gateway for a submitted transaction until it settles or the timeout elapses (default 30s, 1.5s interval). Soroban confirmation isn't instant — callers that need a final result should await this rather than trusting the immediate submit response. Usually called via `client.waitForTx()`.

---

## 6. Errors

Every SDK error extends `StellarCadeError` (`message`, `code`, optional `cause`).

| Class | Code | Thrown when |
| :--- | :--- | :--- |
| `ConfigError` | `CONFIG_ERROR` | `createConfig()` is missing a required field |
| `NetworkMismatchError` | `NETWORK_MISMATCH` | `networkPassphrase` doesn't match `network` |
| `RpcError` | `RPC_ERROR` | A gateway/arbiter request fails or returns non-OK |
| `NotConnectedError` | `NOT_CONNECTED` | An action needs a connected wallet and none is active |
| `FairnessVerificationError` | `FAIRNESS_VERIFICATION_FAILED` | `mapToRange()` is called with an invalid range |
| `TxTimeoutError` | `TX_TIMEOUT` | `pollTxStatus()` exceeds its timeout without settling |

---

## 7. Types

The full type surface (`GameId`, `GameSummary`, `RoundCommitment`, `RoundReveal`, `RoundResult`, `FairnessProof`, `PrizePoolState`, `QuestProgress`, `LeaderboardEntry`, `TournamentSummary`, `TxSubmitResult`, `StellarCadeConfig`, `ContractAddresses`, `Network`) is re-exported from the package root — see `types.ts` in the SDK source for exact field shapes.
