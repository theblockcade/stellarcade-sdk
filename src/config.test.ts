import { describe, expect, it } from "vitest";
import { createConfig, isMainnet } from "./config.js";
import { ConfigError, NetworkMismatchError } from "./errors.js";
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

describe("createConfig", () => {
  it("fills in defaults for a known network", () => {
    const config = createConfig({
      network: "testnet",
      gatewayUrl: "https://gateway.example.com",
      arbiterUrl: "https://arbiter.example.com",
      contracts,
    });

    expect(config.network).toBe("testnet");
    expect(config.rpcUrl).toContain("soroban-testnet");
    expect(config.networkPassphrase).toContain("Test SDF Network");
  });

  it("throws when network is missing", () => {
    expect(() =>
      // @ts-expect-error deliberately omitting the required field
      createConfig({ gatewayUrl: "x", arbiterUrl: "y", contracts }),
    ).toThrow(ConfigError);
  });

  it("throws NetworkMismatchError when passphrase does not match network", () => {
    expect(() =>
      createConfig({
        network: "mainnet",
        networkPassphrase: "Test SDF Network ; September 2015",
        gatewayUrl: "https://gateway.example.com",
        arbiterUrl: "https://arbiter.example.com",
        contracts,
      }),
    ).toThrow(NetworkMismatchError);
  });

  it("requires gatewayUrl, arbiterUrl and contracts", () => {
    expect(() =>
      createConfig({
        network: "testnet",
        gatewayUrl: "",
        arbiterUrl: "https://arbiter.example.com",
        contracts,
      }),
    ).toThrow(ConfigError);
  });
});

describe("isMainnet", () => {
  it("is true only for the mainnet network", () => {
    const testnetConfig = createConfig({
      network: "testnet",
      gatewayUrl: "https://gateway.example.com",
      arbiterUrl: "https://arbiter.example.com",
      contracts,
    });
    const mainnetConfig = createConfig({
      network: "mainnet",
      gatewayUrl: "https://gateway.example.com",
      arbiterUrl: "https://arbiter.example.com",
      contracts,
    });

    expect(isMainnet(testnetConfig)).toBe(false);
    expect(isMainnet(mainnetConfig)).toBe(true);
  });
});
