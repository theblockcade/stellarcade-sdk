# Tournaments & Bracket Battles

StellarCade supports scheduled tournament brackets, high-roller invitationals, and community elimination tournaments with pooled entry fees and on-chain payout distribution.

---

## Tournament Format & Structure

Tournaments execute under single-elimination or Swiss bracket formats governed by the `prize-pool` smart contract:

| Stage | Duration | Rules |
| :--- | :--- | :--- |
| **Registration** | 24 Hours prior | Players deposit entry fee into the tournament escrow pool |
| **Seeding & Pairings** | 10 Minutes prior | Seedings generated deterministically from the latest Stellar ledger hash |
| **Round Execution** | 5 Minutes per match | Players duel in best-of-3 rounds with instant commit-reveal verification |
| **Payout Distribution** | Immediate upon final | Smart contract releases top 3 payouts automatically |

---

## Entering and Managing Tournaments with the SDK

```typescript
import { TournamentClient, SorobanClient } from "@stellarcade/sdk";

const soroban = new SorobanClient({
  rpcUrl: "https://soroban-testnet.stellar.org",
  networkPassphrase: "Test SDF Network ; September 2015",
});

const tournaments = new TournamentClient({ client: soroban });

// 1. Fetch active and upcoming tournaments
const activeTournaments = await tournaments.listTournaments({ status: "open" });

const targetTournament = activeTournaments[0];
console.log(`Tournament: ${targetTournament.title}`);
console.log(`Entry Fee: ${targetTournament.entryFeeXlm} XLM`);
console.log(`Total Prize Pool: ${targetTournament.totalPrizePoolXlm} XLM`);

// 2. Register for tournament
const regTx = await tournaments.buildRegisterTransaction(targetTournament.id);
const signedReg = await window.freighter.signTransaction(regTx.xdr);
await soroban.submitTransaction(signedReg);

console.log("Successfully registered for tournament!");
```

---

## Payout Matrix

Standard tournament prize splits follow a tiered distribution curve:

- **1st Place**: 60% of total pool
- **2nd Place**: 25% of total pool
- **3rd Place**: 15% of total pool
