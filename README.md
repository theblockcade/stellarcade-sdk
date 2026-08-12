# stellarcade-sdk

[![CI](https://github.com/TheBlockCade/stellarcade-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/TheBlockCade/stellarcade-sdk/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

TypeScript client SDK for **TheBlockCade** — a provably-fair arcade platform on
Stellar/Soroban. One client for games, prize pools, quests, leaderboards and
tournaments, plus **client-side fairness verification** that needs nothing but
a published proof: no API trust required.

Full docs, including a step-by-step fairness walkthrough, live at
**[docs.theblockcade.xyz](https://docs.theblockcade.xyz)** (source in
[`website/`](website)).

## Install

```bash
npm install stellarcade-sdk
```

## Quickstart

```ts
import { StellarCadeClient, createConfig, FreighterConnector } from "stellarcade-sdk";

const config = createConfig({
  network: "testnet",
  gatewayUrl: "https://stellarcade-backend.onrender.com/api",
  arbiterUrl: "https://stellarcade-arbiter.onrender.com",
  contracts: {
    accessControl: "CC2IRAYC3CT5KAV4PZKXKCE45Z3QAJQSJH7P5J3GITJT4T3KZ6634R7K",
    randomGenerator: "CAMYBISVQSSVJ3EPAZQWKPTTPGTYY5XIS2BZAG4TYFWTUKHQNPVXAV4O",
    prizePool: "CBVNIITX42KQA3MKNUBKG4YIK4FCASZQWKWGHY3YYMM4ANGZ6MOZI2EC",
    achievementBadge: "CC7SDE6RRV4X7XRHU6OM6GLDIKBC6EZYNHTRGDLEHYNVUWWO3LUJLA5M",
    games: { "coin-flip": "CDP77TELLHACC46EHR3N4ISRWJME446AGK5RM7D4D42YKDCB4LXICKTE" },
  },
});

const client = new StellarCadeClient(config);
client.registerConnector(new FreighterConnector());
await client.connect("freighter");

const commitment = await client.games.commitRound("coin-flip");
const tx = await client.games.play({
  gameId: "coin-flip",
  playerAddress: await client.connectors.getActive()!.getAddress()!,
  stake: "10.0000000",
  clientSeed: crypto.randomUUID(),
  choice: { side: "heads" },
});
await client.waitForTx(tx.hash);
```

## Verifying a result yourself

This is the point of the SDK. Once a round settles, the arbiter publishes a
{@link FairnessProof}. You do not have to trust our server:

```ts
import { verifyProof } from "stellarcade-sdk";

const result = await verifyProof(commitment, proof);
if (!result.valid) {
  throw new Error(`Round ${proof.roundId} failed verification: ${result.reason}`);
}
```

`verifyProof` runs entirely on `Web Crypto` — it works offline, in a browser
console, or in a CI job that audits historical rounds. See
[`website/content/docs/fairness.md`](website/content/docs/fairness.md) (via the
docs site) for the full commit-reveal design.

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Apache-2.0 — see [LICENSE](LICENSE). See [NOTICE](NOTICE) for third-party
attribution.
