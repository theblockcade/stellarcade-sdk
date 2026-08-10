import { afterEach, describe, expect, it, vi } from "vitest";
import { LeaderboardClient } from "./leaderboard.js";

describe("LeaderboardClient", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("fetches the overall leaderboard with no query", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify([]), { status: 200 })) as unknown as typeof fetch;

    const client = new LeaderboardClient("https://gateway.example.com");
    await client.get();

    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call?.[0]).toBe("https://gateway.example.com/leaderboard");
  });

  it("passes game and limit as query params", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify([]), { status: 200 })) as unknown as typeof fetch;

    const client = new LeaderboardClient("https://gateway.example.com");
    await client.get({ gameId: "dice-roll", limit: 10 });

    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const url = String(call?.[0]);
    expect(url).toContain("game=dice-roll");
    expect(url).toContain("limit=10");
  });
});
