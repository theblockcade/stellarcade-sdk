import { afterEach, describe, expect, it, vi } from "vitest";
import { TxTimeoutError } from "./errors.js";
import { pollTxStatus } from "./tx-status.js";

describe("pollTxStatus", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns immediately when the tx is already settled", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ hash: "abc", status: "success" }), { status: 200 })) as unknown as typeof fetch;

    const result = await pollTxStatus("https://gateway.example.com", "abc");
    expect(result.status).toBe("success");
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it("polls until the tx settles", async () => {
    let calls = 0;
    globalThis.fetch = vi.fn().mockImplementation(async () => {
      calls += 1;
      const status = calls < 3 ? "pending" : "success";
      return new Response(JSON.stringify({ hash: "abc", status }), { status: 200 });
    }) as unknown as typeof fetch;

    const result = await pollTxStatus("https://gateway.example.com", "abc", { intervalMs: 1 });
    expect(result.status).toBe("success");
    expect(calls).toBe(3);
  });

  it("throws TxTimeoutError when the deadline elapses", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ hash: "abc", status: "pending" }), { status: 200 })) as unknown as typeof fetch;

    await expect(
      pollTxStatus("https://gateway.example.com", "abc", { timeoutMs: 5, intervalMs: 2 }),
    ).rejects.toBeInstanceOf(TxTimeoutError);
  });
});
