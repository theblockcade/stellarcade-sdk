---
description: What the SDK does and does not protect against.
---

## No key custody

No connector shipped or documented here ever holds a private key inside the
SDK process. `signTransaction()` always delegates to the wrapped wallet and
returns signed XDR — see [Wallet Connectors](/docs/wallet-connectors).

## Network mismatch is a hard error

`createConfig()` cross-checks `network` against `networkPassphrase` and
throws `NetworkMismatchError` rather than silently building a config that
could sign for the wrong ledger. There is no default network — you must
choose one explicitly.

## Fairness verification is client-side by design

`verifyProof()` runs on Web Crypto with no network calls once you have the
commitment and proof in hand. See [Fairness Verification](/docs/fairness).

## Current limitations (be honest)

- The SDK trusts the gateway's TLS transport for reads it doesn't separately
  verify (game lists, pool balances, quest progress). Only round outcomes
  carry a cryptographic proof today — payout correctness is enforced
  on-chain, not re-verified client-side by this SDK.
- `pollTxStatus` trusts the gateway's reported transaction status; for a
  fully trust-minimized check, verify the transaction hash directly against
  Horizon or an RPC node.
- There is no rate limiting or retry/backoff built into the low-level
  `request()` wrapper — callers building high-throughput integrations should
  add their own.

## Reporting a vulnerability

See `SECURITY.md` in the [stellarcade monorepo](https://github.com/TheBlockCade/stellarcade).
