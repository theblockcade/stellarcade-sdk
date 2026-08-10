import { request } from "./rpc.js";
import type { GameId, PrizePoolState, TxSubmitResult } from "./types.js";

export class PrizesClient {
  constructor(private readonly gatewayUrl: string) {}

  async getPool(gameId: GameId): Promise<PrizePoolState> {
    return request<PrizePoolState>(this.gatewayUrl, `/prizes/pools/${gameId}`);
  }

  async listPools(): Promise<PrizePoolState[]> {
    return request<PrizePoolState[]>(this.gatewayUrl, "/prizes/pools");
  }

  async claim(poolId: string, playerAddress: string): Promise<TxSubmitResult> {
    return request<TxSubmitResult>(this.gatewayUrl, `/prizes/pools/${poolId}/claim`, {
      method: "POST",
      body: { playerAddress },
    });
  }
}
