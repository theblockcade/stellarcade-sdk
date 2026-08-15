# Building Custom Games on Soroban

You can write your own Soroban game contract following the same commit-reveal pattern as `coin-flip` and `dice-roll`. Wiring it up for players to actually play through `@stellarcade/sdk`, though, is not purely a client-side integration today — read the "Wiring It Up" section below before assuming otherwise.

---

## 1. Writing the Soroban Game Contract (Rust)

```rust
#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, BytesN, Env};

#[contract]
pub struct DiceRollGame;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BetRecord {
    pub player: Address,
    pub wager: i128,
    pub target_number: u32,
    pub settled: bool,
}

#[contractimpl]
impl DiceRollGame {
    pub fn roll_dice(
        env: Env,
        player: Address,
        wager: i128,
        target_number: u32,
        client_seed: BytesN<32>,
    ) -> u64 {
        player.require_auth();
        assert!(target_number >= 1 && target_number <= 6, "Target must be 1-6");

        let bet_id: u64 = env.ledger().sequence() as u64;
        env.events().publish(
            (symbol_short!("bet_placed"), player.clone()),
            (bet_id, wager, target_number),
        );

        bet_id
    }
}
```

This is illustrative, not a copy of the real contract — the actual `dice-roll` contract (`contracts/dice-roll/src/lib.rs` in the main repo) uses different function names (`init`, `roll`, `resolve_roll`, `get_roll`) and adds wager-limit and cooldown tracking. Read that file directly if you want a real reference implementation to build from.

---

## 2. Wiring It Up

`@stellarcade/sdk` does **not** expose a generic "invoke any Soroban contract" client — `GamesClient` only knows about the `GameId`s the gateway serves (`coin-flip`, `dice-roll`, `higher-lower`, `number-guess`, `trivia`, `pattern-puzzle` as of this writing). There's no `SorobanClient` or per-game client class you construct client-side to talk to an arbitrary contract.

Making a new game playable through the SDK means:

1. Deploying the contract and adding its address to the gateway's config.
2. Teaching the **gateway** to route `commit`/`play`/`get result` for the new `GameId` to your contract, and the **arbiter** to run its commit-reveal settlement.
3. Adding the new `GameId` to the SDK's `types.ts` union in a new SDK release.

None of that is something you do from application code importing `@stellarcade/sdk` — it's a change to the gateway/arbiter services themselves. If you're building a custom game outside StellarCade's own gateway, you'll be invoking your contract directly through `@stellar/stellar-sdk` (which `@stellarcade/sdk` bundles) rather than through this SDK's game clients, and implementing your own commit-reveal server following the [Fairness Spec](/fairness) if you want the same verifiability guarantees.
