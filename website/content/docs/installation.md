# Installation & Setup

Install `@stellarcade/sdk` using your preferred package manager. The package ships ESM, CommonJS, and TypeScript definitions out of the box.

```bash
# Using pnpm (recommended)
pnpm add @stellarcade/sdk

# Using npm
npm install @stellarcade/sdk

# Using yarn
yarn add @stellarcade/sdk

# Using bun
bun add @stellarcade/sdk
```

---

## Dependencies

`@stellarcade/sdk` bundles `@stellar/stellar-sdk` (^16.0.1) as a regular dependency — you don't need to install it separately, and there's no minimum version to pin yourself.

```json
{
  "dependencies": {
    "@stellarcade/sdk": "^0.1.0"
  }
}
```

> [!NOTE]
> `FreighterConnector` (the built-in Freighter wallet connector) needs no extra package either — it talks directly to `window.freighterApi`, which the Freighter browser extension injects itself. Just make sure the extension is installed in the browser your users are on.

---

## Environment Configuration

`createConfig()` needs a network, your gateway/arbiter URLs, and the contract addresses you're targeting — `rpcUrl`, `horizonUrl`, and `networkPassphrase` are optional and default per-network if omitted:

```env
# Stellar Network
NEXT_PUBLIC_STELLAR_NETWORK=testnet

# StellarCade services
NEXT_PUBLIC_GATEWAY_URL=https://gateway.stellarcade.example
NEXT_PUBLIC_ARBITER_URL=https://arbiter.stellarcade.example

# Contract addresses — see /contracts for current deployment status
NEXT_PUBLIC_COIN_FLIP_CONTRACT_ID=C...
NEXT_PUBLIC_PRIZE_POOL_CONTRACT_ID=C...
NEXT_PUBLIC_RANDOM_GENERATOR_CONTRACT_ID=C...
```

Pass these into `createConfig({ network, gatewayUrl, arbiterUrl, contracts })` as shown in the [Quickstart](/quickstart) — see [`CreateConfigOptions`](/api-reference) for the full shape.

---

## Node.js & Browser Compatibility

`@stellarcade/sdk` uses the standard **WebCrypto API** (`crypto.subtle`) for fairness verification, so that part of the SDK runs anywhere WebCrypto is available. The package itself requires:

- Node.js 22+ (per `engines.node` in `package.json`)
- Any modern browser (Next.js, Vite, or plain bundler builds)
