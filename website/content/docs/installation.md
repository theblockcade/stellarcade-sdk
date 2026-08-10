---
description: Installing stellarcade-sdk.
---

## Requirements

- Node.js >= 22 (or a modern browser — the SDK is isomorphic apart from the
  Freighter connector, which needs `window`)

## Install

```bash
npm install stellarcade-sdk
```

```bash
pnpm add stellarcade-sdk
```

```bash
yarn add stellarcade-sdk
```

The package ships both ESM and CJS builds plus type declarations — no extra
`@types` package needed.

## Peer setup

If you're using the Freighter connector in a browser app, you also need the
[Freighter extension](https://www.freighter.app/) installed by the end user;
the SDK detects it at runtime via `connector.isAvailable()` and does not
bundle it.
