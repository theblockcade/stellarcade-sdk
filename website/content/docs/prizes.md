# Prize Pools

Every game backs onto a prize pool, managed on-chain by the `prize-pool` contract (see [Soroban Smart Contracts](/contracts) for its status — real logic, zero tests as of this writing) and read through the gateway via `PrizesClient`.

---

## Reading Pool State

```typescript
import { StellarCadeClient, createConfig } from "@stellarcade/sdk";

const client = new StellarCadeClient(createConfig({
  network: "testnet",
  gatewayUrl: "https://gateway.stellarcade.example",
  arbiterUrl: "https://arbiter.stellarcade.example",
  contracts: { /* ...contract addresses... */ },
}));

// One pool
const pool = await client.prizes.getPool("coin-flip");
console.log("Balance:", pool.balance, pool.asset);
console.log("Last payout:", pool.lastPayoutAt ? new Date(pool.lastPayoutAt) : "never");

// Every pool
const pools = await client.prizes.listPools();
pools.forEach((p) => console.log(`${p.gameId}: ${p.balance} ${p.asset}`));
```

`PrizePoolState` is intentionally minimal — `poolId`, `gameId`, `balance`, `asset`, `lastPayoutAt`. There's no `weeklyJackpot`, `currentEpoch`, or `vaultHealth` field; those don't exist in the SDK's types.

---

## Claiming

```typescript
const result = await client.prizes.claim(pool.poolId, playerAddress);
await client.waitForTx(result.hash);
console.log("Claim submitted:", result.hash);
```

`claim()` is a single gateway call — the SDK doesn't expose a separate "list eligible claims, then build and sign a claim transaction" flow. The gateway handles building the underlying transaction; you only need a connected wallet (see [Wallet Connectors](/wallet-connectors)) to sign it if the flow requires your signature.

For the on-chain functions backing this (`fund`, `reserve`, `release`, `payout`, `sync`), see [Soroban Smart Contracts](/contracts).
