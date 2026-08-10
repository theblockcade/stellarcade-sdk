---
description: How wallet connectors work and how to add one.
---

## The contract

```ts
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

A connector never sees or stores a secret key inside the SDK process — it
delegates signing to whatever it wraps (a browser extension, a passkey
signer, a hardware wallet) and only returns signed XDR.

## Built in: Freighter

```ts
import { FreighterConnector } from "stellarcade-sdk";

client.registerConnector(new FreighterConnector());
await client.connect("freighter");
```

## Writing your own

Implement the interface above and register it the same way. Community
connectors (passkeys, hardware wallets, additional browser extensions) belong
in `contrib/` — see [CONTRIBUTING.md](https://github.com/TheBlockCade/stellarcade-sdk/blob/main/CONTRIBUTING.md)
in the SDK repo.
