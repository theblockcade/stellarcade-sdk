# Hash-Chained Audit Logs & Arbiter Protocol

StellarCade implements an append-only, cryptographic audit log to guarantee non-repudiation and enable automated dispute resolution.

---

## Hash-Chained Audit Architecture

Every settled match on StellarCade is appended to a continuous cryptographic ledger:

```
[Genesis Block] ──► [Block 1] ──► [Block 2] ──► [Block N]
     Hash_0            Hash_1        Hash_2        Hash_N
```

Each block in the audit chain is computed as:
$$\text{Block Hash}_n = \text{SHA-256}(\text{Block Hash}_{n-1} \mathbin{\Vert} \text{MatchPayload}_n)$$

### Block Payload Schema
```json
{
  "blockIndex": 104859,
  "prevBlockHash": "9f83c6d12b0e84...01a",
  "blockHash": "e3b0c44298fc1c...b85",
  "timestamp": 1775893200,
  "match": {
    "gameId": "coinflip-duel",
    "roundId": 48291,
    "playerAddress": "GBZXN7PIRZGNMHGA72STUFIO",
    "wagerXlm": "25.0000000",
    "serverSeed": "d4e5f6017283...",
    "commitHash": "e3b0c44298fc...",
    "clientSeed": "CLIENT_4921",
    "nonce": 1,
    "outcome": "HEADS",
    "payoutXlm": "49.0000000",
    "txHash": "a1b2c3d4e5..."
  }
}
```

---

## Arbiter Dispute Resolution Flow

If a client experiences network timeout during settlement:
1. The client queries the Arbiter service with their `roundId` and `clientSeed`.
2. The Arbiter returns the cryptographic block and its Merkle inclusion proof.
3. The SDK validates that the match was included in the canonical hash chain.
4. If an outcome discrepancy is detected, the Arbiter triggers an on-chain refund challenge on Soroban.
