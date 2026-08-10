import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RpcError } from "./errors.js";
import { request } from "./rpc.js";

describe("request", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("returns parsed JSON on success", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    ) as unknown as typeof fetch;

    const result = await request<{ ok: boolean }>("https://api.example.com", "/health");
    expect(result).toEqual({ ok: true });
  });

  it("returns undefined for 204 No Content", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response(null, { status: 204 })) as unknown as typeof fetch;

    const result = await request("https://api.example.com", "/things/1");
    expect(result).toBeUndefined();
  });

  it("throws RpcError with status on non-2xx", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(new Response("not found", { status: 404, statusText: "Not Found" })) as unknown as typeof fetch;

    await expect(request("https://api.example.com", "/missing")).rejects.toMatchObject({
      name: "RpcError",
      status: 404,
    });
  });

  it("wraps network failures in RpcError", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new TypeError("network down")) as unknown as typeof fetch;

    await expect(request("https://api.example.com", "/health")).rejects.toBeInstanceOf(RpcError);
  });

  it("throws RpcError on malformed JSON", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response("not json", { status: 200 })) as unknown as typeof fetch;

    await expect(request("https://api.example.com", "/health")).rejects.toBeInstanceOf(RpcError);
  });
});
