# Provable Fairness Specification

StellarCade implements a provably-fair commit-reveal scheme based on **SHA-256**. Neither the arbiter nor the player can bias the outcome of any round. The scheme is implemented twice — once in the arbiter's `entropy.ts` (server-side, settles rounds) and once in the SDK's `fairness.ts` (client-side, verifies them) — and the two are required to match exactly, or every published proof stops verifying.

---

## Cryptographic Specification

### 1. The Commitment Preimage
```
Server Seed (Secret)  ────────► SHA-256 ────────► Published Commitment
"4f6a2e1c9b7d..."                                 "2f7169620c59..."
```

1. The arbiter generates a 32-byte cryptographically secure random string ($S$) via `crypto.randomBytes(32)`.
2. The arbiter computes and publishes $H = \text{SHA-256}(S)$ **before** accepting any bet for the round.
3. The player provides a client seed ($C$) and a nonce, and the round specifies a game range ($N$).

### 2. Canonical Entropy Mixing String
The four inputs are concatenated with a colon delimiter:
$$\text{Entropy Message} = S \mathbin{\Vert} \text{":"} \mathbin{\Vert} C \mathbin{\Vert} \text{":"} \mathbin{\Vert} nonce \mathbin{\Vert} \text{":"} \mathbin{\Vert} ledgerHash$$

### 3. Modular Outcome Reduction
1. Compute the digest: $D = \text{SHA-256}(\text{Entropy Message})$
2. Read the **full 256-bit digest** as a big-endian unsigned integer: $V = \text{uint256}(D)$
3. Compute the outcome: $\text{Outcome} = V \bmod N$

(Not a truncated 64-bit slice of the digest — the full 256 bits go into the modulo, which is what both `deriveOutcomeValue`/`mapToRange` in the SDK and the arbiter's `entropy.ts` actually do.)

---

## A Real, Reproducible Test Vector

Unlike a documentation example with made-up hashes, every value below is the actual SHA-256 output for the inputs shown — run it yourself with `sha256sum` or `crypto.subtle.digest` to confirm:

| Field | Value |
| :--- | :--- |
| Server Seed ($S$) | `4f6a2e1c9b7d3f508a1c6e4b9d2f7a3c5e8b1d4f7a0c3e6b9d2f5a8c1e4b7d0f` |
| Commit Hash ($H$) | `2f7169620c59fd0f67e51eafa56e1dbeb6b2f1b5fa4b37e2ea3c30fbbcf20fe6` |
| Client Seed ($C$) | `GBZXN7PIRZGNMHGA72STUFIO4921ABCDEFGH` |
| Nonce | `1` |
| Ledger Hash | `3a7c1e9f2b5d8046c9e2f5b8d1a4c7e0f3b6a9d2c5e8f1b4a7d0c3e6f9b2a5d8` |
| Derived Digest | `60ffc2e8901c052775f1940effeb81ff60082ad26d49c224f07f1d0e309d90ec`… (full digest, shown truncated) |
| Range ($N = 2$, coinflip) | Outcome **0** (Heads) |

---

## Verifying in TypeScript / Node.js

```typescript
import {
  verifyProof,
  type RoundCommitment,
  type FairnessProof,
} from "@stellarcade/sdk";

const commitment: RoundCommitment = {
  roundId: "round_8f21ac",
  gameId: "coin-flip",
  commitHash: "2f7169620c59fd0f67e51eafa56e1dbeb6b2f1b5fa4b37e2ea3c30fbbcf20fe6",
  committedAtLedger: 512034,
  expiresAtLedger: 512134,
};

const proof: FairnessProof = {
  roundId: "round_8f21ac",
  commitHash: "2f7169620c59fd0f67e51eafa56e1dbeb6b2f1b5fa4b37e2ea3c30fbbcf20fe6",
  serverSeed: "4f6a2e1c9b7d3f508a1c6e4b9d2f7a3c5e8b1d4f7a0c3e6b9d2f5a8c1e4b7d0f",
  clientSeed: "GBZXN7PIRZGNMHGA72STUFIO4921ABCDEFGH",
  nonce: 1,
  ledgerHash: "3a7c1e9f2b5d8046c9e2f5b8d1a4c7e0f3b6a9d2c5e8f1b4a7d0c3e6f9b2a5d8",
  derivedValue: "60ffc2e8901c052775f1940effeb81ff60082ad26d49c224f07f1d0e309d90ec",
  outcome: "heads",
};

const result = await verifyProof(commitment, proof);

if (!result.valid) {
  throw new Error(`Fairness check failed: ${result.reason}`);
}

console.log("Proof validated client-side. Derived value:", result.derivedValue);
```

---

## Verifying with Command Line (cURL & OpenSSL)

```bash
# 1. Verify the commitment hash
echo -n "YOUR_SERVER_SEED" | sha256sum

# 2. Compute the combined entropy digest
echo -n "SERVER_SEED:CLIENT_SEED:NONCE:LEDGER_HASH" | sha256sum
```

Both commands should match `commitHash` and `derivedValue` from the published proof, respectively — that's the entire verification, independent of any StellarCade code.
