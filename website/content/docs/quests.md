# Quests, Milestones & Leaderboards

StellarCade includes an on-chain progression and gamification system where players complete daily quests, earn XP, unlock Soulbound Badges, and climb competitive leaderboards.

---

## The Quest Lifecycle

```
[Enroll in Quest] ────► [Complete Milestones] ────► [Claim On-Chain XP & Badge]
```

1. **Daily Quests**: Fast-paced milestones (e.g., "Play 3 Coinflip duels", "Verify 1 round proof offline").
2. **Seasonal Quests**: Multi-stage challenges rewarding higher prize pool shares and exclusive achievement badges.
3. **Milestones**: Incremental achievements that automatically track against wallet activity.

---

## Interacting with the Quest Service

```typescript
import { QuestClient } from "@stellarcade/sdk";

const questClient = new QuestClient();

// 1. Fetch available quests for a connected wallet
const quests = await questClient.getQuests({
  userAddress: "GBZXN7PIRZGNMHGA72STUFIO",
});

quests.forEach((quest) => {
  console.log(`Quest: ${quest.title} [${quest.category}]`);
  console.log(`XP Reward: ${quest.totalXpReward}`);
  console.log(`Enrolled: ${quest.enrolled}`);
  
  quest.milestones.forEach((m) => {
    console.log(`  - [${m.completed ? "X" : " "}] ${m.title}`);
  });
});

// 2. Enroll in a new quest
await questClient.enrollQuest("quest_stellar_explorer_v1");

// 3. Claim completed quest reward
const claimResult = await questClient.claimQuestReward("quest_stellar_explorer_v1");
console.log("Certificate Minted! SBT Token ID:", claimResult.certificateId);
```

---

## Fetching Real-Time Leaderboards

Leaderboards rank active players based on match volume, win streaks, and earned XP:

```typescript
import { LeaderboardClient } from "@stellarcade/sdk";

const leaderboard = new LeaderboardClient();

const topPlayers = await leaderboard.getTopPlayers({
  timeframe: "weekly", // "daily" | "weekly" | "all_time"
  limit: 10,
});

topPlayers.forEach((player, rank) => {
  console.log(`#${rank + 1} | ${player.username ?? player.address.slice(0, 8)} | ${player.totalXp} XP | ${player.wins} Wins`);
});
```
