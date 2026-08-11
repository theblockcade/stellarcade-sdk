# Telegram & Discord Bot SDK

StellarCade allows players to check stats, join duels, and claim quest rewards directly from messaging apps (Telegram and Discord) through a non-custodial wallet linking scheme.

---

## The Non-Custodial Link Flow

```
1. User requests auth challenge in Telegram (/link_wallet)
2. Bot returns signed URI with 60-second nonce
3. User approves challenge in Freighter browser wallet
4. Bot receives cryptographic signature proof and binds session
```

---

## Integrating Bot Authentication in Node.js / TypeScript

```typescript
import { verifyMessageSignature } from "@stellarcade/sdk";

export async function handleWalletVerification(
  telegramUserId: string,
  userStellarAddress: string,
  challengeNonce: string,
  signature: string
): Promise<boolean> {
  const challengeMessage = `StellarCade Bot Auth | Telegram ID: ${telegramUserId} | Nonce: ${challengeNonce}`;

  const isValid = await verifyMessageSignature({
    signerAddress: userStellarAddress,
    message: challengeMessage,
    signature,
  });

  if (!isValid) {
    throw new Error("Invalid signature: authentication rejected.");
  }

  console.log(`[Bot] User ${telegramUserId} successfully authenticated as ${userStellarAddress}`);
  return true;
}
```

---

## Executing Chat Rounds & Claims

```typescript
import { BotSessionClient } from "@stellarcade/sdk";

const bot = new BotSessionClient();

// Query balance for linked wallet
const balance = await bot.getWalletStats("GBZXN7PIRZGNMHGA72STUFIO");
console.log(`Wallet Balance: ${balance.xlm} XLM | Active XP: ${balance.xp}`);
```
