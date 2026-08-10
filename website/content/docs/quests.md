---
description: QuestsClient and LeaderboardClient reference.
---

## Quests — `client.quests`

### `listForPlayer(playerAddress)`

Returns every `QuestProgress` entry for a player: `progress`, `target`,
`claimed`, and their current `streak`.

### `claim(questId, playerAddress)`

Submits a claim transaction for a completed quest. Returns a `TxSubmitResult`.

## Leaderboard — `client.leaderboard`

### `get(query?)`

```ts
interface LeaderboardQuery {
  gameId?: GameId | "overall";
  limit?: number;
}
```

Returns `LeaderboardEntry[]`, ranked. Omit `gameId` for the overall
cross-game leaderboard.
