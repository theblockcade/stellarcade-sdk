---
description: The full round lifecycle, end to end.
---

## The pieces

- **stellarcade** (the monorepo) — the on-chain contracts, the frontend, and
  the backend services (gateway, game-service, prize-service, quest-service)
- **stellarcade-arbiter** — the provably-fair randomness and settlement
  service. Publishes commitments before rounds and reveals after.
- **stellarcade-sdk** (this package) — the client that talks to both, plus the
  fairness verifier that trusts neither.

## A round, end to end

1. **Commit.** The client calls `games.commitRound(gameId)`. The arbiter
   picks a fresh server seed, hashes it, and publishes `commitHash` — *before*
   any stake exists for this round.
2. **Play.** The client calls `games.play({...})` with a stake and a
   `clientSeed` the player chooses. This submits a signed transaction that
   locks the stake against the round.
3. **Settle.** Once the transaction confirms, the arbiter reveals its server
   seed and derives the outcome from `serverSeed + clientSeed + nonce +
   ledgerHash` (see [Fairness Verification](/docs/fairness) for the exact
   derivation). It pays out from the prize pool and publishes a proof.
4. **Verify.** Anyone — not just the player — can fetch the proof and run
   `verifyProof()` against it, entirely offline.

## Why the ledger hash matters

The Stellar ledger hash at commit time is folded into the outcome derivation.
Neither the arbiter (which picked the server seed before the ledger closed)
nor the player (who picked the client seed before either the ledger hash or
the server seed were known) can predict or steer the final value alone.
