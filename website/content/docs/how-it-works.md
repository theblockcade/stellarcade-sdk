# How StellarCade Works

StellarCade combines Soroban smart contracts with a cryptographic commit-reveal protocol, run by the **stellarcade-arbiter** service, to keep gameplay fast and provably fair.

---

## The 3-Phase Round Lifecycle

```
[Phase 1: Commit] ────► [Phase 2: Settlement] ────► [Phase 3: Reveal & Verify]
 Arbiter publishes        Player's client/wallet      Arbiter reveals seed;
 SHA-256(serverSeed)      seed & stake are submitted   client verifies offline
```

### Phase 1: Cryptographic Commitment
Before a round can be bet on, the arbiter generates a fresh 32-byte secret ($S$) — a new one per round, not reused — and publishes its hash ($H = \text{SHA-256}(S)$) via `POST /games/:gameId/commit`. Because SHA-256 is preimage-resistant, the arbiter is locked into that secret and cannot change it after seeing the player's bet. The commitment expires after a configurable number of ledgers (default 200, ~15 minutes) if never settled.

### Phase 2: Player Input & Settlement
The player submits their stake, choice, client seed, and nonce to `POST /rounds/:roundId/settle`. The arbiter fetches the current Stellar ledger hash at settlement time — a value neither party controls or can predict in advance.

### Phase 3: Reveal & Offline Verification
The arbiter reveals $S$ as part of the settlement response. Anyone can now independently recompute:
$$V = \text{SHA-256}(S \mathbin{\Vert} C \mathbin{\Vert} \text{nonce} \mathbin{\Vert} \text{ledgerHash}) \bmod \text{rangeSize}$$
using the **full 256-bit digest** — not a truncated slice of it — via the SDK's `verifyProof()`, entirely offline. See the [Fairness Spec](/fairness) for a real, reproducible test vector.

---

## Contracts Involved

| Contract | Status | Role |
| :--- | :--- | :--- |
| `coin-flip` | Partial (real logic, zero tests) | Escrows stakes for 1v1/house rounds |
| `random-generator` | Implemented (32 tests) | Verifiable randomness commitments |
| `prize-pool` | Partial (real logic, zero tests) | Reserve/vault management, jackpot distribution |
| `achievement-badge` | Implemented (24 tests) | Soulbound quest/XP tokens |

None of these have had a third-party security audit — see [Soroban Smart Contracts](/contracts) for the full status table across every contract the SDK/gateway touch.

---

## Audit Logs & Arbiter Dispute Resolution

Every event the arbiter processes — round commits, settlements — is appended to a hash-chained audit log:
$$\text{hash}_n = \text{SHA-256}(\text{prevHash}_n \mathbin{\Vert} \text{seq}_n \mathbin{\Vert} \text{event}_n \mathbin{\Vert} \text{JSON}(\text{data}_n) \mathbin{\Vert} \text{createdAt}_n)$$
Editing or removing a historical entry breaks the chain from that point on, which `GET /audit/verify` detects. See [Audit Logs & Arbiter](/audit-arbiter) for the full API and real entry schema.
