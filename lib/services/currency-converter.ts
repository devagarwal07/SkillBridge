import { ethers } from "ethers";

// Conversion rates (in a real app, these would come from APIs)
const RATES = {
  ETH_USD: 3150.42, // 1 ETH = ~3150 USD
  USD_INR: 83.12, // 1 USD = ~83 INR
};

// Convert ETH to USD
export function ethToUsd(ethAmount: number): number {
  return ethAmount * RATES.ETH_USD;
}

// Convert USD to ETH
export function usdToEth(usdAmount: number): number {
  return usdAmount / RATES.ETH_USD;
}

// Convert ETH to INR
export function ethToInr(ethAmount: number): number {
  return ethToUsd(ethAmount) * RATES.USD_INR;
}

// Convert INR to ETH
export function inrToEth(inrAmount: number): number {
  return usdToEth(inrAmount / RATES.USD_INR);
}

// Format ETH amount for display
export function formatEth(ethAmount: number): string {
  return `${ethAmount.toFixed(6)} ETH`;
}

// Format USD amount for display
export function formatUsd(usdAmount: number): string {
  return `$${usdAmount.toFixed(2)}`;
}

// Format INR amount for display
export function formatInr(inrAmount: number): string {
  return `₹${inrAmount.toFixed(2)}`;
}

// Convert ETH to Wei (for blockchain transactions)
export function ethToWei(ethAmount: number | string): string {
  return ethers.utils.parseEther(ethAmount.toString())._hex;
}

// Get current rates from API (in a real app)
export async function getCurrentRates(): Promise<{
  ETH_USD: number;
  USD_INR: number;
}> {
  try {
    // In a real app, we'd call an API like CoinGecko or CurrencyLayer
    const ethResponse = await fetch("/api/blockchain/eth-price");
    const ethData = await ethResponse.json();

    // For INR, we'd use a forex API
    // Mock response for now
    return {
      ETH_USD: ethData.price || RATES.ETH_USD,
      USD_INR: RATES.USD_INR,
    };
  } catch (error) {
    console.error("Error fetching current rates:", error);
    // Return default rates if API fails
    return RATES;
  }
}
