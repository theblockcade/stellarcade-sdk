---
description: What TheBlockCade is and what this SDK gives you.
---

TheBlockCade is a decentralized arcade platform on Stellar/Soroban: provably-fair
on-chain games, prize pools, quests, leaderboards and tournaments.

**stellarcade-sdk** is the TypeScript client for it. One `StellarCadeClient`
gives you:

- `client.games` — list games, commit to a round, play, fetch results
- `client.prizes` — prize pool state and claims
- `client.quests` — quest progress and claims
- `client.leaderboard` — global and per-game rankings
- `client.tournaments` — list, enter, track tournaments
- Wallet connectors (Freighter today, more via `contrib/`) that never see or
  hold a private key inside the SDK process
- `verifyProof()` — check any settled round's fairness proof yourself,
  offline, without trusting our API

## Why fairness verification is the headline feature

Every game round is settled by [stellarcade-arbiter](https://github.com/TheBlockCade/stellarcade-arbiter)
using a commit-reveal scheme: it commits to a hashed server seed *before*
accepting any bet, then reveals the seed after the round to derive the
outcome. The SDK's `verifyProof()` recomputes that hash and the derived
outcome from the published proof alone — see [Fairness Verification](/docs/fairness).

If a proof doesn't verify, something is wrong, and you don't need us to tell
you that.
