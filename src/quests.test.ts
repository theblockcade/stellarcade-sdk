import { afterEach, describe, expect, it, vi } from "vitest";
import { QuestsClient } from "./quests.js";

describe("QuestsClient", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("lists a player's quest progress", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify([{ questId: "q1", playerAddress: "GABC", progress: 3, target: 5, claimed: false, streak: 2 }]),
        { status: 200 },
      ),
    ) as unknown as typeof fetch;

    const client = new QuestsClient("https://gateway.example.com");
    const quests = await client.listForPlayer("GABC");
    expect(quests[0]?.progress).toBe(3);

    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call?.[0]).toContain("player=GABC");
  });

  it("claims a completed quest", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ hash: "tx1", status: "success" }), { status: 200 }),
    ) as unknown as typeof fetch;

    const client = new QuestsClient("https://gateway.example.com");
    const result = await client.claim("q1", "GABC");
    expect(result.status).toBe("success");
  });
});
