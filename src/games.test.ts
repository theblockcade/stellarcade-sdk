import { afterEach, describe, expect, it, vi } from "vitest";
import { GamesClient } from "./games.js";

describe("GamesClient", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("lists games", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([{ id: "coin-flip", name: "Coin Flip", status: "live" }]), { status: 200 }),
    ) as unknown as typeof fetch;

    const client = new GamesClient("https://gateway.example.com");
    const games = await client.list();
    expect(games).toHaveLength(1);
    expect(games[0]?.id).toBe("coin-flip");
  });

  it("commits a round before play", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          roundId: "r1",
          gameId: "coin-flip",
          commitHash: "abc",
          committedAtLedger: 1,
          expiresAtLedger: 2,
        }),
        { status: 200 },
      ),
    ) as unknown as typeof fetch;

    const client = new GamesClient("https://gateway.example.com");
    const commitment = await client.commitRound("coin-flip");
    expect(commitment.roundId).toBe("r1");

    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call?.[0]).toContain("/games/coin-flip/commit");
    expect((call?.[1] as RequestInit)?.method).toBe("POST");
  });

  it("submits a play with the given stake and choice", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ hash: "tx1", status: "pending" }), { status: 200 }),
    ) as unknown as typeof fetch;

    const client = new GamesClient("https://gateway.example.com");
    const result = await client.play({
      gameId: "dice-roll",
      playerAddress: "GABC",
      stake: "10.0000000",
      clientSeed: "seed",
      choice: { number: 4 },
    });

    expect(result.status).toBe("pending");
  });
});
