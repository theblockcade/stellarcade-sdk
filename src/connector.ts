/**
 * A wallet connector never holds a private key inside the SDK process — it
 * delegates signing to whatever the concrete implementation wraps
 * (Freighter's extension, a passkey signer, a hardware wallet). The SDK only
 * ever sees a signed XDR envelope coming back out.
 */
export interface WalletConnector {
  readonly id: string;
  readonly name: string;
  isAvailable(): Promise<boolean>;
  connect(): Promise<string>;
  disconnect(): Promise<void>;
  getAddress(): Promise<string | null>;
  signTransaction(xdr: string, opts: { networkPassphrase: string }): Promise<string>;
}

export class ConnectorRegistry {
  private connectors = new Map<string, WalletConnector>();
  private activeId: string | null = null;

  register(connector: WalletConnector): void {
    this.connectors.set(connector.id, connector);
  }

  list(): WalletConnector[] {
    return [...this.connectors.values()];
  }

  get(id: string): WalletConnector | undefined {
    return this.connectors.get(id);
  }

  setActive(id: string): void {
    if (!this.connectors.has(id)) {
      throw new Error(`No connector registered with id "${id}"`);
    }
    this.activeId = id;
  }

  getActive(): WalletConnector | null {
    return this.activeId ? (this.connectors.get(this.activeId) ?? null) : null;
  }
}
