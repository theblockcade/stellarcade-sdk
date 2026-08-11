# Advanced Integration: Custom Games & Bots

Build custom arcade game engines, Telegram/Discord bots, and automated liquidity balancing scripts on top of StellarCade's infrastructure.

---

## 1. Building a Custom On-Chain Arcade Game

You can deploy your own Soroban gaming contract and interface with it using `@stellarcade/sdk`:

```rust
// Custom Soroban Smart Contract snippet (Rust)
#[contract]
pub struct CustomGameContract;

#[contractimpl]
impl CustomGameContract {
    pub fn play_custom_round(
        env: Env,
        player: Address,
        wager: i128,
        client_seed: BytesN<32>,
    ) -> Result<u32, ContractError> {
        player.require_auth();
        // Custom game logic here...
        Ok(1)
    }
}
```

---

## 2. Telegram / Discord Bot Integration

StellarCade bot integrations allow users to link their wallet once via a one-time signature challenge and play directly from chat channels without relinquishing custody:

```typescript
import { verifyMessageSignature } from "@stellarcade/sdk";

// Backend challenge verifier for Telegram bot
export async function authenticateChatUser(
  userStellarAddress: string,
  nonceChallenge: string,
  signature: string
): Promise<boolean> {
  const isValid = await verifyMessageSignature({
    signerAddress: userStellarAddress,
    message: `StellarCade Auth Challenge: ${nonceChallenge}`,
    signature: signature,
  });

  return isValid;
}
```

---

## 3. Automated Liquidity & Health Monitoring

Set up automated health monitoring for your local node or game server:

```typescript
import { PrizePoolClient, SorobanClient } from "@stellarcade/sdk";

const soroban = new SorobanClient({
  rpcUrl: "https://soroban-testnet.stellar.org",
  networkPassphrase: "Test SDF Network ; September 2015",
});

const pool = new PrizePoolClient({
  client: soroban,
  contractId: "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
});

async function runHealthCheck() {
  const state = await pool.getPoolState();
  if (state.vaultHealth !== "HEALTHY") {
    console.warn(`[ALERT] Vault health degraded to: ${state.vaultHealth}`);
  } else {
    console.log(`[OK] Vault reserve healthy: ${state.totalReserveXlm} XLM`);
  }
}

setInterval(runHealthCheck, 30000);
```
