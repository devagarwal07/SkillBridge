import { formatDate } from "@/lib/utils";

/**
 * Interface for transaction receipt data
 */
export interface TransactionReceiptData {
  txHash: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  amountUsd: string;
  gasUsed?: string;
  gasFee?: string;
  timestamp: Date;
  status: "success" | "pending" | "failed";
  network: string;
}

/**
 * Format transaction receipt data for display
 */
export function formatReceiptData(
  data: TransactionReceiptData
): FormattedReceiptData {
  return {
    ...data,
    formattedDate: formatDate(data.timestamp),
    formattedTime: new Date(data.timestamp).toLocaleTimeString(),
    shortTxHash: `${data.txHash.substring(0, 10)}...${data.txHash.substring(
      data.txHash.length - 6
    )}`,
    shortFromAddress: `${data.fromAddress.substring(
      0,
      8
    )}...${data.fromAddress.substring(data.fromAddress.length - 6)}`,
    shortToAddress: `${data.toAddress.substring(
      0,
      8
    )}...${data.toAddress.substring(data.toAddress.length - 6)}`,
    receiptId: `SB-${Date.now().toString().substring(5)}-${Math.floor(
      Math.random() * 1000
    )}`,
  };
}

/**
 * Interface for formatted transaction receipt data
 */
export interface FormattedReceiptData extends TransactionReceiptData {
  formattedDate: string;
  formattedTime: string;
  shortTxHash: string;
  shortFromAddress: string;
  shortToAddress: string;
  receiptId: string;
}

/**
 * Generate a downloadable filename for the receipt
 */
export function generateReceiptFilename(data: FormattedReceiptData): string {
  const dateStr = new Date(data.timestamp)
    .toISOString()
    .split("T")[0]
    .replace(/-/g, "");

  return `SkillBridge_Receipt_${dateStr}_${data.receiptId}.pdf`;
}

/**
 * Get transaction receipt data from transaction hash (mock implementation)
 * In a real app, this would fetch the transaction details from the blockchain
 */
export async function getTransactionReceiptFromHash(
  txHash: string,
  amount: string,
  amountUsd: string
): Promise<TransactionReceiptData> {
  // Simulation delay to mimic blockchain request
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    txHash,
    fromAddress:
      (window.ethereum as any)?.selectedAddress ||
      "0x0000000000000000000000000000000000000000",
    toAddress: "0x39DA4702c2A318BC030ff1A732D5fC66c7a8F010", // SkillBridge donation address
    amount,
    amountUsd,
    gasUsed: "21000",
    gasFee: "0.00042",
    timestamp: new Date(),
    status: "success",
    network: "Sepolia Testnet",
  };
}
