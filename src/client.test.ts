import { describe, expect, it } from "vitest";
import { createConfig } from "./config.js";
import { StellarCadeClient } from "./client.js";
import { NotConnectedError } from "./errors.js";
import type { WalletConnector } from "./connector.js";
import type { ContractAddresses } from "./types.js";

const contracts: ContractAddresses = {
  accessControl: "C".padEnd(56, "A"),
  randomGenerator: "C".padEnd(56, "B"),
  prizePool: "C".padEnd(56, "C"),
  leaderboard: "C".padEnd(56, "D"),
  questLedger: "C".padEnd(56, "E"),
  treasury: "C".padEnd(56, "F"),
  games: {},
};

function buildClient(): StellarCadeClient {
  const config = createConfig({
    network: "testnet",
    gatewayUrl: "https://gateway.example.com",
    arbiterUrl: "https://arbiter.example.com",
    contracts,
  });
  return new StellarCadeClient(config);
}

function stubConnector(): WalletConnector {
  return {
    id: "stub",
    name: "Stub",
    isAvailable: async () => true,
    connect: async () => "GABC",
    disconnect: async () => {},
    getAddress: async () => "GABC",
    signTransaction: async (xdr) => `signed:${xdr}`,
  };
}

describe("StellarCadeClient", () => {
  it("exposes one client per domain", () => {
    const client = buildClient();
    expect(client.games).toBeDefined();
    expect(client.prizes).toBeDefined();
    expect(client.quests).toBeDefined();
    expect(client.leaderboard).toBeDefined();
    expect(client.tournaments).toBeDefined();
  });

  it("throws NotConnectedError signing before connect", async () => {
    const client = buildClient();
    await expect(client.signTransaction("AAAA")).rejects.toBeInstanceOf(NotConnectedError);
  });

  it("connects a registered connector and signs through it", async () => {
    const client = buildClient();
    client.registerConnector(stubConnector());

    const address = await client.connect("stub");
    expect(address).toBe("GABC");

    const signed = await client.signTransaction("AAAA");
    expect(signed).toBe("signed:AAAA");
  });

  it("throws when connecting an unregistered connector id", async () => {
    const client = buildClient();
    await expect(client.connect("missing")).rejects.toBeInstanceOf(NotConnectedError);
  });
});
