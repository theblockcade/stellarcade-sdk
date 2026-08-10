import type { WalletConnector } from "./connector.js";
import { NotConnectedError, StellarCadeError } from "./errors.js";

interface FreighterApi {
  isConnected(): Promise<{ isConnected: boolean }>;
  requestAccess(): Promise<{ address: string; error?: string }>;
  getAddress(): Promise<{ address: string; error?: string }>;
  signTransaction(
    xdr: string,
    opts: { networkPassphrase: string },
  ): Promise<{ signedTxXdr: string; error?: string }>;
}

declare global {
  interface Window {
    freighterApi?: FreighterApi;
  }
}

function getFreighter(): FreighterApi {
  if (typeof window === "undefined" || !window.freighterApi) {
    throw new StellarCadeError(
      "Freighter extension not found on window.freighterApi",
      "FREIGHTER_NOT_FOUND",
    );
  }
  return window.freighterApi;
}

/**
 * Wraps the Freighter browser-extension API. Freighter itself performs and
 * stores the signature — this class never sees a secret key, only signed
 * XDR coming back out of `signTransaction`.
 */
export class FreighterConnector implements WalletConnector {
  readonly id = "freighter";
  readonly name = "Freighter";
  private address: string | null = null;

  async isAvailable(): Promise<boolean> {
    if (typeof window === "undefined" || !window.freighterApi) return false;
    try {
      const { isConnected } = await getFreighter().isConnected();
      return isConnected;
    } catch {
      return false;
    }
  }

  async connect(): Promise<string> {
    const { address, error } = await getFreighter().requestAccess();
    if (error) {
      throw new StellarCadeError(`Freighter connect failed: ${error}`, "FREIGHTER_CONNECT_FAILED");
    }
    this.address = address;
    return address;
  }

  async disconnect(): Promise<void> {
    this.address = null;
  }

  async getAddress(): Promise<string | null> {
    if (this.address) return this.address;
    try {
      const { address } = await getFreighter().getAddress();
      this.address = address || null;
      return this.address;
    } catch {
      return null;
    }
  }

  async signTransaction(xdr: string, opts: { networkPassphrase: string }): Promise<string> {
    if (!this.address) {
      throw new NotConnectedError("Call connect() before signTransaction()");
    }
    const { signedTxXdr, error } = await getFreighter().signTransaction(xdr, {
      networkPassphrase: opts.networkPassphrase,
    });
    if (error) {
      throw new StellarCadeError(`Freighter signing failed: ${error}`, "FREIGHTER_SIGN_FAILED");
    }
    return signedTxXdr;
  }
}
