import { afterEach, describe, expect, it, vi } from "vitest";
import { PrizesClient } from "./prizes.js";

describe("PrizesClient", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("fetches a single pool's state", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ poolId: "p1", gameId: "coin-flip", balance: "500", asset: "XLM", lastPayoutAt: null }),
        { status: 200 },
      ),
    ) as unknown as typeof fetch;

    const client = new PrizesClient("https://gateway.example.com");
    const pool = await client.getPool("coin-flip");
    expect(pool.balance).toBe("500");
  });

  it("submits a claim for a player", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ hash: "tx1", status: "pending" }), { status: 200 }),
    ) as unknown as typeof fetch;

    const client = new PrizesClient("https://gateway.example.com");
    const result = await client.claim("p1", "GABC");
    expect(result.status).toBe("pending");

    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call?.[0]).toContain("/prizes/pools/p1/claim");
  });
});
