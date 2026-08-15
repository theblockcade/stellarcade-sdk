# Tournaments

Tournaments run on the `tournament-system` contract (**Implemented**, 906 lines, 19 tests — see [Soroban Smart Contracts](/contracts)), which handles bracket creation, joining, per-match results, and elimination/advancement. The SDK reads and enters tournaments through the gateway via `TournamentsClient` — it doesn't build bracket transactions client-side.

---

## Listing and Entering

```typescript
import { StellarCadeClient, FreighterConnector, createConfig } from "@stellarcade/sdk";

const client = new StellarCadeClient(createConfig({
  network: "testnet",
  gatewayUrl: "https://gateway.stellarcade.example",
  arbiterUrl: "https://arbiter.stellarcade.example",
  contracts: { /* ...contract addresses... */ },
}));

client.registerConnector(new FreighterConnector());
const playerAddress = await client.connect("freighter");

const tournaments = await client.tournaments.list();
const active = tournaments.filter((t) => t.status === "active" || t.status === "upcoming");

active.forEach((t) => {
  console.log(`${t.tournamentId} (${t.gameId}) — ${t.status} — pool: ${t.prizePool}`);
});

// Enter one
const target = active[0];
const result = await client.tournaments.enter(target.tournamentId, playerAddress);
await client.waitForTx(result.hash);
```

`TournamentSummary` — the shape returned by both `list()` and `get(tournamentId)` — is `{ tournamentId, gameId, status, startsAtLedger, endsAtLedger, prizePool }`, where status is `"upcoming" | "active" | "finished"`. There's no `entryFeeXlm` field or fixed payout-split constant anywhere in the SDK's types; entry fees and payout distribution are configured per-tournament on the `tournament-system` contract, not fixed protocol values, and aren't currently surfaced through this client at all.
