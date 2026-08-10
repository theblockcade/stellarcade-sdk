import { request } from "./rpc.js";
import type { GameId, LeaderboardEntry } from "./types.js";

export interface LeaderboardQuery {
  gameId?: GameId | "overall";
  limit?: number;
}

export class LeaderboardClient {
  constructor(private readonly gatewayUrl: string) {}

  async get(query: LeaderboardQuery = {}): Promise<LeaderboardEntry[]> {
    const params = new URLSearchParams();
    if (query.gameId) params.set("game", query.gameId);
    if (query.limit) params.set("limit", String(query.limit));
    const qs = params.toString();
    return request<LeaderboardEntry[]>(this.gatewayUrl, `/leaderboard${qs ? `?${qs}` : ""}`);
  }
}
