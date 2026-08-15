# Quickstart: 5-Minute Integration

Get up and running with `@stellarcade/sdk` in less than five minutes. This guide covers verifying a provably fair round, connecting a wallet, and reading live game/prize data.

---

## 1. Verify a Game Round Client-Side

Any client can verify a settled round's fairness offline, with no network request — the SDK's fairness functions run entirely on Web Crypto (`crypto.subtle`):

```typescript
import { verifyProof, type RoundCommitment, type FairnessProof } from "@stellarcade/sdk";

// Published by the arbiter BEFORE the round accepted any bet
const commitment: RoundCommitment = {
  roundId: "round_8f21ac",
  gameId: "coin-flip",
  commitHash: "2f7169620c59fd0f67e51eafa56e1dbeb6b2f1b5fa4b37e2ea3c30fbbcf20fe6",
  committedAtLedger: 512034,
  expiresAtLedger: 512134,
};

// Revealed by the arbiter after the round settled
const proof: FairnessProof = {
  roundId: "round_8f21ac",
  commitHash: "2f7169620c59fd0f67e51eafa56e1dbeb6b2f1b5fa4b37e2ea3c30fbbcf20fe6",
  serverSeed: "4f6a2e1c9b7d3f508a1c6e4b9d2f7a3c5e8b1d4f7a0c3e6b9d2f5a8c1e4b7d0f",
  clientSeed: "GBZXN7PIRZGNMHGA72STUFIO4921ABCDEFGH",
  nonce: 1,
  ledgerHash: "3a7c1e9f2b5d8046c9e2f5b8d1a4c7e0f3b6a9d2c5e8f1b4a7d0c3e6f9b2a5d8",
  derivedValue: "60ffc2e8901c052775f1940effeb81ff60082ad26d49c224f07f1d0e309d90ec",
  outcome: "heads",
};

const result = await verifyProof(commitment, proof);

console.log("Cryptographically valid?", result.valid);
console.log("Derived value:", result.derivedValue);
if (!result.valid) console.log("Reason:", result.reason);
```

`verifyProof` does two things internally, both of which you can also call directly: `verifyCommitment` confirms `sha256(serverSeed) === commitHash`, then `deriveOutcomeValue` + `mapToRange` recompute the outcome from the full revealed seed material and confirm it matches what the proof claims.

---

## 2. Connect a Wallet

Wallet connectors never touch a private key inside the SDK — they wrap whatever the extension provides (Freighter today) and only see a signed XDR envelope coming back out. Register one on a `StellarCadeClient` and connect through it:

```typescript
import { StellarCadeClient, FreighterConnector, createConfig } from "@stellarcade/sdk";

const config = createConfig({
  network: "testnet",
  gatewayUrl: "https://gateway.stellarcade.example",
  arbiterUrl: "https://arbiter.stellarcade.example",
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

const client = new StellarCadeClient(config);
client.registerConnector(new FreighterConnector());

try {
  const address = await client.connect("freighter");
  console.log("Connected Stellar address:", address);
} catch (error) {
  console.error("Wallet connection declined or missing:", error);
}
```

`createConfig` cross-checks `network` against `networkPassphrase` and throws rather than silently building a config that could sign for the wrong ledger — there's no default network, on purpose.

---

## 3. Read Games & Prize Pool State

Games, prize pools, quests, leaderboard, and tournaments are all read through the gateway's REST API via the matching client on `StellarCadeClient` — the SDK doesn't talk to Soroban RPC directly for these:

```typescript
const games = await client.games.list();
console.log("Available games:", games.map((g) => g.name));

const pool = await client.prizes.getPool("coin-flip");
console.log("Prize pool balance:", pool.balance, pool.asset);
```

---

## Next Steps

- Read the [Provable Fairness Spec](/fairness) for the full cryptographic details.
- See [Wallet Connectors](/wallet-connectors) for building a custom connector.
- Browse every export in the [API Reference](/api-reference).
