import { ConnectorRegistry, type WalletConnector } from "./connector.js";
import { GamesClient } from "./games.js";
import { LeaderboardClient } from "./leaderboard.js";
import { PrizesClient } from "./prizes.js";
import { QuestsClient } from "./quests.js";
import { TournamentsClient } from "./tournaments.js";
import { pollTxStatus, type PollOptions } from "./tx-status.js";
import type { StellarCadeConfig, TxSubmitResult } from "./types.js";
import { NotConnectedError } from "./errors.js";

/**
 * The single entry point most integrators use. Wraps every domain client
 * (games, prizes, quests, leaderboard, tournaments) plus wallet-connector
 * management and transaction submission around one shared config.
 */
export class StellarCadeClient {
  readonly games: GamesClient;
  readonly prizes: PrizesClient;
  readonly quests: QuestsClient;
  readonly leaderboard: LeaderboardClient;
  readonly tournaments: TournamentsClient;
  readonly connectors = new ConnectorRegistry();

  constructor(readonly config: StellarCadeConfig) {
    this.games = new GamesClient(config.gatewayUrl);
    this.prizes = new PrizesClient(config.gatewayUrl);
    this.quests = new QuestsClient(config.gatewayUrl);
    this.leaderboard = new LeaderboardClient(config.gatewayUrl);
    this.tournaments = new TournamentsClient(config.gatewayUrl);
  }

  registerConnector(connector: WalletConnector): void {
    this.connectors.register(connector);
  }

  async connect(connectorId: string): Promise<string> {
    const connector = this.connectors.get(connectorId);
    if (!connector) {
      throw new NotConnectedError(`No connector registered with id "${connectorId}"`);
    }
    this.connectors.setActive(connectorId);
    return connector.connect();
  }

  async signTransaction(xdr: string): Promise<string> {
    const connector = this.connectors.getActive();
    if (!connector) {
      throw new NotConnectedError();
    }
    return connector.signTransaction(xdr, { networkPassphrase: this.config.networkPassphrase });
  }

  async waitForTx(hash: string, options?: PollOptions): Promise<TxSubmitResult> {
    return pollTxStatus(this.config.gatewayUrl, hash, options);
  }
}
