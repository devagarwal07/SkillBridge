/**
 * Blockchain type definitions
 */

// Transaction types
export interface Transaction {
  id: string;
  type: "sent" | "received";
  amount: string;
  from: string;
  to: string;
  timestamp: number;
  status: "pending" | "confirmed" | "failed";
}

// Proposal types
export interface Proposal {
  id: number;
  title: string;
  description: string;
  amount: number;
  status: "active" | "completed" | "rejected";
  votes: {
    yes: number;
    no: number;
  };
  deadline: string;
}

// Testnet network types
export interface TestNet {
  id: string;
  name: string;
  chainId: number;
  rpcUrl?: string;
  explorerUrl?: string;
}

// ZKP verification result
export interface VerificationResult {
  success: boolean;
  message: string;
  proof?: string;
}

// Custom window interface with ethereum provider
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, callback: (...args: any[]) => void) => void;
      removeListener: (
        eventName: string,
        callback: (...args: any[]) => void
      ) => void;
      removeAllListeners: (eventName: string) => void;
    };
  }
}
