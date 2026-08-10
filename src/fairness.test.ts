import { describe, expect, it } from "vitest";
import { deriveOutcomeValue, mapToRange, verifyCommitment, verifyProof } from "./fairness.js";
import type { FairnessProof, RoundCommitment, RoundReveal } from "./types.js";

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

describe("verifyCommitment", () => {
  it("accepts a reveal whose seed hashes to the commitment", async () => {
    const serverSeed = "super-secret-seed-42";
    const commitHash = await sha256Hex(serverSeed);
    const commitment: RoundCommitment = {
      roundId: "round-1",
      gameId: "coin-flip",
      commitHash,
      committedAtLedger: 100,
      expiresAtLedger: 200,
    };
    const reveal: RoundReveal = {
      roundId: "round-1",
      serverSeed,
      clientSeed: "player-seed",
      nonce: 1,
      ledgerHash: "abc123",
    };

    expect(await verifyCommitment(commitment, reveal)).toBe(true);
  });

  it("rejects a reveal with a tampered seed", async () => {
    const commitHash = await sha256Hex("real-seed");
    const commitment: RoundCommitment = {
      roundId: "round-1",
      gameId: "coin-flip",
      commitHash,
      committedAtLedger: 100,
      expiresAtLedger: 200,
    };
    const reveal: RoundReveal = {
      roundId: "round-1",
      serverSeed: "fake-seed",
      clientSeed: "player-seed",
      nonce: 1,
      ledgerHash: "abc123",
    };

    expect(await verifyCommitment(commitment, reveal)).toBe(false);
  });
});

describe("deriveOutcomeValue", () => {
  it("is deterministic for identical inputs", async () => {
    const reveal: RoundReveal = {
      roundId: "round-1",
      serverSeed: "seed",
      clientSeed: "client",
      nonce: 7,
      ledgerHash: "ledger-hash",
    };

    const a = await deriveOutcomeValue(reveal);
    const b = await deriveOutcomeValue(reveal);
    expect(a).toBe(b);
  });

  it("changes when any input changes", async () => {
    const base: RoundReveal = {
      roundId: "round-1",
      serverSeed: "seed",
      clientSeed: "client",
      nonce: 7,
      ledgerHash: "ledger-hash",
    };

    const baseValue = await deriveOutcomeValue(base);
    const differentNonce = await deriveOutcomeValue({ ...base, nonce: 8 });
    const differentClientSeed = await deriveOutcomeValue({ ...base, clientSeed: "other" });

    expect(differentNonce).not.toBe(baseValue);
    expect(differentClientSeed).not.toBe(baseValue);
  });
});

describe("mapToRange", () => {
  it("maps into [0, size)", () => {
    for (const v of [0n, 1n, 255n, 256n, 100000n]) {
      const mapped = mapToRange(v, 6);
      expect(mapped).toBeGreaterThanOrEqual(0);
      expect(mapped).toBeLessThan(6);
    }
  });

  it("throws for a non-positive range", () => {
    expect(() => mapToRange(5n, 0)).toThrow();
  });
});

describe("verifyProof", () => {
  it("validates a correctly constructed proof end to end", async () => {
    const serverSeed = "server-seed-xyz";
    const clientSeed = "client-seed-abc";
    const nonce = 3;
    const ledgerHash = "ledger-42";

    const commitHash = await sha256Hex(serverSeed);
    const derived = await deriveOutcomeValue({ roundId: "r1", serverSeed, clientSeed, nonce, ledgerHash });

    const commitment: RoundCommitment = {
      roundId: "r1",
      gameId: "dice-roll",
      commitHash,
      committedAtLedger: 10,
      expiresAtLedger: 20,
    };
    const proof: FairnessProof = {
      roundId: "r1",
      commitHash,
      serverSeed,
      clientSeed,
      nonce,
      ledgerHash,
      derivedValue: derived.toString(16),
      outcome: mapToRange(derived, 6) + 1,
    };

    const result = await verifyProof(commitment, proof);
    expect(result.valid).toBe(true);
  });

  it("flags a proof whose seed does not match the commitment", async () => {
    const commitHash = await sha256Hex("real-seed");
    const commitment: RoundCommitment = {
      roundId: "r1",
      gameId: "dice-roll",
      commitHash,
      committedAtLedger: 10,
      expiresAtLedger: 20,
    };
    const proof: FairnessProof = {
      roundId: "r1",
      commitHash,
      serverSeed: "tampered-seed",
      clientSeed: "client",
      nonce: 1,
      ledgerHash: "ledger",
      derivedValue: "deadbeef",
      outcome: 3,
    };

    const result = await verifyProof(commitment, proof);
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/commitment/);
  });

  it("flags a proof with a mismatched derived value", async () => {
    const serverSeed = "server-seed-xyz";
    const commitHash = await sha256Hex(serverSeed);
    const commitment: RoundCommitment = {
      roundId: "r1",
      gameId: "dice-roll",
      commitHash,
      committedAtLedger: 10,
      expiresAtLedger: 20,
    };
    const proof: FairnessProof = {
      roundId: "r1",
      commitHash,
      serverSeed,
      clientSeed: "client",
      nonce: 1,
      ledgerHash: "ledger",
      derivedValue: "0000",
      outcome: 3,
    };

    const result = await verifyProof(commitment, proof);
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/derived value/i);
  });
});
