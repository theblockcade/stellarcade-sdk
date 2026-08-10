---
description: PrizesClient reference.
---

`client.prizes` is a `PrizesClient`.

## `listPools()`

Returns every `PrizePoolState` the gateway tracks.

## `getPool(gameId)`

Returns the pool state for one game: `balance`, `asset`, `lastPayoutAt`.

## `claim(poolId, playerAddress)`

Submits a claim transaction for a player's share of a pool payout. Returns a
`TxSubmitResult` — poll it with `client.waitForTx(hash)`.

Pool balances and payouts are enforced by the on-chain `prize-pool` and
`treasury` contracts; the gateway only relays reads and submits the signed
transaction you built.
