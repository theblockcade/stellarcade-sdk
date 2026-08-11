# Quickstart: 5-Minute Integration

Get up and running with `@stellarcade/sdk` in less than five minutes. This guide covers connecting a wallet, querying live prize pools, and verifying a provably fair round.

---

## 1. Verify a Game Round Client-Side

StellarCade allows any client to verify game fairness offline without network requests:

```typescript
import { verifyFairnessProof } from "@stellarcade/sdk";

// Data revealed after round settlement
const proof = {
  serverSeed: "d4e5f601728394a5b6c7d8e9f0123456789abcdef0123456789abcdef0123456",
  commitHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  clientSeed: "GBZXN7PIRZGNMHGA72STUFIO-4921",
  nonce: 1,
  rangeSize: 2, // 2 for 50/50 Coinflip (0 = Heads, 1 = Tails)
};

const result = await verifyFairnessProof(proof);

console.log("Is round cryptographically fair?", result.isValid);
console.log("Commitment verified?", result.commitmentMatch);
console.log("Resolved outcome:", result.mappedOutcome); // 0 = Heads, 1 = Tails
```

---

## 2. Connect a Wallet with `FreighterAdapter`

Use `FreighterAdapter` to authenticate users, request transaction signatures, and monitor network state:

```typescript
import { FreighterAdapter, WalletSessionService } from "@stellarcade/sdk";

const session = new WalletSessionService();
const adapter = new FreighterAdapter();

session.setProviderAdapter(adapter);

// Connect wallet
try {
  const meta = await session.connect({ network: "TESTNET" });
  console.log("Connected Stellar Address:", meta.address);
  console.log("Active Network:", meta.network);
} catch (error) {
  console.error("Wallet connection declined or missing:", error);
}
```

---

## 3. Query Soroban Contract State

Query live arcade prize pool and contract data directly from the blockchain:

```typescript
import { SorobanClient, PrizePoolClient } from "@stellarcade/sdk";

const soroban = new SorobanClient({
  rpcUrl: "https://soroban-testnet.stellar.org",
  networkPassphrase: "Test SDF Network ; September 2015",
});

const prizePool = new PrizePoolClient({
  client: soroban,
  contractId: "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
});

const poolState = await prizePool.getPoolState();

console.log("Active Prize Reserve:", poolState.totalReserveXlm, "XLM");
console.log("Total Matches Settled:", poolState.totalMatchesSettled);
console.log("Protocol Vault Health:", poolState.vaultHealth);
```

---

## Next Steps

- Explore the complete [Fairness Verification Specification](/docs/fairness).
- Learn about [Wallet Session Management](/docs/wallet-connectors).
- View all available methods in the [API Reference](/docs/api-reference).
