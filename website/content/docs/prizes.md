# Prize Pools & Vault Architecture

StellarCade implements on-chain liquidity vaults and community prize pools governed by the `prize-pool` Soroban smart contract.

---

## Vault Architecture & Yield Splits

Every match played on StellarCade routes a small percentage of its fee into the autonomous prize pool vault:

```
                  ┌───────────────────────────────┐
                  │    Match Stake (e.g. 100 XLM) │
                  └───────────────┬───────────────┘
                                  │
          ┌───────────────────────┴───────────────────────┐
          ▼                                               ▼
┌───────────────────────────────┐               ┌───────────────────────────────┐
│     Winner Payout (98%)       │               │      Vault Escrow (2%)        │
│          98 XLM               │               │            2 XLM              │
└───────────────────────────────┘               └───────────────┬───────────────┘
                                                                │
                                ┌───────────────────────────────┴───────────────────────────────┐
                                ▼                                                               ▼
                ┌───────────────────────────────┐                               ┌───────────────────────────────┐
                │     Weekly Jackpot (70%)      │                               │     Seasonal Quest Pool (30%) │
                │           1.40 XLM            │                               │            0.60 XLM           │
                └───────────────────────────────┘                               └───────────────────────────────┘
```

---

## Querying Prize Pool State with `PrizePoolClient`

```typescript
import { PrizePoolClient, SorobanClient } from "@stellarcade/sdk";

const soroban = new SorobanClient({
  rpcUrl: "https://soroban-testnet.stellar.org",
  networkPassphrase: "Test SDF Network ; September 2015",
});

const pool = new PrizePoolClient({
  client: soroban,
  contractId: "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
});

// Fetch current reserve metrics
const state = await pool.getPoolState();

console.log("Total Reserve (XLM):", state.totalReserveXlm);
console.log("Current Epoch:", state.currentEpoch);
console.log("Next Jackpot Draw Time:", new Date(state.nextDrawTimestampMs).toLocaleString());
console.log("Accumulated Weekly Jackpot:", state.weeklyJackpotAmount, "XLM");
```

---

## Prize Claiming Lifecycle

When a jackpot or tournament concludes:
1. The Arbiter publishes the winning ticket merkle root to the `prize-pool` contract.
2. The user's client queries eligible claims using `getEligibleClaims(userAddress)`.
3. The user signs an on-chain `claim_prize` transaction to withdraw their reward directly to their Stellar wallet.

```typescript
const claims = await pool.getEligibleClaims("GBZXN7PIRZGNMHGA72STUFIO");

for (const claim of claims) {
  console.log(`Claiming Epoch #${claim.epochId} for ${claim.amountXlm} XLM`);
  const tx = await pool.buildClaimTransaction(claim.claimId);
  const signed = await window.freighter.signTransaction(tx.xdr);
  await soroban.submitTransaction(signed);
}
```
