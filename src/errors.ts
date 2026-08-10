export class StellarCadeError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "StellarCadeError";
  }
}

export class ConfigError extends StellarCadeError {
  constructor(message: string, cause?: unknown) {
    super(message, "CONFIG_ERROR", cause);
    this.name = "ConfigError";
  }
}

export class NetworkMismatchError extends StellarCadeError {
  constructor(message: string) {
    super(message, "NETWORK_MISMATCH", undefined);
    this.name = "NetworkMismatchError";
  }
}

export class RpcError extends StellarCadeError {
  constructor(
    message: string,
    public readonly status?: number,
    cause?: unknown,
  ) {
    super(message, "RPC_ERROR", cause);
    this.name = "RpcError";
  }
}

export class NotConnectedError extends StellarCadeError {
  constructor(message = "No wallet connector is connected") {
    super(message, "NOT_CONNECTED");
    this.name = "NotConnectedError";
  }
}

export class FairnessVerificationError extends StellarCadeError {
  constructor(message: string, cause?: unknown) {
    super(message, "FAIRNESS_VERIFICATION_FAILED", cause);
    this.name = "FairnessVerificationError";
  }
}

export class TxTimeoutError extends StellarCadeError {
  constructor(public readonly hash: string) {
    super(`Transaction ${hash} did not settle before timeout`, "TX_TIMEOUT");
    this.name = "TxTimeoutError";
  }
}
