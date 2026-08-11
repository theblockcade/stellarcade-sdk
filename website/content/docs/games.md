# Arcade Games Catalog & Client Integration

StellarCade features a catalog of on-chain, provably-fair games powered by Soroban smart contracts. This guide documents how to query available tables, place wagers, and listen for match settlements using the SDK.

---

## Active Games Catalog

| Game ID | Name | Category | Base Wager | Smart Contract | Provable Mechanism |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `coinflip-duel` | **Coinflip Duel** | PVP / 1v1 | 5 – 100 XLM | `coin-flip` | 50/50 SHA-256 Commit-Reveal |
| `rng-dice` | **Verifiable Dice** | Table / RNG | 10 – 250 XLM | `random-generator` | 6-Sided Modular Entropy |
| `prizepool-gauntlet` | **Prize Pool Gauntlet** | Jackpot / Pool | 25 – 500 XLM | `prize-pool` | Multi-Stage Escrow Pool |

---

## Querying Games with `ApiClient`

```typescript
import { ApiClient } from "@stellarcade/sdk";

const client = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Fetch all active games
const result = await client.getGames();

if (result.success) {
  result.data.forEach((game) => {
    console.log(`[${game.id}] ${game.name} - Status: ${game.status}`);
  });
}
```

---

## Placing a Match Wager & Executing a Duel

To initiate a duel match:

```typescript
import { CoinFlipClient, SorobanClient, CoinFlipSide } from "@stellarcade/sdk";

const soroban = new SorobanClient({
  rpcUrl: "https://soroban-testnet.stellar.org",
  networkPassphrase: "Test SDF Network ; September 2015",
});

const coinFlip = new CoinFlipClient({
  client: soroban,
  contractId: process.env.NEXT_PUBLIC_COIN_FLIP_CONTRACT_ID!,
});

// 1. Place a bet on Heads (0) with a 10 XLM wager
const tx = await coinFlip.placeBet({
  playerAddress: "GBZXN7PIRZGNMHGA72STUFIO",
  wagerAmountXlm: 10,
  side: CoinFlipSide.Heads,
  clientSeed: "MY_RANDOM_CLIENT_SEED_99",
});

console.log("Transaction Envelope Created:", tx.xdr);

// 2. Sign transaction via Freighter
const signedXdr = await window.freighter.signTransaction(tx.xdr);

// 3. Broadcast to Soroban
const receipt = await soroban.submitTransaction(signedXdr);
console.log("Duel Settled On-Chain! TxHash:", receipt.hash);
```

---

## Listening to Live Match Events

Subscribe to real-time on-chain duel events using `useContractEvents`:

```typescript
import { useContractEvents } from "@stellarcade/sdk";

const { events, isSubscribed } = useContractEvents({
  contractId: "CDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
  topic: "game_settled",
  onEvent: (event) => {
    console.log("New Game Settled:", event.data);
    console.log("Winner:", event.data.winner);
    console.log("Payout:", event.data.payoutAmount, "XLM");
  },
});
```
