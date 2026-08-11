# Security Architecture & Threat Model

StellarCade is designed around a strict zero-custody, cryptographically verifiable threat model. This document details protocol security guarantees, vulnerability mitigations, and key isolation boundaries.

---

## 1. Key Isolation & Custody Guarantees

```
┌────────────────────────────────────────────────────────┐
│               Browser Security Sandbox                 │
│                                                        │
│  ┌──────────────────────┐    ┌──────────────────────┐  │
│  │   Freighter Wallet   │    │  StellarCade Web App │  │
│  │   (Holds Secret Key) │    │  (Reads Public State)│  │
│  └──────────┬───────────┘    └──────────┬───────────┘  │
│             │                           │              │
│             │  PostMessage Challenge    │              │
│             │◄──────────────────────────┘              │
│             │                                          │
│             │  Signed Transaction Envelope             │
│             └──────────────────────────►               │
└────────────────────────────────────────────────────────┘
```

- **Zero Seed Phrase Exposure**: Neither the web frontend nor the SDK ever has access to the user's private keys or seed phrase.
- **Explicit Authorization**: Every on-chain mutation requires the user to view and approve the transaction details inside the Freighter popup dialog.

---

## 2. Front-Running & MEV Resistance

On public blockchains, miners and bots can attempt to front-run bets if entropy is derived from public mempool transactions. StellarCade eliminates MEV exploitation through:

1. **Pre-Committed Server Entropy**: The operator's secret seed commitment is published before the player's transaction is submitted.
2. **Client-Provided Entropy**: The player's client seed is combined into the final digest, guaranteeing that neither party can manipulate the outcome alone.
3. **Ledger Hash Pinning**: Outcomes bind to the closing ledger sequence, preventing timestamp manipulation.

---

## 3. Rate Limiting & Denial of Service Mitigations

- **Automatic Exponential Backoff**: SDK network requests back off deterministically on HTTP 429 and 500 status codes.
- **Contract Reentrancy Guards**: All Soroban smart contracts implement strict state mutability locks and checks-effects-interactions patterns to prevent reentrancy attacks during payout claims.

---

## 4. Responsible Disclosure

If you discover a security vulnerability in `@stellarcade/sdk` or the underlying smart contracts:

- **Email**: `security@stellarcade.fun`
- **PGP Key ID**: `0xSTC_SECURITY_2026`
- **Response SLA**: Initial triage within 24 hours.
