import { afterEach, describe, expect, it, vi } from "vitest";
import { TournamentsClient } from "./tournaments.js";

describe("TournamentsClient", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("lists tournaments", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify([]), { status: 200 })) as unknown as typeof fetch;
    const client = new TournamentsClient("https://gateway.example.com");
    await client.list();
    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call?.[0]).toBe("https://gateway.example.com/tournaments");
  });

  it("enters a tournament for a player", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ hash: "tx1", status: "pending" }), { status: 200 }),
    ) as unknown as typeof fetch;

    const client = new TournamentsClient("https://gateway.example.com");
    const result = await client.enter("t1", "GABC");
    expect(result.status).toBe("pending");
  });
});
