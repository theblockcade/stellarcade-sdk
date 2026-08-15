# Security Architecture & Threat Model

---

## 1. Key Isolation & Custody

Neither the SDK nor the web frontend ever has access to a user's private key or seed phrase. Every `WalletConnector` (see [Wallet Connectors](/wallet-connectors)) — Freighter today — signs inside the extension's own sandbox and returns only a signed XDR envelope to the SDK. The user explicitly approves each transaction's details inside the wallet's own popup before signing.

---

## 2. Front-Running Resistance via Commit-Reveal

The arbiter publishes `SHA-256(serverSeed)` before a player's bet is accepted, and the eventual outcome mixes in the client seed and a Stellar ledger hash fetched at settlement time — a value neither the arbiter nor the player controls in advance. See the [Fairness Spec](/fairness) and [Entropy Mixing](/entropy) pages for the exact scheme this relies on.

---

## 3. Rate Limiting

The arbiter enforces a real rate limit (via `@fastify/rate-limit`) on its two state-mutating routes, `POST /games/:gameId/commit` and `POST /rounds/:roundId/settle` — default 30 requests per IP per 60-second window, both configurable server-side. Its read-only routes (`/verify`, `/proofs/:roundId`, `/audit/verify`) are unauthenticated and not rate-limited by default, since they're public proof-checking by design.

The SDK's own `request()` helper does **not** retry or back off automatically — a failed or non-OK gateway/arbiter response throws `RpcError` immediately. If you need retry behavior, implement it in your own calling code.

---

## 4. Contract-Level Security

Whether a given Soroban contract implements reentrancy guards, checks-effects-interactions, or other mitigations varies by contract — this isn't a blanket guarantee across all ~150 crates in `contracts/`. None of the contracts the SDK/gateway currently integrate with (`coin-flip`, `prize-pool`, `random-generator`, `access-control`, `achievement-badge`, `tournament-system`) have had a third-party security audit as of this writing. See [Soroban Smart Contracts](/contracts) for current test-coverage status per contract — treat that as a proxy for maturity, not a security guarantee.

---

## 5. Reporting a Vulnerability

This documentation site previously listed a security contact email and PGP key that could not be verified against anything in the actual repositories, so it has been removed rather than left in place — publishing an unverified contact for security reports is worse than publishing none. If you've found a vulnerability, open an issue (or, for something sensitive, a private security advisory) on the relevant repository directly: `stellarcade-sdk`, `stellarcade` (main app/contracts), `stellarcade-arbiter`, or `stellarcade-bot`, whichever the finding concerns.
