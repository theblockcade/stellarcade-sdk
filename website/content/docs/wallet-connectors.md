# Wallet Connectors & Session Management

`@stellarcade/sdk` provides a standardized, non-custodial session management architecture via `WalletSessionService` and `WalletProviderAdapter`.

---

## The `WalletProviderAdapter` Interface

Any Stellar wallet provider (Freighter, Albedo, Passkeys, or custom hardware wallets) can be integrated by implementing the `WalletProviderAdapter` interface:

```typescript
export interface WalletProviderAdapter {
  isAvailable(): boolean;
  connect(): Promise<{
    address: string;
    provider: WalletProviderInfo;
    network: string;
  }>;
  disconnect?(): Promise<void>;
  signMessage?(message: string): Promise<string>;
  signTransaction?(xdr: string, opts?: { network?: string; networkPassphrase?: string }): Promise<string>;
}
```

---

## Connecting with Freighter

`FreighterAdapter` is the official adapter for the Freighter browser extension:

```typescript
import { FreighterAdapter, WalletSessionService } from "@stellarcade/sdk";

const session = new WalletSessionService({
  sessionExpiryMs: 1000 * 60 * 60 * 24 * 7, // 7 days
  supportedNetworks: ["TESTNET", "PUBLIC"],
});

const freighter = new FreighterAdapter();
session.setProviderAdapter(freighter);

// Connect wallet
const meta = await session.connect({ network: "TESTNET" });
console.log("Connected:", meta.address, "on", meta.network);
```

---

## Managing Subscriptions & Session State

`WalletSessionService` provides real-time state broadcasts for reactive user interfaces (React, Vue, or Svelte):

```typescript
const unsubscribe = session.subscribe((state, meta, error, refreshState) => {
  console.log("Current State:", state); // DISCONNECTED | CONNECTING | CONNECTED | RECONNECTING
  console.log("Active Address:", meta?.address);
  console.log("Refresh Phase:", refreshState.phase);
});

// Clean up listener
unsubscribe();
```

---

## Automatic Session Recovery & Heartbeat

When a user returns to your application, `reconnect()` safely re-verifies session validity with exponential backoff:

```typescript
try {
  const restoredMeta = await session.reconnect();
  console.log("Session restored without prompting user:", restoredMeta.address);
} catch (error) {
  console.log("Session expired or rejected; prompt reconnect.");
}
```

---

## Handling Errors

`@stellarcade/sdk` provides typed errors for all wallet failure modes:

| Error Class | Code | Cause |
| :--- | :--- | :--- |
| `ProviderNotFoundError` | `provider_not_found` | Wallet extension is not installed in the browser |
| `RejectedSignatureError` | `rejected_signature` | User dismissed or rejected the signature popup |
| `StaleSessionError` | `stale_session` | Cached session exceeded expiry window |
| `ValidationError` | `validation_error` | Unsupported network requested |
