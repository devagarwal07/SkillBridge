import { ethers } from "ethers";
import { DESTINATION_ADDRESS } from "@/app/blockchain/page";
import { formatCurrency } from "@/lib/utils";

// Connection between student proposal IDs and blockchain proposal IDs
const proposalMapping: Record<string, number> = {
  "student-001": 1, // Priya Sharma => Community Education Fund
  "student-002": 2, // Aditya Verma => Developer Grants Program
  "student-003": 3, // Meera Joshi => UX Improvements
};

// ETH to USD conversion (simplified, in real app would use an API)
export async function convertEthToUsd(ethAmount: number): Promise<number> {
  try {
    const response = await fetch("/api/blockchain/eth-price");
    const data = await response.json();
    return ethAmount * data.price;
  } catch (error) {
    console.error("Error converting ETH to USD:", error);
    // Fallback rate
    return ethAmount * 3150.42;
  }
}

// USD to ETH conversion
export async function convertUsdToEth(usdAmount: number): Promise<number> {
  try {
    const response = await fetch("/api/blockchain/eth-price");
    const data = await response.json();
    return usdAmount / data.price;
  } catch (error) {
    console.error("Error converting USD to ETH:", error);
    // Fallback rate
    return usdAmount / 3150.42;
  }
}

// Get blockchain proposal ID for a student proposal
export function getBlockchainProposalId(studentId: string): number | null {
  return proposalMapping[studentId] || null;
}

// Fund student proposal via blockchain
export async function fundStudentProposal(
  studentId: string,
  amountInr: number
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    // Check if MetaMask is available
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    // Get blockchain proposal ID
    const blockchainProposalId = getBlockchainProposalId(studentId);
    if (!blockchainProposalId) {
      throw new Error("Student proposal not connected to blockchain");
    }

    // Request account access
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];

    // Convert INR to USD (approximately)
    const amountUsd = amountInr / 80; // Simple INR to USD conversion

    // Convert USD to ETH
    const amountEth = await convertUsdToEth(amountUsd);
    const amountEthFormatted = amountEth.toFixed(6);

    // Create transaction
    const transactionParameters = {
      to: DESTINATION_ADDRESS,
      from: account,
      value: ethers.utils.parseEther(amountEthFormatted)._hex,
      gas: "0x5208", // 21000 gas
    };

    // Send transaction
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });

    return { success: true, txHash };
  } catch (error: any) {
    console.error("Error funding student proposal:", error);
    return { success: false, error: error.message };
  }
}

// Verify Aadhar card with ZKP
export async function verifyAadharWithZkp(
  aadharNumber: string,
  aadharImage: string
): Promise<{ success: boolean; message: string; proof?: string }> {
  try {
    // Create image hash (simplified for demo)
    const imageHash = await createImageHash(aadharImage);

    // Call API endpoint for verification
    const response = await fetch("/api/blockchain/verify-zkp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ aadharNumber, imageHash }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error verifying Aadhar with ZKP:", error);
    return {
      success: false,
      message: "Error processing verification request",
    };
  }
}

// Helper function to create a hash from image data
async function createImageHash(imageData: string): Promise<string> {
  // In a real app, we would use a proper hashing algorithm
  // This is simplified for the demo
  const encoder = new TextEncoder();
  const data = encoder.encode(imageData);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}
