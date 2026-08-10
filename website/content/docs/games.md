---
description: GamesClient reference.
---

`client.games` is a `GamesClient`.

## `list()`

Returns all `GameSummary` entries the gateway currently exposes (id, name,
status, stake bounds, settlement asset).

## `get(gameId)`

Fetch a single game's summary.

## `commitRound(gameId)`

Requests a fresh commitment from the arbiter. Returns a `RoundCommitment`
with `commitHash`, `committedAtLedger`, and `expiresAtLedger`. Call this
**before** `play()` — a round played without a prior commitment is rejected
by the gateway.

## `play(input)`

```ts
interface PlayRoundInput {
  gameId: GameId;
  playerAddress: string;
  stake: string;
  clientSeed: string;
  choice: unknown; // game-specific: { side: "heads" }, { number: 4 }, ...
}
```

Returns a `TxSubmitResult` with the submitted transaction hash. Use
`client.waitForTx(hash)` to poll until it settles.

## `getResult(roundId)`

Fetch the final `RoundResult` for a settled round, including `proofUrl` —
the URL of the published `FairnessProof` for that round.
