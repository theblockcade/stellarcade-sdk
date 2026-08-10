---
description: Play your first round in under a minute.
---

## 1. Build a config

`network` has no default on purpose — connecting to the wrong ledger with a
signed transaction is a fund-losing mistake, so you always say which network
you mean:

```ts
import { createConfig } from "stellarcade-sdk";

const config = createConfig({
  network: "testnet",
  gatewayUrl: "https://gateway.testnet.theblockcade.xyz",
  arbiterUrl: "https://arbiter.testnet.theblockcade.xyz",
  contracts: {
    accessControl: "C...",
    randomGenerator: "C...",
    prizePool: "C...",
    leaderboard: "C...",
    questLedger: "C...",
    treasury: "C...",
    games: { "coin-flip": "C..." },
  },
});
```

## 2. Connect a wallet

```ts
import { StellarCadeClient, FreighterConnector } from "stellarcade-sdk";

const client = new StellarCadeClient(config);
client.registerConnector(new FreighterConnector());
const address = await client.connect("freighter");
```

## 3. Commit, then play

The commitment must happen **before** you place a stake — that ordering is
what makes the round provably fair. See [How It Works](/docs/how-it-works).

```ts
const commitment = await client.games.commitRound("coin-flip");

const tx = await client.games.play({
  gameId: "coin-flip",
  playerAddress: address,
  stake: "10.0000000",
  clientSeed: crypto.randomUUID(),
  choice: { side: "heads" },
});

const settled = await client.waitForTx(tx.hash);
```

## 4. Verify the result

```ts
import { verifyProof } from "stellarcade-sdk";

const proof = await fetch(settled.proofUrl ?? "").then((r) => r.json());
const result = await verifyProof(commitment, proof);
console.log(result.valid ? "Fair ✓" : `Failed: ${result.reason}`);
```

Next: [How It Works](/docs/how-it-works) for the full round lifecycle, or
jump straight to [Fairness Verification](/docs/fairness).
