# Wallet Connectors

`@stellarcade/sdk` provides a small `WalletConnector` interface and one built-in implementation (`FreighterConnector`). There's no session-persistence service, heartbeat, or reconnect-with-backoff layer in the SDK — a connector is stateless from the SDK's point of view beyond tracking which one is currently active.

---

## The `WalletConnector` Interface

Any wallet provider can be integrated by implementing this interface — it never receives or stores a private key, only signs and returns XDR:

```typescript
export interface WalletConnector {
  readonly id: string;
  readonly name: string;
  isAvailable(): Promise<boolean>;
  connect(): Promise<string>;
  disconnect(): Promise<void>;
  getAddress(): Promise<string | null>;
  signTransaction(xdr: string, opts: { networkPassphrase: string }): Promise<string>;
}
```

---

## Connecting with Freighter

`FreighterConnector` wraps the Freighter browser extension's `window.freighterApi` — no separate package to install (see [Installation](/installation)):

```typescript
import { StellarCadeClient, FreighterConnector, createConfig } from "@stellarcade/sdk";

const client = new StellarCadeClient(createConfig({
  network: "testnet",
  gatewayUrl: "https://gateway.stellarcade.example",
  arbiterUrl: "https://arbiter.stellarcade.example",
  contracts: { /* ...contract addresses... */ },
}));

client.registerConnector(new FreighterConnector());

try {
  const address = await client.connect("freighter");
  console.log("Connected:", address);
} catch (error) {
  console.error("Connection failed:", error);
}
```

`client.connect(connectorId)` looks the connector up in `client.connectors`, sets it active, and calls its `connect()`. Once connected, `client.signTransaction(xdr)` delegates to whichever connector is active.

---

## Writing a Custom Connector

Implement `WalletConnector` and register it the same way — nothing else in the SDK needs to know it isn't Freighter:

```typescript
import type { WalletConnector } from "@stellarcade/sdk";

export class MyWalletConnector implements WalletConnector {
  readonly id = "my-wallet";
  readonly name = "My Wallet";
  private address: string | null = null;

  async isAvailable() {
    return typeof window !== "undefined" && !!window.myWallet;
  }

  async connect() {
    this.address = await window.myWallet.requestAddress();
    return this.address;
  }

  async disconnect() {
    this.address = null;
  }

  async getAddress() {
    return this.address;
  }

  async signTransaction(xdr: string, opts: { networkPassphrase: string }) {
    return window.myWallet.sign(xdr, opts.networkPassphrase);
  }
}

client.registerConnector(new MyWalletConnector());
await client.connect("my-wallet");
```

---

## Handling Errors

`FreighterConnector` throws typed errors, all extending `StellarCadeError`:

| Situation | Error | `code` |
| :--- | :--- | :--- |
| `window.freighterApi` isn't present | `StellarCadeError` | `FREIGHTER_NOT_FOUND` |
| User rejects, or the extension errors, on connect | `StellarCadeError` | `FREIGHTER_CONNECT_FAILED` |
| Signing fails | `StellarCadeError` | `FREIGHTER_SIGN_FAILED` |
| An action needs a connected wallet and none is active | `NotConnectedError` | `NOT_CONNECTED` |

See the [API Reference](/api-reference) for the full error hierarchy.
