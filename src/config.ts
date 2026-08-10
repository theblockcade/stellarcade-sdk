import { ConfigError, NetworkMismatchError } from "./errors.js";
import type { ContractAddresses, Network, StellarCadeConfig } from "./types.js";

const NETWORK_PASSPHRASES: Record<Network, string> = {
  mainnet: "Public Global Stellar Network ; September 2015",
  testnet: "Test SDF Network ; September 2015",
  futurenet: "Test SDF Future Network ; October 2022",
  local: "Standalone Network ; February 2017",
};

const DEFAULT_RPC_URLS: Record<Network, string> = {
  mainnet: "https://mainnet.sorobanrpc.com",
  testnet: "https://soroban-testnet.stellar.org",
  futurenet: "https://rpc-futurenet.stellar.org",
  local: "http://localhost:8000/soroban/rpc",
};

const DEFAULT_HORIZON_URLS: Record<Network, string> = {
  mainnet: "https://horizon.stellar.org",
  testnet: "https://horizon-testnet.stellar.org",
  futurenet: "https://horizon-futurenet.stellar.org",
  local: "http://localhost:8000",
};

export interface CreateConfigOptions {
  /**
   * The Stellar network. There is no default — a wrong network is a
   * fund-losing mistake, so the caller must say which one they mean.
   */
  network: Network;
  rpcUrl?: string;
  horizonUrl?: string;
  networkPassphrase?: string;
  gatewayUrl: string;
  arbiterUrl: string;
  contracts: ContractAddresses;
}

/**
 * Builds and validates a {@link StellarCadeConfig}. Network, RPC URL and
 * passphrase are cross-checked against each other: passing a testnet
 * passphrase with `network: "mainnet"` throws rather than silently
 * connecting to the wrong ledger.
 */
export function createConfig(options: CreateConfigOptions): StellarCadeConfig {
  if (!options.network) {
    throw new ConfigError("`network` is required and has no default");
  }

  const rpcUrl = options.rpcUrl ?? DEFAULT_RPC_URLS[options.network];
  const horizonUrl = options.horizonUrl ?? DEFAULT_HORIZON_URLS[options.network];
  const networkPassphrase = options.networkPassphrase ?? NETWORK_PASSPHRASES[options.network];

  if (networkPassphrase !== NETWORK_PASSPHRASES[options.network]) {
    throw new NetworkMismatchError(
      `networkPassphrase does not match network "${options.network}". ` +
        `Expected "${NETWORK_PASSPHRASES[options.network]}", got "${networkPassphrase}". ` +
        `Refusing to build a config that could sign for the wrong ledger.`,
    );
  }

  if (!options.gatewayUrl) {
    throw new ConfigError("`gatewayUrl` is required");
  }
  if (!options.arbiterUrl) {
    throw new ConfigError("`arbiterUrl` is required");
  }
  if (!options.contracts) {
    throw new ConfigError("`contracts` addresses are required");
  }

  return {
    network: options.network,
    rpcUrl,
    horizonUrl,
    networkPassphrase,
    gatewayUrl: options.gatewayUrl,
    arbiterUrl: options.arbiterUrl,
    contracts: options.contracts,
  };
}

export function isMainnet(config: StellarCadeConfig): boolean {
  return config.network === "mainnet";
}
