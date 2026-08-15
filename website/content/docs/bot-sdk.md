# Telegram & Discord Bot

**`stellarcade-bot`** is a separate, standalone service (its own repo, its own deploy) that lets players link a Stellar address to their Telegram/Discord account and interact with StellarCade from chat. It is not part of the `@stellarcade/sdk` npm package — there's no `verifyMessageSignature` or `BotSessionClient` export in the SDK; that functionality lives inside the bot service itself (`stellarcade-bot/src/core/session-link.ts`).

---

## The Real Link Flow

The bot's `SessionLinker` class implements a signature-challenge link, never a submitted key:

```
1. Player runs /link in Telegram or Discord
2. Bot generates a random challenge and holds it for 10 minutes
3. Player signs the challenge with their Stellar keypair (via their wallet,
   using Stellar's SEP-53 "Stellar Signed Message:\n" convention)
4. Player submits their address + signature back to the bot
5. Bot verifies the signature was produced by that address's key over
   exactly that challenge, then discards the challenge
```

```typescript
// Inside stellarcade-bot, not @stellarcade/sdk
import { SessionLinker } from "./core/session-link.js";

const linker = new SessionLinker(); // 10-minute challenge validity by default

// Step 2: issue a challenge
const { challenge } = linker.createChallenge("telegram", telegramUserId);

// Step 5: verify the player's signed response
try {
  const address = linker.confirm("telegram", telegramUserId, playerAddress, signatureBase64);
  console.log(`Linked ${telegramUserId} to ${address}`);
} catch (error) {
  // ChallengeNotFoundError | ChallengeExpiredError | InvalidSignatureError
  console.error("Link failed:", error);
}
```

The 10-minute expiry and the exact SEP-53 message-hashing convention are load-bearing details — a real Freighter (or any SEP-53-compliant) signature over the challenge is what `confirm()` checks against, not a generic signature format.

---

## If You're Building on the Bot

If you're extending `stellarcade-bot` itself, its command routing (`src/core/command-router.ts`), platform adapters (`src/adapters/telegram.ts`, `src/adapters/discord.ts`), and API client (`src/core/api-client.ts`) are the places to look — that client is what talks to the gateway on the linked player's behalf, using the same gateway API the SDK's `GamesClient`/`PrizesClient`/etc. wrap for a browser or Node application. There isn't a documented public API for building a *different* bot on top of `@stellarcade/sdk` today; the SDK's fairness verification and gateway clients are usable from any Node process, but the wallet-linking flow above is specific to this bot's own code.
