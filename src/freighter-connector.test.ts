import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { NotConnectedError } from "./errors.js";
import { FreighterConnector } from "./freighter-connector.js";

describe("FreighterConnector", () => {
  const originalWindow = globalThis.window;

  afterEach(() => {
    // @ts-expect-error test cleanup
    globalThis.window = originalWindow;
  });

  it("reports unavailable when window.freighterApi is missing", async () => {
    // @ts-expect-error simulate SSR / no extension
    globalThis.window = {};
    const connector = new FreighterConnector();
    expect(await connector.isAvailable()).toBe(false);
  });

  it("connects and exposes the returned address", async () => {
    // @ts-expect-error test double
    globalThis.window = {
      freighterApi: {
        isConnected: async () => ({ isConnected: true }),
        requestAccess: async () => ({ address: "GABC123" }),
        getAddress: async () => ({ address: "GABC123" }),
        signTransaction: async (xdr: string) => ({ signedTxXdr: `signed:${xdr}` }),
      },
    };

    const connector = new FreighterConnector();
    const address = await connector.connect();
    expect(address).toBe("GABC123");
    expect(await connector.getAddress()).toBe("GABC123");
  });

  it("throws NotConnectedError when signing before connect", async () => {
    // @ts-expect-error test double
    globalThis.window = {
      freighterApi: {
        isConnected: async () => ({ isConnected: false }),
        requestAccess: async () => ({ address: "" }),
        getAddress: async () => ({ address: "" }),
        signTransaction: async () => ({ signedTxXdr: "" }),
      },
    };

    const connector = new FreighterConnector();
    await expect(
      connector.signTransaction("AAAA", { networkPassphrase: "Test SDF Network ; September 2015" }),
    ).rejects.toBeInstanceOf(NotConnectedError);
  });

  it("signs and returns the signed XDR after connecting", async () => {
    // @ts-expect-error test double
    globalThis.window = {
      freighterApi: {
        isConnected: async () => ({ isConnected: true }),
        requestAccess: async () => ({ address: "GABC123" }),
        getAddress: async () => ({ address: "GABC123" }),
        signTransaction: async (xdr: string) => ({ signedTxXdr: `signed:${xdr}` }),
      },
    };

    const connector = new FreighterConnector();
    await connector.connect();
    const signed = await connector.signTransaction("AAAA", {
      networkPassphrase: "Test SDF Network ; September 2015",
    });
    expect(signed).toBe("signed:AAAA");
  });
});
