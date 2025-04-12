"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import {
  DollarSign,
  RefreshCw,
  ArrowRightLeft,
  ExternalLink,
  Loader2,
  CheckCircle,
  TrendingUp,
  Wallet,
  Copy,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DESTINATION_ADDRESS } from "../page";
import { motion } from "framer-motion";
import { getProvider } from "@/lib/blockchain/provider";
import { debounce } from "@/lib/utils";
import {
  FormattedReceiptData,
  getTransactionReceiptFromHash,
  formatReceiptData,
} from "@/lib/blockchain/receipt-service";
import TransactionReceipt from "@/components/blockchain/TransactionReceipt";

export default function UsdConverter() {
  const [ethAmount, setEthAmount] = useState("");
  const [usdAmount, setUsdAmount] = useState("");
  const [ethPrice, setEthPrice] = useState(0);
  const [priceChange24h, setPriceChange24h] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [txError, setTxError] = useState("");
  const [priceHistory, setPriceHistory] = useState<
    { time: string; price: number }[]
  >([]);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [isEstimatedPrice, setIsEstimatedPrice] = useState(false);
  const [dataSource, setDataSource] = useState("");
  const [receiptData, setReceiptData] = useState<FormattedReceiptData | null>(
    null
  );

  // Check wallet connection
  const checkWalletConnection = useCallback(async () => {
    if (window.ethereum) {
      try {
        // Get connected accounts
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          setAccount(accounts[0]);

          // Get current chain
          const chainId = await window.ethereum.request({
            method: "eth_chainId",
          });
          setChainId(chainId);
        }
      } catch (error) {
        console.error("Error checking wallet:", error);
      }
    }
  }, []);

  // Fetch ETH price with multiple API sources
  const fetchEthPrice = async () => {
    try {
      const priceData = await fetch("/api/blockchain/eth-price", {
        cache: "no-store", // No caching to get latest price
      });

      if (!priceData.ok) {
        throw new Error(`API error: ${priceData.status}`);
      }

      return await priceData.json();
    } catch (error) {
      console.error("Error fetching ETH price:", error);

      // Try direct API call as backup
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true"
        );
        const data = await response.json();

        return {
          price: data.ethereum.usd,
          change24h: data.ethereum.usd_24h_change || 0,
          timestamp: new Date().toISOString(),
          source: "CoinGecko Direct",
        };
      } catch (backupError) {
        console.error("Backup API also failed:", backupError);

        // Fallback to a default value if API fails
        return {
          price: 3150.42,
          change24h: 0,
          timestamp: new Date().toISOString(),
          isEstimate: true,
          source: "Fallback",
        };
      }
    }
  };

  // Fetch ETH price and update history
  const updateEthPrice = async () => {
    setIsRefreshing(true);
    try {
      const priceData = await fetchEthPrice();

      setEthPrice(priceData.price);
      setPriceChange24h(priceData.change24h || 0);
      setIsEstimatedPrice(!!priceData.isEstimate);

      const now = new Date();
      const newPoint = {
        time: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        price: priceData.price,
      };

      setPriceHistory((prevHistory) => {
        const updatedHistory = [...prevHistory, newPoint];
        return updatedHistory.length > 6
          ? updatedHistory.slice(-6)
          : updatedHistory;
      });

      setLastUpdated(now.toLocaleTimeString());

      // Update the data source info
      setDataSource(priceData.source || "Unknown");

      // Update converted values if they exist
      if (ethAmount)
        handleEthChange({
          target: { value: ethAmount },
        } as React.ChangeEvent<HTMLInputElement>);
      if (usdAmount)
        handleUsdChange({
          target: { value: usdAmount },
        } as React.ChangeEvent<HTMLInputElement>);

      return priceData.price;
    } catch (error) {
      console.error("Failed to fetch ETH price:", error);
      setIsEstimatedPrice(true);
      return null;
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  // Update price on component mount
  useEffect(() => {
    const initializeComponent = async () => {
      await checkWalletConnection();
      await updateEthPrice();
    };

    initializeComponent();

    // Setup listeners for wallet events
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setAccount(accounts.length > 0 ? accounts[0] : null);
      });

      window.ethereum.on("chainChanged", (newChainId: string) => {
        setChainId(newChainId);
      });
    }

    return () => {
      // Cleanup listeners
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      }
    };
  }, [checkWalletConnection]);

  // Start auto-refresh timer for price updates
  useEffect(() => {
    // Initial update
    updateEthPrice();

    // Set up periodic refresh (every minute)
    const timer = setInterval(() => {
      updateEthPrice();
    }, 60000); // 60 seconds

    return () => clearInterval(timer);
  }, []);

  const handleEthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setEthAmount(value);
      const calculatedUsd =
        value === "" ? "" : (parseFloat(value) * ethPrice).toFixed(2);
      setUsdAmount(calculatedUsd);
    }
  };

  const handleUsdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setUsdAmount(value);
      const calculatedEth =
        value === "" ? "" : (parseFloat(value) / ethPrice).toFixed(6);
      setEthAmount(calculatedEth);
    }
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        setAccount(accounts[0]);

        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        setChainId(chainId);
      } else {
        throw new Error(
          "No Ethereum provider detected. Please install MetaMask."
        );
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setTxError(
        error instanceof Error
          ? error.message
          : "Unknown error connecting wallet"
      );
    }
  };

  // Send Transaction with proper error handling and gas estimation
  const sendTransaction = async () => {
    if (!account || !ethAmount || parseFloat(ethAmount) <= 0) {
      setTxError("Please connect your wallet and enter a valid amount");
      return;
    }

    setIsSending(true);
    setTxHash("");
    setTxError("");
    setReceiptData(null);

    try {
      if (!window.ethereum) {
        throw new Error("Ethereum provider not found");
      }

      // Validate destination address
      if (!ethers.utils.isAddress(DESTINATION_ADDRESS)) {
        throw new Error("Invalid destination address");
      }

      // Use a proper provider instance
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Get current gas price
      const gasPrice = await provider.getGasPrice();

      // Check if user has sufficient balance
      const balance = await provider.getBalance(account);
      const amountInWei = ethers.utils.parseEther(ethAmount);
      const estimatedGasCost = gasPrice.mul(21000); // Basic ETH transfer costs 21000 gas

      if (balance.lt(amountInWei.add(estimatedGasCost))) {
        throw new Error("Insufficient balance to cover amount plus gas fees");
      }

      // Create transaction
      const tx = await signer.sendTransaction({
        to: DESTINATION_ADDRESS,
        value: amountInWei,
        gasLimit: 21000,
        gasPrice,
      });

      setTxHash(tx.hash);

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      // If receipt.status is 1, transaction was successful
      if (receipt.status !== 1) {
        throw new Error("Transaction failed");
      }

      // Generate receipt data
      const transactionReceipt = await getTransactionReceiptFromHash(
        tx.hash,
        ethAmount,
        usdAmount
      );
      setReceiptData(formatReceiptData(transactionReceipt));
    } catch (error) {
      console.error("Error sending transaction:", error);
      setTxError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setIsSending(false);
    }
  };

  // Copy address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  };

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Mini price chart component
  const PriceChart = () => {
    if (priceHistory.length < 2) return null;

    const maxPrice = Math.max(...priceHistory.map((p) => p.price));
    const minPrice = Math.min(...priceHistory.map((p) => p.price));
    const range = maxPrice - minPrice;

    // For better visualization, add some padding to the min and max
    const adjustedMax = maxPrice + range * 0.1;
    const adjustedMin = Math.max(0, minPrice - range * 0.1);
    const adjustedRange = adjustedMax - adjustedMin;

    // Create path for the chart
    let pathData = "";
    const width = 100; // percentage
    const height = 40; // pixels
    const widthStep = width / (priceHistory.length - 1);

    priceHistory.forEach((point, i) => {
      // Normalize price between 0 and 1, then scale to height
      const normalizedPrice = (point.price - adjustedMin) / adjustedRange;
      const y = height - normalizedPrice * height;
      const x = i * widthStep;

      if (i === 0) {
        pathData += `M${x},${y} `;
      } else {
        pathData += `L${x},${y} `;
      }
    });

    return (
      <div className="relative h-12 w-full mt-1 mb-3">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="url(#blue-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Area under the line */}
          <path
            d={`${pathData} L${width},${height} L0,${height} Z`}
            fill="url(#area-gradient)"
            opacity="0.2"
          />

          {/* Gradients */}
          <defs>
            <linearGradient
              id="blue-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient
              id="area-gradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Price points */}
        {priceHistory.map((point, i) => {
          const normalizedPrice = (point.price - adjustedMin) / adjustedRange;
          const y = height - normalizedPrice * height;
          const x = i * widthStep;

          return (
            <div
              key={i}
              className="absolute bg-blue-400 w-1 h-1 rounded-full transform -translate-x-0.5 -translate-y-0.5 opacity-70"
              style={{
                left: `${x}%`,
                top: y,
              }}
            />
          );
        })}

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-slate-500">
          <span>{priceHistory[0].time}</span>
          <span>{priceHistory[priceHistory.length - 1].time}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-blue-900/30 border-blue-800/60 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-900/50 via-indigo-900/50 to-blue-900/50 border-b border-blue-800/80">
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-400" />
              ETH/USD Converter
            </CardTitle>
            <CardDescription className="text-slate-400">
              Convert between Ethereum and USD with real-time pricing
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            {isLoading ? (
              <div className="flex justify-center p-6">
                <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 rounded-xl border border-slate-700/60 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-slate-400 text-xs">
                        Current ETH Price
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-white text-2xl font-bold">
                          ${ethPrice.toLocaleString()}
                        </p>
                        <div
                          className={`flex items-center text-xs ${
                            priceChange24h >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          <TrendingUp className="h-3 w-3 mr-0.5" />
                          {priceChange24h.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                      onClick={updateEthPrice}
                      disabled={isRefreshing}
                    >
                      {isRefreshing ? (
                        <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-1.5" />
                      )}
                      Refresh
                    </Button>
                  </div>

                  <PriceChart />

                  <div className="text-xs text-slate-500 flex justify-between">
                    <span>Source: {dataSource || "Unknown"}</span>
                    <span>Last updated: {lastUpdated}</span>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="eth-amount"
                      className="text-slate-300 flex items-center"
                    >
                      <Wallet className="h-4 w-4 mr-1.5 text-blue-500" />
                      ETH Amount
                    </Label>
                    <div className="relative">
                      <Input
                        id="eth-amount"
                        placeholder="0.00"
                        value={ethAmount}
                        onChange={handleEthChange}
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-14"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        ETH
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center my-1">
                    <div className="bg-slate-800 p-1.5 rounded-full border border-slate-700">
                      <ArrowRightLeft className="h-4 w-4 text-blue-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="usd-amount"
                      className="text-slate-300 flex items-center"
                    >
                      <DollarSign className="h-4 w-4 mr-1.5 text-green-500" />
                      USD Amount
                    </Label>
                    <div className="relative">
                      <Input
                        id="usd-amount"
                        placeholder="0.00"
                        value={usdAmount}
                        onChange={handleUsdChange}
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pl-7"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        $
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="border-t border-slate-800 pt-4">
            {!account ? (
              <Button
                onClick={connectWallet}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet to Send
              </Button>
            ) : (
              <Button
                onClick={sendTransaction}
                disabled={!ethAmount || parseFloat(ethAmount) <= 0 || isSending}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                )}
                Send {ethAmount ? `${ethAmount} ETH ($${usdAmount})` : "ETH"}
              </Button>
            )}
          </CardFooter>
        </Card>

        <div className="space-y-6">
          {receiptData ? (
            <TransactionReceipt data={receiptData} />
          ) : (
            <Card className="bg-blue-900/30 border-blue-800/60">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5 text-blue-400" />
                  Transaction Details
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Information about your ETH/USD conversion transactions
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Destination address info */}
                <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-900/30">
                  <h4 className="text-blue-400 font-medium mb-2 flex items-center">
                    <Wallet className="h-4 w-4 mr-1.5" />
                    Destination Address
                  </h4>
                  <div className="bg-slate-900 p-3 rounded border border-slate-700 break-all font-mono text-slate-300 text-xs flex justify-between items-center">
                    <span className="truncate pr-2">{DESTINATION_ADDRESS}</span>
                    <button
                      onClick={() => copyToClipboard(DESTINATION_ADDRESS)}
                      className="text-slate-400 hover:text-white transition-colors ml-2 flex-shrink-0"
                    >
                      {copiedToClipboard ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    All transactions will be sent to the SkillBridge student
                    fund address
                  </p>
                </div>

                {/* Connected wallet */}
                {account && (
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                    <h4 className="text-slate-300 font-medium mb-2 flex items-center">
                      <Wallet className="h-4 w-4 mr-1.5 text-indigo-400" />
                      Connected Wallet
                    </h4>
                    <div className="font-mono text-sm text-white">
                      {formatAddress(account)}
                    </div>
                  </div>
                )}

                {txHash ? (
                  <div className="bg-green-900/20 rounded-lg p-4 border border-green-800/50">
                    <h4 className="text-green-400 font-medium flex items-center mb-2">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Transaction Submitted
                    </h4>
                    <p className="text-slate-300 text-sm mb-2">
                      Your transaction has been submitted to the blockchain
                    </p>
                    <div className="bg-slate-900 p-2 rounded border border-slate-700 break-all font-mono text-xs text-slate-300">
                      {txHash}
                    </div>
                    <div className="mt-3 flex justify-end">
                      <a
                        href={`https://sepolia.etherscan.io/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-400 hover:text-blue-300 text-sm"
                      >
                        View on Etherscan
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="h-[230px] flex flex-col items-center justify-center text-center">
                    <div className="h-16 w-16 mb-4 rounded-full bg-slate-800/80 flex items-center justify-center">
                      <ArrowUpRight className="h-8 w-8 text-slate-600" />
                    </div>
                    <h4 className="text-slate-300 font-medium">
                      No Recent Transactions
                    </h4>
                    <p className="text-slate-500 text-sm mt-1 max-w-xs">
                      When you send ETH to support students, your transaction
                      details will appear here
                    </p>

                    {account ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 border-slate-700 text-blue-400 hover:bg-slate-800"
                        onClick={() => {
                          const ethInput = document.getElementById(
                            "eth-amount"
                          ) as HTMLInputElement;
                          if (ethInput) ethInput.focus();
                        }}
                      >
                        <ArrowUpRight className="h-3.5 w-3.5 mr-1.5" />
                        Make a Transaction
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 border-slate-700 text-blue-400 hover:bg-slate-800"
                        onClick={connectWallet}
                      >
                        <Wallet className="h-3.5 w-3.5 mr-1.5" />
                        Connect Wallet
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Conversion rates info card */}
          <Card className="bg-blue-900/30 border-blue-800/60">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm font-medium text-slate-300">
                Conversion Information
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-2 text-slate-400 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span>1 ETH</span>
                <span className="text-white">${ethPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Gas Fee (estimate)</span>
                <span className="text-white">$2.50</span>
              </div>
              <div className="flex justify-between">
                <span>Network</span>
                <span className="text-white">Ethereum (Sepolia Testnet)</span>
              </div>
              <div className="border-t border-slate-800 mt-2 pt-2 flex justify-between">
                <span>Exchange Rate Provider</span>
                <a
                  href="https://coingecko.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 flex items-center hover:underline"
                >
                  CoinGecko
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
