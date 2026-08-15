# Advanced Recipes

A few less-common patterns built from the SDK's real exports — see [API Reference](/api-reference) for the full surface.

---

## Polling Prize Pool Health

The SDK doesn't have a built-in health-monitoring helper, but `PrizesClient` composes into one easily:

```typescript
import { StellarCadeClient, createConfig } from "@stellarcade/sdk";

const client = new StellarCadeClient(createConfig({
  network: "testnet",
  gatewayUrl: "https://gateway.stellarcade.example",
  arbiterUrl: "https://arbiter.stellarcade.example",
  contracts: { /* ...contract addresses... */ },
}));

const LOW_BALANCE_THRESHOLD = "1000.0000000";

async function checkPoolHealth() {
  const pools = await client.prizes.listPools();
  for (const pool of pools) {
    if (Number(pool.balance) < Number(LOW_BALANCE_THRESHOLD)) {
      console.warn(`[ALERT] ${pool.gameId} pool low: ${pool.balance} ${pool.asset}`);
    }
  }
}

setInterval(checkPoolHealth, 30_000);
```

`PrizePoolState` doesn't include a `vaultHealth` enum or reserve/yield breakdown — the balance check above is as much health signal as the current SDK exposes; anything more granular means reading the `prize-pool` contract's `get_prize_pool_metrics()` directly (see [Soroban Smart Contracts](/contracts)).

---

## Waiting on a Transaction with a Custom Timeout

```typescript
import { TxTimeoutError } from "@stellarcade/sdk";

try {
  const result = await client.waitForTx(tx.hash, { timeoutMs: 60_000, intervalMs: 2_000 });
  console.log("Settled:", result.status);
} catch (error) {
  if (error instanceof TxTimeoutError) {
    console.warn(`Still pending after 60s: ${error.hash}`);
  } else {
    throw error;
  }
}
```

---

## Bot / Chat Integration

Linking a Telegram or Discord account to a Stellar address is implemented in the separate `stellarcade-bot` service, not in `@stellarcade/sdk` — see [Telegram & Discord Bot](/bot-sdk) for the real signature-challenge flow (`SessionLinker`) rather than the SDK-based approach shown here in an earlier version of this page.
