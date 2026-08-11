# Soroban Smart Contracts Architecture

StellarCade's on-chain operations are powered by a suite of modular Rust smart contracts deployed to the **Soroban** environment on Stellar.

---

## Contract Overview & Deployments

| Contract | Current Testnet Address | Primary Purpose |
| :--- | :--- | :--- |
| **`coin-flip`** | `CDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD` | 1v1 PvP duels, house rounds, bet escrow, payout execution |
| **`random-generator`** | `CEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE` | Verifiable randomness mixing, seed commitment records |
| **`prize-pool`** | `CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA` | Community liquidity vaults, yield allocation, jackpot distribution |
| **`achievement-badge`** | `CBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB` | Soulbound Quest Tokens (SBTs), on-chain XP certificates |

---

## 1. The `coin-flip` Smart Contract

### Public Interface (Rust / Soroban)
```rust
pub trait CoinFlipTrait {
    /// Initialize the contract with vault and admin addresses
    fn initialize(env: Env, admin: Address, vault: Address, fee_bps: u32);

    /// Place a new wager for a coinflip duel
    fn place_bet(
        env: Env,
        player: Address,
        wager: i128,
        side: u32, // 0 = Heads, 1 = Tails
        client_seed: BytesN<32>,
    ) -> Result<u64, Error>;

    /// Settle match using revealed server entropy and ledger hash
    fn settle_round(
        env: Env,
        round_id: u64,
        server_seed: BytesN<32>,
    ) -> Result<Address, Error>;

    /// Query match status and outcome
    fn get_round(env: Env, round_id: u64) -> Option<RoundData>;
}
```

### Storage Model
- **Instance Storage**: Admin address, fee basis points (e.g. `200` for 2%), total volume metrics.
- **Temporary Storage**: Active unmatched duels with automatic TTL renewal.
- **Persistent Storage**: Settled round records indexed by `round_id`.

---

## 2. The `prize-pool` Vault Contract

### Escrow & Jackpot Architecture
```rust
pub trait PrizePoolTrait {
    /// Deposit match fee share into the vault escrow
    fn deposit_fee(env: Env, amount: i128);

    /// Distribute weekly jackpot to winning ticket holder
    fn draw_jackpot(env: Env, winning_proof: MerkleProof) -> Result<i128, Error>;

    /// Claim accrued tournament or seasonal quest rewards
    fn claim_reward(env: Env, player: Address, claim_id: u64) -> Result<i128, Error>;
}
```

---

## Interacting with Contracts via `@stellarcade/sdk`

The SDK provides pre-typed client wrappers so you never have to manually construct raw Soroban XDR:

```typescript
import { SorobanClient, CoinFlipClient } from "@stellarcade/sdk";

const client = new SorobanClient({
  rpcUrl: "https://soroban-testnet.stellar.org",
  networkPassphrase: "Test SDF Network ; September 2015",
});

const coinFlip = new CoinFlipClient({
  client,
  contractId: "CDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
});

// Read round data without paying gas fees (Simulated Read)
const round = await coinFlip.getRound(104859);
console.log("Round Status:", round.status);
console.log("Winner Address:", round.winner);
```
