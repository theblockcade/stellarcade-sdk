import { request } from "./rpc.js";
import type { GameId, GameSummary, RoundCommitment, RoundResult, TxSubmitResult } from "./types.js";

export interface PlayRoundInput {
  gameId: GameId;
  playerAddress: string;
  stake: string;
  clientSeed: string;
  /** Game-specific choice payload, e.g. `{ side: "heads" }` for coin-flip. */
  choice: unknown;
}

/**
 * Client for the game-service surface of the gateway: listing games,
 * committing to a round, and submitting a play. Settlement and fairness
 * proofs are served by the arbiter — see {@link module:fairness} and the
 * arbiter's `/verify` endpoint for the client-side proof-check counterpart.
 */
export class GamesClient {
  constructor(private readonly gatewayUrl: string) {}

  async list(): Promise<GameSummary[]> {
    return request<GameSummary[]>(this.gatewayUrl, "/games");
  }

  async get(gameId: GameId): Promise<GameSummary> {
    return request<GameSummary>(this.gatewayUrl, `/games/${gameId}`);
  }

  /**
   * Requests a fresh round commitment from the arbiter (via the gateway)
   * BEFORE any stake is placed. The returned `commitHash` is what the
   * player later checks their reveal against — see
   * {@link module:fairness.verifyCommitment}.
   */
  async commitRound(gameId: GameId): Promise<RoundCommitment> {
    return request<RoundCommitment>(this.gatewayUrl, `/games/${gameId}/commit`, { method: "POST" });
  }

  async play(input: PlayRoundInput): Promise<TxSubmitResult> {
    return request<TxSubmitResult>(this.gatewayUrl, `/games/${input.gameId}/play`, {
      method: "POST",
      body: input,
    });
  }

  async getResult(roundId: string): Promise<RoundResult> {
    return request<RoundResult>(this.gatewayUrl, `/rounds/${roundId}`);
  }
}
