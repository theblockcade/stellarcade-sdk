# Multi-Source Entropy Mixing & Randomness

StellarCade uses a multi-source cryptographic entropy pipeline to prevent both player manipulation and operator bias.

---

## The 4-Source Entropy Model

Game results are derived from four distinct, uncoordinated inputs:

```
┌────────────────────────────────────────────────────────┐
│ 1. Server Secret Seed (S)  ─ Pre-committed via SHA-256 │
│ 2. Client Entropy Seed (C) ─ Selected by player        │
│ 3. Match Nonce             ─ Monotonic sequence counter │
│ 4. Stellar Ledger Hash     ─ Closing block hash on L1  │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
              SHA-256( S : C : Nonce : LedgerHash )
                            │
                            ▼
                64-bit Unsigned Integer (V)
                            │
                            ▼
               Game Outcome = V mod RangeSize
```

### Why 4 Sources?
1. **Operator cannot cheat**: The server publishes $H = \text{SHA-256}(S)$ *before* the player inputs $C$. The operator cannot change $S$ without invalidating the cryptographic commitment.
2. **Player cannot cheat**: The player cannot predict $S$ or the future Stellar `ledgerHash`.
3. **Miners/Validators cannot cheat**: Even if a validator attempts to censor or reorder transactions, the inclusion of the server's pre-committed seed $S$ prevents miners from forcing specific outcomes.

---

## Seed Rotation Policy

To prevent correlation attacks, server seeds rotate automatically:
- Every 1,000 matches, or
- Every 24 hours (whichever occurs first).

When rotation occurs, the previous seed is revealed publicly in the audit log, allowing players to batch-verify all rounds played under that epoch.
