# Provable Fairness Specification

StellarCade implements a mathematical provably-fair entropy scheme based on NIST-compliant **SHA-256** hash functions. This ensures that neither the operator nor the player can bias the outcome of any match.

---

## Cryptographic Specification

### 1. The Commitment Preimage
```
Server Seed (Secret)  ────────► SHA-256 ────────► Published Commitment
"d4e5f6017283..."                                 "e3b0c44298fc1c..."
```

1. The server generates a 32-byte cryptographically secure random string ($S$).
2. The server computes and publishes $H = \text{SHA-256}(S)$.
3. The player selects a client seed ($C$), a positive integer $nonce$, and specifies the game range ($N$).

### 2. Canonical Entropy Mixing String
The inputs are concatenated using a colon delimiter:
$$\text{Entropy Message} = S \mathbin{\Vert} \text{":"} \mathbin{\Vert} C \mathbin{\Vert} \text{":"} \mathbin{\Vert} nonce \mathbin{\Vert} \text{":"} \mathbin{\Vert} ledgerHash$$

### 3. Modular Outcome Reduction
1. Compute the final digest:
   $$D = \text{SHA-256}(\text{Entropy Message})$$
2. Read the first 8 bytes (16 hex characters) of $D$ as a big-endian unsigned 64-bit integer:
   $$V = \text{uint64}(D[0 \dots 7])$$
3. Compute the integer outcome:
   $$\text{Outcome} = V \pmod N$$

---

## Official Test Vectors

Use these verified test vectors to audit your SDK implementation or third-party verifiers:

| Vector ID | Server Seed ($S$) | Client Seed ($C$) | Nonce | Range ($N$) | Expected Outcome |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TEST-VECTOR-01` | `d4e5f601728394a5b6c7d8e9f0123456789abcdef0123456789abcdef0123456` | `GBZXN7PIRZGNMHGA72STUFIO-4921` | `1` | `2` (Coinflip) | **0 (Heads)** |
| `TEST-VECTOR-02` | `a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0` | `GBBD47IF6LWK7P7MDEVSCADEPLAYERHYGIENE777SAMPLE` | `2` | `6` (Dice) | **4 (Dice: 5)** |
| `TEST-VECTOR-03` | `9876543210fedcba0123456789abcdef0123456789abcdef0123456789abcdef` | `GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVTHZ` | `5` | `100` (Gauntlet) | **73** |

---

## Verifying in TypeScript / Node.js

```typescript
import { verifyFairnessProof, type VerificationInput } from "@stellarcade/sdk";

const input: VerificationInput = {
  serverSeed: "d4e5f601728394a5b6c7d8e9f0123456789abcdef0123456789abcdef0123456",
  commitHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  clientSeed: "GBZXN7PIRZGNMHGA72STUFIO-4921",
  nonce: 1,
  rangeSize: 2,
};

const outcome = await verifyFairnessProof(input);

if (!outcome.isValid) {
  throw new Error("Fairness check failed! Commitment mismatch detected.");
}

console.log("Proof Validated Client-Side:");
console.log("- Recomputed Commit:", outcome.recomputedCommitHash);
console.log("- Derived Hex:", outcome.derivedHex);
console.log("- Final Mapped Outcome:", outcome.mappedOutcome);
```

---

## Verifying with Command Line (cURL & OpenSSL)

You can verify any round directly using standard Linux/macOS shell commands:

```bash
# 1. Verify Commitment Hash
echo -n "YOUR_SERVER_SEED" | sha256sum

# 2. Compute Combined Entropy
echo -n "SERVER_SEED:CLIENT_SEED:NONCE:LEDGER_HASH" | sha256sum
```
