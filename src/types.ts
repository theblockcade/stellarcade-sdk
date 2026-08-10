export type Network = "testnet" | "mainnet" | "futurenet" | "local";

export interface StellarCadeConfig {
  network: Network;
  rpcUrl: string;
  horizonUrl: string;
  networkPassphrase: string;
  gatewayUrl: string;
  arbiterUrl: string;
  contracts: ContractAddresses;
}

export interface ContractAddresses {
  accessControl: string;
  randomGenerator: string;
  prizePool: string;
  leaderboard: string;
  questLedger: string;
  treasury: string;
  games: Record<string, string>;
}

export type GameId =
  | "coin-flip"
  | "dice-roll"
  | "higher-lower"
  | "number-guess"
  | "trivia"
  | "pattern-puzzle";

export interface GameSummary {
  id: GameId;
  name: string;
  status: "live" | "beta" | "coming-soon";
  minStake: string;
  maxStake: string;
  asset: string;
}

export interface RoundCommitment {
  roundId: string;
  gameId: GameId;
  commitHash: string;
  committedAtLedger: number;
  expiresAtLedger: number;
}

export interface RoundReveal {
  roundId: string;
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  ledgerHash: string;
}

export interface RoundResult {
  roundId: string;
  gameId: GameId;
  outcome: unknown;
  payout: string;
  settledAtLedger: number;
  proofUrl: string;
}

export interface FairnessProof {
  roundId: string;
  commitHash: string;
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  ledgerHash: string;
  derivedValue: string;
  outcome: unknown;
}

export interface PrizePoolState {
  poolId: string;
  gameId: GameId;
  balance: string;
  asset: string;
  lastPayoutAt: number | null;
}

export interface QuestProgress {
  questId: string;
  playerAddress: string;
  progress: number;
  target: number;
  claimed: boolean;
  streak: number;
}

export interface LeaderboardEntry {
  rank: number;
  playerAddress: string;
  score: string;
  gameId: GameId | "overall";
}

export interface TournamentSummary {
  tournamentId: string;
  gameId: GameId;
  status: "upcoming" | "active" | "finished";
  startsAtLedger: number;
  endsAtLedger: number;
  prizePool: string;
}

export interface TxSubmitResult {
  hash: string;
  status: "pending" | "success" | "failed";
  ledger?: number;
}
