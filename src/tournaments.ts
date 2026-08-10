import { request } from "./rpc.js";
import type { TournamentSummary, TxSubmitResult } from "./types.js";

export class TournamentsClient {
  constructor(private readonly gatewayUrl: string) {}

  async list(): Promise<TournamentSummary[]> {
    return request<TournamentSummary[]>(this.gatewayUrl, "/tournaments");
  }

  async get(tournamentId: string): Promise<TournamentSummary> {
    return request<TournamentSummary>(this.gatewayUrl, `/tournaments/${tournamentId}`);
  }

  async enter(tournamentId: string, playerAddress: string): Promise<TxSubmitResult> {
    return request<TxSubmitResult>(this.gatewayUrl, `/tournaments/${tournamentId}/enter`, {
      method: "POST",
      body: { playerAddress },
    });
  }
}
