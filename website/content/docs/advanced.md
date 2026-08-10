---
description: Custom polling, error handling, and low-level access.
---

## Custom transaction polling

```ts
await client.waitForTx(tx.hash, { timeoutMs: 60_000, intervalMs: 2_000 });
```

## Handling specific error codes

```ts
import { RpcError, TxTimeoutError } from "stellarcade-sdk";

try {
  await client.games.play(input);
} catch (err) {
  if (err instanceof TxTimeoutError) {
    // the tx may still confirm later — re-poll `err.hash` before retrying
  } else if (err instanceof RpcError) {
    console.error(err.status, err.message);
  } else {
    throw err;
  }
}
```

## Using the domain clients standalone

Every domain client only needs a `gatewayUrl` string — you don't have to go
through `StellarCadeClient` if you're building something narrower:

```ts
import { GamesClient } from "stellarcade-sdk";

const games = new GamesClient("https://gateway.testnet.theblockcade.xyz");
const list = await games.list();
```

## Verifying historical rounds in bulk

`verifyProof` has no side effects and no network calls, so it's safe to run
over an archive of past rounds in a CI job or a scheduled audit script — see
[Fairness Verification](/docs/fairness) for the algorithm if you want to
reimplement it outside JavaScript.
