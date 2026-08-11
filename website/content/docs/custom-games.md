# Building Custom Games on Soroban

You can build and deploy your own arcade game contracts on Stellar and integrate them directly with `@stellarcade/sdk`.

---

## 1. Writing the Soroban Game Contract (Rust)

Create a new Soroban smart contract using the official SDK:

```rust
#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, BytesN, Env, Symbol};

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

        // Escrow wager and emit event
        let bet_id: u64 = env.ledger().sequence() as u64;
        env.events().publish(
            (symbol_short!("bet_placed"), player.clone()),
            (bet_id, wager, target_number),
        );

        bet_id
    }
}
```

---

## 2. Wiring into `@stellarcade/sdk`

```typescript
import { SorobanClient, verifyFairnessProof } from "@stellarcade/sdk";

export class DiceGameClient {
  constructor(private soroban: SorobanClient, private contractId: string) {}

  async rollDice(player: string, wager: number, target: number) {
    // 1. Build and submit transaction
    const tx = await this.soroban.buildTransaction({
      contractId: this.contractId,
      method: "roll_dice",
      args: [player, wager, target],
    });

    return tx;
  }
}
```
