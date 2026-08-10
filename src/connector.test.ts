import { describe, expect, it } from "vitest";
import { ConnectorRegistry, type WalletConnector } from "./connector.js";

function stubConnector(id: string): WalletConnector {
  return {
    id,
    name: id,
    isAvailable: async () => true,
    connect: async () => "GABC",
    disconnect: async () => {},
    getAddress: async () => "GABC",
    signTransaction: async (xdr) => xdr,
  };
}

describe("ConnectorRegistry", () => {
  it("registers and lists connectors", () => {
    const registry = new ConnectorRegistry();
    registry.register(stubConnector("freighter"));
    registry.register(stubConnector("passkey"));

    expect(registry.list().map((c) => c.id).sort()).toEqual(["freighter", "passkey"]);
  });

  it("has no active connector until one is set", () => {
    const registry = new ConnectorRegistry();
    registry.register(stubConnector("freighter"));

    expect(registry.getActive()).toBeNull();
  });

  it("tracks the active connector by id", () => {
    const registry = new ConnectorRegistry();
    registry.register(stubConnector("freighter"));
    registry.setActive("freighter");

    expect(registry.getActive()?.id).toBe("freighter");
  });

  it("throws when activating an unregistered connector", () => {
    const registry = new ConnectorRegistry();
    expect(() => registry.setActive("nope")).toThrow(/No connector registered/);
  });
});
