import { FairnessVerificationError } from "./errors.js";
import type { FairnessProof, RoundCommitment, RoundReveal } from "./types.js";

/**
 * Everything here runs against Web Crypto (`globalThis.crypto.subtle`), which
 * is available in every modern browser and in Node >=19 without polyfills.
 * That is deliberate: fairness verification is the one thing a player must be
 * able to run themselves, offline, without trusting our API — so it cannot
 * depend on a Node-only module.
 */

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toHex(digest);
}

/**
 * The arbiter commits to `sha256(serverSeed)` BEFORE accepting any bet for a
 * round. This recomputes that hash from a revealed seed and compares it
 * against the published commitment, so a player can prove the arbiter did
 * not pick its seed after seeing the bet.
 */
export async function verifyCommitment(commitment: RoundCommitment, reveal: RoundReveal): Promise<boolean> {
  const recomputed = await sha256Hex(reveal.serverSeed);
  return recomputed === commitment.commitHash;
}

/**
 * Derives the same pseudo-random value the arbiter used to settle the round,
 * from the revealed seed material alone. Combines the server seed (secret
 * until reveal), the client/player seed (chosen before the round), the
 * per-round nonce, and the Stellar ledger hash at commit time — so neither
 * the arbiter nor the player unilaterally controls the outcome.
 */
export async function deriveOutcomeValue(reveal: RoundReveal): Promise<bigint> {
  const material = `${reveal.serverSeed}:${reveal.clientSeed}:${reveal.nonce}:${reveal.ledgerHash}`;
  const hex = await sha256Hex(material);
  return BigInt(`0x${hex}`);
}

/**
 * Maps the derived value onto a bounded outcome space, e.g. `mapToRange(v, 2)`
 * for a coin flip or `mapToRange(v, 6)` for a die. Uses modulo on the full
 * 256-bit digest, so bias toward low values is negligible for any realistic
 * game range.
 */
export function mapToRange(value: bigint, size: number): number {
  if (size <= 0) {
    throw new FairnessVerificationError(`Invalid outcome range size: ${size}`);
  }
  return Number(value % BigInt(size));
}

export interface VerifyProofResult {
  valid: boolean;
  derivedValue: string;
  reason?: string;
}

/**
 * Full end-to-end verification of a published {@link FairnessProof}: checks
 * the commitment matches the revealed seed, then recomputes the derived
 * value and confirms it matches what the proof claims. This is the single
 * function a player (or an auditor) needs to independently confirm a round
 * was not rigged — no API trust required, only the published proof.
 */
export async function verifyProof(commitment: RoundCommitment, proof: FairnessProof): Promise<VerifyProofResult> {
  const reveal: RoundReveal = {
    roundId: proof.roundId,
    serverSeed: proof.serverSeed,
    clientSeed: proof.clientSeed,
    nonce: proof.nonce,
    ledgerHash: proof.ledgerHash,
  };

  const commitmentValid = await verifyCommitment(commitment, reveal);
  if (!commitmentValid) {
    return {
      valid: false,
      derivedValue: "",
      reason: "Revealed server seed does not hash to the published commitment",
    };
  }

  const derived = await deriveOutcomeValue(reveal);
  const derivedHex = derived.toString(16);

  if (derivedHex !== proof.derivedValue) {
    return {
      valid: false,
      derivedValue: derivedHex,
      reason: "Derived value does not match the value published in the proof",
    };
  }

  return { valid: true, derivedValue: derivedHex };
}
