# Multi-Source Entropy Mixing & Randomness

StellarCade derives each round's outcome from four independent, uncoordinated inputs — no single party controls enough of them to bias the result.

---

## The 4-Source Entropy Model

```
┌────────────────────────────────────────────────────────┐
│ 1. Server Secret Seed (S)  ─ Pre-committed via SHA-256 │
│ 2. Client Entropy Seed (C) ─ Selected by player        │
│ 3. Match Nonce             ─ Per-round counter          │
│ 4. Stellar Ledger Hash     ─ Fetched at settlement time │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
              SHA-256( S : C : Nonce : LedgerHash )
                            │
                            ▼
              Full 256-bit unsigned integer (V)
                            │
                            ▼
               Game Outcome = V mod RangeSize
```

### Why 4 Sources?
1. **The arbiter cannot cheat**: it publishes $H = \text{SHA-256}(S)$ *before* the player submits $C$, so it cannot change $S$ after the fact without invalidating the published commitment.
2. **The player cannot cheat**: they can't predict $S$, and the ledger hash isn't known until settlement.
3. **Neither can unilaterally pick the outcome**: the digest mixes both parties' inputs plus a value neither controls (the ledger hash), so no single input determines the result.

This is implemented identically in two places — the arbiter's `entropy.ts` (which settles rounds) and the SDK's `fairness.ts` (which verifies them). The two are required to produce the same output for the same inputs; see [Provable Fairness Spec](/fairness) for a real, reproducible test vector.

---

## Server Seeds Are Per-Round, Not Rotated

Each round gets its **own** freshly generated 32-byte server seed (`crypto.randomBytes(32)`) when the arbiter commits to it — there's no shared long-lived seed that rotates on a schedule. A commitment stays valid for a configurable number of ledgers (default 200, roughly 15 minutes at Stellar's ~5s ledger time); if a round isn't settled before its commitment expires, it can no longer be settled at all, and the arbiter returns a 410 for that round.
