---
description: The commit-reveal scheme and how to verify it yourself.
---

This is the page that justifies the SDK's existence: you should never have to
take our word for a game result. Here is exactly how to check one yourself.

## The scheme

1. Before a round accepts any stake, the arbiter generates a random
   `serverSeed` and publishes `commitHash = sha256(serverSeed)` as part of the
   `RoundCommitment`.
2. After the round settles, the arbiter reveals `serverSeed`, the player's
   `clientSeed`, a `nonce`, and the Stellar `ledgerHash` at commit time, all
   bundled into a `FairnessProof`.
3. The outcome is derived as:

   ```
   derivedValue = sha256(serverSeed + ":" + clientSeed + ":" + nonce + ":" + ledgerHash)
   outcome      = derivedValue mod <game's outcome range>
   ```

## Verifying with the SDK

```ts
import { verifyProof } from "stellarcade-sdk";

const result = await verifyProof(commitment, proof);
// { valid: true, derivedValue: "..." }
// or
// { valid: false, derivedValue: "...", reason: "..." }
```

`verifyProof` does two checks:

- **Commitment check** — recomputes `sha256(proof.serverSeed)` and compares it
  to `commitment.commitHash`. If they don't match, the arbiter revealed a
  different seed than it committed to, which would mean it picked the seed
  *after* seeing your bet.
- **Derivation check** — recomputes `derivedValue` from the revealed material
  and compares it to `proof.derivedValue`. If they don't match, the published
  outcome wasn't actually derived from the seeds it claims.

## Doing it without the SDK

Everything above is plain `SHA-256` over UTF-8 strings — you can reimplement
`verifyProof` in any language with a standard crypto library in about ten
lines. That's deliberate: the whole point is that you don't have to trust our
code, only the math.

## What this does *not* protect against

Fairness verification proves the **outcome** wasn't rigged given the
committed seed. It does not by itself prove the **payout** matched the
outcome, or that the prize pool has the funds it claims — those are enforced
on-chain by the `prize-pool` and `treasury` contracts, which you can also
audit independently. See [Security](/docs/security).
