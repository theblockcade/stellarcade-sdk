# Installation & Setup

Install `@stellarcade/sdk` using your preferred package manager. The package ships ESM, CommonJS, and TypeScript definitions out of the box.

```bash
# Using pnpm (recommended)
pnpm add @stellarcade/sdk @stellar/stellar-sdk

# Using npm
npm install @stellarcade/sdk @stellar/stellar-sdk

# Using yarn
yarn add @stellarcade/sdk @stellar/stellar-sdk

# Using bun
bun add @stellarcade/sdk @stellar/stellar-sdk
```

---

## Peer Dependencies

`@stellarcade/sdk` requires `@stellar/stellar-sdk` (v13.0.0 or higher) for Soroban XDR serialization, transaction envelopes, and RPC communication:

```json
{
  "dependencies": {
    "@stellarcade/sdk": "^0.1.0",
    "@stellar/stellar-sdk": "^13.0.0"
  },
  "optionalDependencies": {
    "@stellar/freighter-api": "^6.0.0"
  }
}
```

> [!NOTE]
> If you are building a browser-based application with wallet login, install `@stellar/freighter-api` to enable the built-in `FreighterAdapter`.

---

## Environment Configuration

Configure your environment variables to target Stellar Testnet or Mainnet:

```env
# Stellar / Soroban Network
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org

# Deployed Contract Addresses (Testnet)
NEXT_PUBLIC_COIN_FLIP_CONTRACT_ID=CDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
NEXT_PUBLIC_PRIZE_POOL_CONTRACT_ID=CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
NEXT_PUBLIC_RANDOM_GENERATOR_CONTRACT_ID=CEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
```

---

## Node.js & Browser Compatibility

`@stellarcade/sdk` is zero-dependency on Node-specific native bindings and uses the standard **WebCrypto API** (`crypto.subtle`), making it fully compatible with:

- Next.js (App Router & Pages Router)
- Vite / React / Vue / Svelte
- Node.js 18+ / 20+ / 22+
- Cloudflare Workers / Vercel Edge Runtime
- Bun and Deno
