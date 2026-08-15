# Arcade Games Catalog & Client Integration

This guide documents how to query available games, request a round commitment, and play a round using `@stellarcade/sdk`.

---

## Game IDs

The SDK's `GameId` type is the source of truth for which games exist — each corresponds to a contract in `contracts/`:

| `GameId` | Backing Contract |
| :--- | :--- |
| `coin-flip` | `coin-flip` |
| `dice-roll` | `dice-roll` |
| `higher-lower` | `higher-lower` |
| `number-guess` | `number-guess` |
| `trivia` | `trivia-game` |
| `pattern-puzzle` | `pattern-puzzle` |

Which of these are actually live, in beta, or coming soon is served dynamically — don't hardcode it, call `client.games.list()`:

```typescript
const games = await client.games.list();

games.forEach((game) => {
  console.log(`[${game.id}] ${game.name} — ${game.status} — ${game.minStake}–${game.maxStake} ${game.asset}`);
});
```

---

## Playing a Round

Every round follows the same commit → play → settle → verify shape, regardless of game:

```typescript
import { StellarCadeClient, FreighterConnector, createConfig, verifyProof } from "@stellarcade/sdk";

const client = new StellarCadeClient(createConfig({
  network: "testnet",
  gatewayUrl: "https://gateway.stellarcade.example",
  arbiterUrl: "https://arbiter.stellarcade.example",
  contracts: { /* ...contract addresses... */ },
}));

client.registerConnector(new FreighterConnector());
const playerAddress = await client.connect("freighter");

// 1. Request a fresh commitment BEFORE staking
const commitment = await client.games.commitRound("coin-flip");

// 2. Submit the play
const clientSeed = crypto.randomUUID();
const tx = await client.games.play({
  gameId: "coin-flip",
  playerAddress,
  stake: "10.0000000",
  clientSeed,
  choice: { side: "heads" },
});

// 3. Wait for the transaction to settle
await client.waitForTx(tx.hash);

// 4. Fetch the result and verify it independently
const result = await client.games.getResult(commitment.roundId);
console.log("Outcome:", result.outcome, "Payout:", result.payout);
```

See the [Fairness Spec](/fairness) for how to independently verify the round's proof once it's revealed, and the [Complete Coinflip Walkthrough](/coinflip-duel) for a fully worked example on one specific game.
