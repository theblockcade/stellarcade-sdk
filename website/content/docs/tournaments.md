---
description: TournamentsClient reference.
---

`client.tournaments` is a `TournamentsClient`.

## `list()`

Returns every `TournamentSummary`: status (`upcoming` / `active` / `finished`),
ledger window, and prize pool.

## `get(tournamentId)`

Fetch a single tournament's summary.

## `enter(tournamentId, playerAddress)`

Submits an entry transaction. Returns a `TxSubmitResult` — poll with
`client.waitForTx(hash)`.
