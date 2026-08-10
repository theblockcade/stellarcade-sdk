import { TxTimeoutError } from "./errors.js";
import { request, withTimeout } from "./rpc.js";
import type { TxSubmitResult } from "./types.js";

export interface PollOptions {
  /** Max time to wait for the tx to leave "pending". Default 30s. */
  timeoutMs?: number;
  /** Delay between polls. Default 1.5s. */
  intervalMs?: number;
}

/**
 * Polls the gateway for a submitted transaction's status until it settles
 * (success or failed) or the timeout elapses. Soroban confirmation is not
 * instant, so callers that need a final result should await this rather
 * than trusting the immediate submit response.
 */
export async function pollTxStatus(
  gatewayUrl: string,
  hash: string,
  options: PollOptions = {},
): Promise<TxSubmitResult> {
  const timeoutMs = options.timeoutMs ?? 30_000;
  const intervalMs = options.intervalMs ?? 1_500;
  const deadline = Date.now() + timeoutMs;

  for (;;) {
    const result = await request<TxSubmitResult>(gatewayUrl, `/tx/${hash}`, {
      signal: withTimeout(5_000),
    });

    if (result.status !== "pending") {
      return result;
    }

    if (Date.now() >= deadline) {
      throw new TxTimeoutError(hash);
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}
