import { request } from "./rpc.js";
import type { QuestProgress, TxSubmitResult } from "./types.js";

export class QuestsClient {
  constructor(private readonly gatewayUrl: string) {}

  async listForPlayer(playerAddress: string): Promise<QuestProgress[]> {
    return request<QuestProgress[]>(this.gatewayUrl, `/quests?player=${encodeURIComponent(playerAddress)}`);
  }

  async claim(questId: string, playerAddress: string): Promise<TxSubmitResult> {
    return request<TxSubmitResult>(this.gatewayUrl, `/quests/${questId}/claim`, {
      method: "POST",
      body: { playerAddress },
    });
  }
}
