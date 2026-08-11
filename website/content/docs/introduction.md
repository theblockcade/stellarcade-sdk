# Introduction to StellarCade SDK

**`@stellarcade/sdk`** is the official TypeScript and JavaScript client SDK for **TheBlockCade** (StellarCade) — a decentralized, provably-fair arcade and competitive gaming platform built on the Stellar network and the Soroban smart contract runtime.

The SDK delivers client-side cryptographic fairness verification, non-custodial wallet connectors (Freighter and Passkey), on-chain contract read/write utilities, prize pool state queries, and quest progression tracking.

> [!TIP]
> **Zero-Server-Trust**: Every game outcome settled on StellarCade can be independently recomputed and cryptographically audited client-side using standard WebCrypto SHA-256 primitives without sending data to any centralized server.

---

## Key Pillars & Architecture

StellarCade is engineered across four interoperable repositories designed for high-throughput, low-latency, and provably fair execution:

```
                  ┌─────────────────────────────────────────┐
                  │          @stellarcade/web UI            │
                  │   (Next.js App Router, Tailwind, GSAP)  │
                  └────────────────────┬────────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
┌───────────────────────────────┐             ┌───────────────────────────────┐
│     @stellarcade/sdk Client   │             │   Stellar / Soroban Contracts │
│  - Provable Fairness Engine   │             │  - coin-flip (Duel Logic)     │
│  - Freighter / Passkey Bridge │             │  - random-generator (RNG)     │
│  - Typed Contract RPC Client  │             │  - prize-pool (Vault Escrow)  │
│  - Quest & XP Registry        │             │  - achievement-badge (SBTs)   │
└───────────────┬───────────────┘             └───────────────┬───────────────┘
                │                                             │
                └──────────────────────┬──────────────────────┘
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │         stellarcade-arbiter & bot       │
                  │  (Hash-chained audit log & chat engine) │
                  └─────────────────────────────────────────┘
```

### 1. Provably Fair Execution
Every game round begins with a cryptographic commitment:
$$\text{commitHash} = \text{SHA-256}(\text{serverSeed})$$
The server publishes this hash before the player places their bet. Once the player submits their client seed and choice, the round settles deterministically from:
$$\text{Entropy Mix} = \text{serverSeed} : \text{clientSeed} : \text{nonce} : \text{ledgerHash}$$
Once the secret `serverSeed` is revealed, any client can verify the round's legitimacy offline in under 5 milliseconds.

### 2. Truly Non-Custodial
The SDK never holds, stores, or transmits private keys. All blockchain state changes (staking XLM, entering prize pools, claiming rewards) are dispatched to the user's browser wallet (such as Freighter) for explicit user signature authorization.

### 3. Native Soroban Performance
Stellar's 5-second ledger settlement times and sub-cent transaction fees enable high-frequency arcade interactions without the gas friction common on other Layer 1 networks.

---

## SDK Module Matrix

| Module | Export | Description |
| :--- | :--- | :--- |
| **Fairness** | `verifyRound`, `computeCommitment` | Client-side SHA-256 commitment and entropy verifier |
| **Wallets** | `FreighterAdapter`, `WalletSessionService` | Non-custodial session lifecycle and auto-recovery |
| **Contracts** | `SorobanClient`, `CoinFlipClient` | Direct RPC bindings to deployed Soroban contracts |
| **Prize Pools** | `PrizePoolClient`, `fetchPoolState` | Real-time liquidity, reserve balances, and yield metrics |
| **Telemetry** | `AuditLogger`, `ContractEventFeed` | Hash-chained dispute resolution and ledger event streams |

---

## Next Steps

- Follow the [Installation Guide](/docs/installation) to add `@stellarcade/sdk` to your project.
- Check the [Quickstart](/docs/quickstart) for a 5-minute working example.
- Read the [Fairness Verification Deep Dive](/docs/fairness) for mathematical and cryptographic specifications.
