# Coinflip Duel Engine Integration

The **Coinflip Duel Engine** is StellarCade's high-frequency 1v1 PvP and player-vs-house duel system.

---

## Duel Mechanics

- **Wagers**: 5, 10, 25, 50, or 100 XLM.
- **Odds**: Exactly 50.00% (Heads = 0, Tails = 1).
- **Fee**: 2% protocol fee (routed to the autonomous prize pool vault).
- **Settlement Speed**: Sub-second client resolution with on-chain Soroban confirmation in 3-5 seconds.

---

## Complete Integration Walkthrough

### 1. Initiate Duel Match
```typescript
import { CoinFlipClient, CoinFlipSide, SorobanClient } from "@stellarcade/sdk";

const soroban = new SorobanClient({
  rpcUrl: "https://soroban-testnet.stellar.org",
  networkPassphrase: "Test SDF Network ; September 2015",
});

const duelClient = new CoinFlipClient({
  client: soroban,
  contractId: process.env.NEXT_PUBLIC_COIN_FLIP_CONTRACT_ID!,
});

// Create new duel challenge
const duel = await duelClient.createDuel({
  creator: "GBZXN7PIRZGNMHGA72STUFIO",
  wagerXlm: 25,
  pickedSide: CoinFlipSide.Heads,
  clientSeed: "MY_ENTROPY_SEED_123",
});

console.log("Duel Created! ID:", duel.duelId);
```

### 2. Settle & Claim Winnings
```typescript
const settlement = await duelClient.settleDuel(duel.duelId);

if (settlement.winner === "GBZXN7PIRZGNMHGA72STUFIO") {
  console.log("You won 49 XLM! Payout TxHash:", settlement.txHash);
} else {
  console.log("Opponent won the duel.");
}
```
