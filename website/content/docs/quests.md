# Quests & Leaderboards

StellarCade tracks quest progress and XP per player, with completed quests eligible for on-chain rewards via the `quest-ledger-v2` and `achievement-badge` contracts (both marked **Implemented** with real test coverage — see [Soroban Smart Contracts](/contracts)). The SDK's `QuestsClient` and `LeaderboardClient` read this state through the gateway.

---

## Reading and Claiming Quests

```typescript
import { StellarCadeClient, createConfig } from "@stellarcade/sdk";

const client = new StellarCadeClient(createConfig({
  network: "testnet",
  gatewayUrl: "https://gateway.stellarcade.example",
  arbiterUrl: "https://arbiter.stellarcade.example",
  contracts: { /* ...contract addresses... */ },
}));

const quests = await client.quests.listForPlayer(playerAddress);

quests.forEach((q) => {
  console.log(`${q.questId}: ${q.progress}/${q.target}${q.claimed ? " (claimed)" : ""}`);
  if (q.streak > 0) console.log(`  Streak: ${q.streak}`);
});

// Claim a completed quest
const completed = quests.find((q) => q.progress >= q.target && !q.claimed);
if (completed) {
  const result = await client.quests.claim(completed.questId, playerAddress);
  await client.waitForTx(result.hash);
}
```

`QuestProgress` is `{ questId, playerAddress, progress, target, claimed, streak }` — there's no separate title/category/milestones structure or XP-reward field in the SDK's types; that level of detail, if you need it, comes from whatever the gateway's quest-listing response includes beyond this typed shape.

---

## Leaderboard

```typescript
const overall = await client.leaderboard.get({ limit: 10 });
const coinFlipOnly = await client.leaderboard.get({ gameId: "coin-flip", limit: 10 });

overall.forEach((entry) => {
  console.log(`#${entry.rank} — ${entry.playerAddress.slice(0, 8)}… — ${entry.score}`);
});
```

`LeaderboardQuery` only supports `gameId` and `limit` — there's no `timeframe` ("daily"/"weekly"/"all_time") parameter in the current SDK; ranking windows, if the gateway supports them, aren't exposed through this client yet.
