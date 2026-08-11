# Complete SDK API Reference

Exhaustive TypeScript API reference for all modules and exports provided by `@stellarcade/sdk`.

---

## 1. Provable Fairness Engine

### `verifyFairnessProof(input: VerificationInput): Promise<FairnessVerificationOutcome>`
Asynchronously validates a round's cryptographic commitment and computes the final game outcome using WebCrypto SHA-256 primitives.

#### Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `input.serverSeed` | `string` | **Yes** | The revealed 32-byte secret string from the game server |
| `input.commitHash` | `string` | **Yes** | The original SHA-256 hash published before round initiation |
| `input.clientSeed` | `string` | **Yes** | The client entropy string provided by the player |
| `input.nonce` | `number` | **Yes** | The incremental match sequence counter |
| `input.ledgerHash` | `string` | No | Optional Stellar ledger hash for multi-source entropy |
| `input.rangeSize` | `number` | **Yes** | Modular divisor (e.g. 2 for coinflip, 6 for dice, 100 for percentile) |

#### Return Type
```typescript
interface FairnessVerificationOutcome {
  isValid: boolean;              // True if recomputed commitment matches published hash
  commitmentMatch: boolean;      // True if SHA-256(serverSeed) === commitHash
  recomputedCommitHash: string;  // Hex string of SHA-256(serverSeed)
  derivedHex: string;            // First 16 hex characters of the combined entropy digest
  mappedOutcome: number;         // Integer result between 0 and (rangeSize - 1)
  gameLabel: string;             // Human-readable outcome label (e.g. "Heads", "Dice 5")
}
```

---

## 2. Wallet Session Management

### `class WalletSessionService`
Manages non-custodial wallet connections, session persistence in localStorage, automatic heartbeats, and exponential retry backoff.

#### Methods
- `setProviderAdapter(adapter: WalletProviderAdapter): void`
- `connect(options?: { network?: string }): Promise<WalletSessionMeta>`
- `disconnect(): Promise<void>`
- `reconnect(): Promise<WalletSessionMeta>`
- `subscribe(fn: (state, meta, error, refreshState) => void): () => void`
- `getState(): WalletSessionState`
- `getMeta(): WalletSessionMeta | null`

---

## 3. Soroban RPC Client

### `class SorobanClient`
Direct RPC communication wrapper with connection pooling, simulated invocations, and transaction receipt polling.

```typescript
const client = new SorobanClient({
  rpcUrl: string;
  networkPassphrase: string;
  timeoutMs?: number;
});
```

#### Methods
- `simulateTransaction(xdr: string): Promise<SimulateTransactionResponse>`
- `submitTransaction(signedXdr: string): Promise<SendTransactionResponse>`
- `getContractEvents(filter: EventFilter): Promise<ContractEvent[]>`

---

## 4. Error Code Taxonomy

| Code | Severity | Description |
| :--- | :--- | :--- |
| `API_VALIDATION_ERROR` | `TERMINAL` | Malformed parameters or wager below minimum threshold |
| `API_UNAUTHORIZED` | `TERMINAL` | Missing or invalid auth session token |
| `API_RATE_LIMITED` | `RETRYABLE` | Too many requests; SDK backs off automatically |
| `API_SERVER_ERROR` | `RETRYABLE` | Upstream Soroban node temporary failure |
| `API_NETWORK_ERROR` | `RETRYABLE` | Client offline or socket connection dropped |
