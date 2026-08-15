# Coinflip Integration Walkthrough

`coin-flip` (`GameId: "coin-flip"`) is a 50/50 round backed by the `coin-flip` Soroban contract — see [Soroban Smart Contracts](/contracts) for its current status (real logic, zero tests as of this writing).

---

## Round Mechanics

- **Wager bounds and fee**: set per-deployment by the contract admin at `initialize(admin, vault, fee_bps)` — call `client.games.get("coin-flip")` for the live `minStake`/`maxStake` rather than assuming fixed numbers.
- **Odds**: exactly 50.00% — the outcome is `derivedValue % 2`, so `0` and `1` are equally likely by construction (see [Fairness Spec](/fairness)).
- **Choice payload**: `{ side: "heads" | "tails" }`, passed as `PlayRoundInput.choice`.

---

## Complete Integration Walkthrough

### 1. Commit and Play

```typescript
import { StellarCadeClient, FreighterConnector, createConfig } from "@stellarcade/sdk";

const client = new StellarCadeClient(createConfig({
  network: "testnet",
  gatewayUrl: "https://gateway.stellarcade.example",
  arbiterUrl: "https://arbiter.stellarcade.example",
  contracts: { /* ...contract addresses... */ },
}));

client.registerConnector(new FreighterConnector());
const playerAddress = await client.connect("freighter");

const commitment = await client.games.commitRound("coin-flip");

const tx = await client.games.play({
  gameId: "coin-flip",
  playerAddress,
  stake: "10.0000000",
  clientSeed: crypto.randomUUID(),
  choice: { side: "heads" },
});

console.log("Submitted. Tx hash:", tx.hash);
```

### 2. Wait for Settlement and Read the Result

```typescript
await client.waitForTx(tx.hash);

const result = await client.games.getResult(commitment.roundId);
console.log("Outcome:", result.outcome, "| Payout:", result.payout);
```

### 3. Verify the Proof Independently

Once the round is revealed, fetch the proof and check it yourself — no need to trust the gateway's `getResult` response:

```typescript
import { verifyProof } from "@stellarcade/sdk";

const response = await fetch(`https://arbiter.stellarcade.example/proofs/${commitment.roundId}`);
const proof = await response.json();

const verification = await verifyProof(commitment, proof);
console.log("Independently verified?", verification.valid);
```

See [Provable Fairness Spec](/fairness) for what `verifyProof` checks and a real, reproducible test vector.
