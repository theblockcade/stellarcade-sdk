# Hash-Chained Audit Logs & Arbiter Protocol

The **stellarcade-arbiter** service is what actually commits round seeds, settles rounds, and appends every event to a hash-chained audit log — the properties described here are what its code does, not aspirational design.

---

## Hash-Chained Audit Architecture

Every event the arbiter processes (`round.committed`, settlement, etc.) is appended to a continuous chain:

```
[Genesis: "0" × 64] ──► [Entry 1] ──► [Entry 2] ──► [Entry N]
```

Each entry's hash is computed from its own fields plus the previous entry's hash:

$$\text{hash}_n = \text{SHA-256}(\text{prevHash}_n \mathbin{\Vert} \text{":"} \mathbin{\Vert} \text{seq}_n \mathbin{\Vert} \text{":"} \mathbin{\Vert} \text{event}_n \mathbin{\Vert} \text{":"} \mathbin{\Vert} \text{JSON}(\text{data}_n) \mathbin{\Vert} \text{":"} \mathbin{\Vert} \text{createdAt}_n)$$

### Real Entry Schema

```typescript
interface AuditEntry {
  seq: number;
  event: string;               // e.g. "round.committed"
  data: Record<string, unknown>;
  prevHash: string;
  hash: string;
  createdAt: string;
}
```

Editing, deleting, or reordering any historical entry breaks the chain from that point forward — that break is the tamper signal. The point of a hash chain isn't to *prevent* tampering (an operator with database access always can edit rows) — it's to make tampering *detectable* after the fact, by anyone who re-verifies the chain.

---

## The Arbiter's Real HTTP API

These are the actual routes exposed by `stellarcade-arbiter` (see `src/app.ts`):

| Route | Method | Auth | Purpose |
| :--- | :--- | :--- | :--- |
| `/health` | GET | none | Liveness check |
| `/games/:gameId/commit` | POST | `x-api-key` | Commits a fresh round, publishes the seed's hash |
| `/rounds/:roundId/settle` | POST | `x-api-key` | Reveals the seed and settles the round |
| `/proofs/:roundId` | GET | none | Fetches the archived `FairnessProof` for a settled round |
| `/verify` | POST | none | Replays a round server-side and confirms the proof is valid |
| `/audit/verify` | GET | none | Re-verifies the *entire* stored hash chain and reports whether it's intact |

`/verify`, `/proofs/:roundId`, and `/audit/verify` are deliberately public and unauthenticated — they're read-only proof-checking, and gating them behind a key would defeat the point of letting anyone independently verify a round or the whole log.

---

## Verifying the Whole Log Yourself

`GET /audit/verify` recomputes every entry's hash from its stored fields and confirms the chain is unbroken:

```typescript
const response = await fetch("https://arbiter.stellarcade.example/audit/verify");
const result = await response.json();

if (!result.valid) {
  console.error(`Chain broken at seq ${result.brokenAtSeq}: ${result.reason}`);
} else {
  console.log("Full audit chain verified intact.");
}
```

This is a whole-log integrity check, separate from per-round fairness verification — use `verifyProof()` from the SDK (see [Fairness Spec](/fairness)) to check a single round's outcome, and `/audit/verify` to confirm the historical record hasn't been altered.
