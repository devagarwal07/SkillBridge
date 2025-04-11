"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  CheckCircle,
  RefreshCw,
  Info,
  ExternalLink,
  AlertCircle,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

// Use the updated time information
const CURRENT_TIME = "2025-04-05 22:38:16";
const CURRENT_USER = "vkhare2909";

// Available testnets
const TESTNETS = [
  { id: "sepolia", name: "Sepolia", chainId: 11155111 },
  { id: "goerli", name: "Goerli", chainId: 5 },
];

// TypeScript declarations for window.ethereum
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

export default function BlockchainTransactions() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [network, setNetwork] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txSuccess, setTxSuccess] = useState<boolean | null>(null);
  const [showTxForm, setShowTxForm] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [networkSwitchInProgress, setNetworkSwitchInProgress] = useState(false);
  const [selectedTestnet, setSelectedTestnet] = useState(TESTNETS[0]);

  // Check if MetaMask is installed
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!window.ethereum) {
        setError(
          "MetaMask is not installed. Please install MetaMask to use this feature."
        );
      }
    }
  }, []);

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          getBalance(accounts[0]);
        } else {
          setAccount(null);
          setBalance("0");
        }
      });

      window.ethereum.on("chainChanged", (chainId: string) => {
        // Reload page on chain change
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      }
    };
  }, []);

  // Connect to MetaMask
  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        // Get network information
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        const networkName = getNetworkName(chainId);

        setAccount(accounts[0]);
        setNetwork(networkName);

        // Get account balance
        await getBalance(accounts[0]);

        // Get transaction history (simulated for testnet)
        getTransactionHistory(accounts[0]);
      } else {
        setError(
          "MetaMask is not installed. Please install MetaMask to use this feature."
        );
      }
    } catch (err: any) {
      console.error("Error connecting to MetaMask:", err);
      setError(err.message || "Failed to connect to MetaMask");
    } finally {
      setIsConnecting(false);
    }
  };

  // Get account balance
  const getBalance = async (address: string) => {
    try {
      if (window.ethereum) {
        // Use ethers v5 syntax
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(address);
        setBalance(ethers.utils.formatEther(balance));
      }
    } catch (err) {
      console.error("Error getting balance:", err);
    }
  };

  // Get network name from chain ID
  const getNetworkName = (chainId: string): string => {
    const networks: { [key: string]: string } = {
      "0x1": "Ethereum Mainnet",
      "0x5": "Goerli Testnet",
      "0xaa36a7": "Sepolia Testnet",
      "0x13881": "Mumbai Testnet",
    };

    return networks[chainId] || `Chain ID: ${chainId}`;
  };

  // Switch to selected testnet
  const switchNetwork = async (testnet: any) => {
    try {
      setNetworkSwitchInProgress(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${testnet.chainId.toString(16)}` }],
      });

      setSelectedTestnet(testnet);
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          if (!window.ethereum) {
            throw new Error("MetaMask is not installed");
          }

          // Add the network
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${testnet.chainId.toString(16)}`,
                chainName: `${testnet.name} Testnet`,
                nativeCurrency: {
                  name: "Ethereum",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: [`https://${testnet.id}.infura.io/v3/`],
                blockExplorerUrls: [`https://${testnet.id}.etherscan.io`],
              },
            ],
          });

          setSelectedTestnet(testnet);
        } catch (addError) {
          console.error("Error adding network:", addError);
          setError("Failed to add the network to MetaMask");
        }
      } else {
        console.error("Error switching network:", switchError);
        setError("Failed to switch network");
      }
    } finally {
      setNetworkSwitchInProgress(false);
    }
  };

  // Mock transaction history for testnet demo
  const getTransactionHistory = (address: string) => {
    // In a real app, you would fetch transaction history from an API
    // For this demo, we'll use mock data
    const mockTransactions = [
      {
        id: "0x8a29fffecf4677be9d2e9bbf39f2455f9ddfc8ca9834e90f138d247aa8fbe4d5",
        type: "received",
        amount: "0.1",
        from: "0x3Fc91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
        to: address,
        timestamp: Date.now() - 86400000, // 1 day ago
        status: "confirmed",
      },
      {
        id: "0x9b7bb87892add23f5e67f032adadff704446f7f4698e118e72693dcb6f5beb9a",
        type: "sent",
        amount: "0.05",
        from: address,
        to: "0x7179A57704C91C94016B8f6EDdDa9c57F29A9C38",
        timestamp: Date.now() - 172800000, // 2 days ago
        status: "confirmed",
      },
      {
        id: "0x47a2e67822f99dfe1c1a17da11ddb69748f4ee6b0e6526d524a47b4fa5a9d7a5",
        type: "received",
        amount: "0.2",
        from: "0x4b83088e43026CdB99A5f0eAD3f3a3fd84A9416A",
        to: address,
        timestamp: Date.now() - 259200000, // 3 days ago
        status: "confirmed",
      },
    ];

    setTransactions(mockTransactions);
  };

  // Send a transaction
  const sendTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientAddress || !amount) {
      setError("Please enter recipient address and amount");
      return;
    }

    setIsSending(true);
    setTxHash(null);
    setTxSuccess(null);
    setError(null);

    try {
      if (window.ethereum) {
        // Use ethers v5 syntax
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Convert amount to wei using ethers v5 syntax
        const amountWei = ethers.utils.parseEther(amount);

        // Create transaction
        const tx = {
          to: recipientAddress,
          value: amountWei,
        };

        // Send transaction
        const transaction = await signer.sendTransaction(tx);
        setTxHash(transaction.hash);

        // Wait for transaction to be mined
        const receipt = await transaction.wait();
        // Use a truthy check instead of comparing to BigInt
        setTxSuccess(!!receipt?.status);

        // Update balance
        if (account) {
          await getBalance(account);
        }

        // Add transaction to history
        const newTx = {
          id: transaction.hash,
          type: "sent",
          amount,
          from: account,
          to: recipientAddress,
          timestamp: Date.now(),
          status: receipt?.status ? "confirmed" : "failed",
        };

        setTransactions([newTx, ...transactions]);

        // Reset form
        setRecipientAddress("");
        setAmount("");
        setShowTxForm(false);
      }
    } catch (err: any) {
      console.error("Error sending transaction:", err);
      setError(err.message || "Failed to send transaction");
      setTxSuccess(false);
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

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-xl border border-slate-800/60 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-900/30 text-blue-400 border border-blue-500/20">
              <Wallet className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Blockchain Transactions
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">{CURRENT_TIME}</span>
            <div className="h-4 w-px bg-slate-700"></div>
            <span className="text-sm text-slate-400">{CURRENT_USER}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* MetaMask Connection Status */}
        {!account ? (
          <div className="text-center py-10">
            <Image
              src="/metamask-fox.svg"
              alt="MetaMask"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-white mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Connect your MetaMask wallet to access the blockchain transaction
              features. You'll need to use a testnet since you have 0 ETH in
              your wallet.
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-start gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            <Button
              onClick={connectWallet}
              disabled={isConnecting || !!error}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-900/20 border border-indigo-500/20"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect to MetaMask
                </>
              )}
            </Button>
          </div>
        ) : (
          <>
            {/* Wallet Connected Info */}
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-5 mb-6">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-300">
                      Connected to {network}
                    </span>
                  </div>
                  <div className="flex items-center mt-2 gap-2">
                    <span className="text-slate-400 text-sm">Address:</span>
                    <span className="text-white font-mono text-sm">
                      {formatAddress(account)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(account)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {copiedToClipboard ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-slate-400 text-sm">Balance:</span>
                  <span className="text-2xl font-bold text-white">
                    {parseFloat(balance).toFixed(4)} ETH
                  </span>
                  <span className="text-slate-400 text-xs">
                    on {selectedTestnet.name} Testnet
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-white"
                  onClick={() => {
                    if (account) getBalance(account);
                  }}
                >
                  <RefreshCw className="mr-2 h-3.5 w-3.5" />
                  Refresh
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-white"
                  onClick={() => setShowTxForm(!showTxForm)}
                >
                  <ArrowUpRight className="mr-2 h-3.5 w-3.5" />
                  Send ETH
                </Button>

                <div className="flex-1"></div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Network:</span>
                  <div className="relative">
                    <select
                      value={selectedTestnet.id}
                      onChange={(e) => {
                        const testnet = TESTNETS.find(
                          (t) => t.id === e.target.value
                        );
                        if (testnet) switchNetwork(testnet);
                      }}
                      disabled={networkSwitchInProgress}
                      className="bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-1 text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    >
                      {TESTNETS.map((testnet) => (
                        <option key={testnet.id} value={testnet.id}>
                          {testnet.name} Testnet
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Get Testnet ETH Notice */}
            <div className="mb-6 p-4 bg-blue-900/20 rounded-xl border border-blue-500/30 text-slate-300 text-sm flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-400 mb-1">
                  Need Testnet ETH?
                </p>
                <p className="mb-2">
                  This is a testnet environment. You'll need testnet ETH to
                  interact with the blockchain. You can get free testnet ETH
                  from the following faucets:
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="https://sepoliafaucet.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 gap-1"
                  >
                    Sepolia Faucet <ExternalLink className="h-3 w-3" />
                  </a>
                  <span className="text-slate-500">•</span>
                  <a
                    href="https://goerlifaucet.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 gap-1"
                  >
                    Goerli Faucet <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Send Transaction Form */}
            <AnimatePresence>
              {showTxForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-5 mb-6">
                    <h3 className="text-lg font-medium text-white mb-4">
                      Send Transaction
                    </h3>

                    {error && (
                      <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}

                    {txHash && (
                      <div className="mb-4 p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg text-blue-400 text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">Transaction Hash:</span>
                          <a
                            href={`https://${selectedTestnet.id}.etherscan.io/tx/${txHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                          >
                            View on Etherscan{" "}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <div className="font-mono break-all">{txHash}</div>

                        {txSuccess !== null && (
                          <div
                            className={`mt-2 flex items-center gap-2 ${
                              txSuccess ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {txSuccess ? (
                              <>
                                <CheckCircle className="h-4 w-4" />
                                <span>Transaction successful</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-4 w-4" />
                                <span>Transaction failed</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <form onSubmit={sendTransaction}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-slate-300">
                            Recipient Address
                          </label>
                          <Input
                            type="text"
                            placeholder="0x..."
                            value={recipientAddress}
                            onChange={(e) =>
                              setRecipientAddress(e.target.value)
                            }
                            className="bg-slate-800/70 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            disabled={isSending}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-slate-300">
                            Amount (ETH)
                          </label>
                          <Input
                            type="number"
                            placeholder="0.01"
                            step="0.000001"
                            min="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-slate-800/70 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            disabled={isSending}
                          />
                          <p className="mt-1 text-xs text-slate-400">
                            Available: {parseFloat(balance).toFixed(6)} ETH
                          </p>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowTxForm(false)}
                            disabled={isSending}
                            className="border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-white"
                          >
                            Cancel
                          </Button>

                          <Button
                            type="submit"
                            disabled={isSending || !recipientAddress || !amount}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
                          >
                            {isSending ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <ArrowUpRight className="mr-2 h-4 w-4" />
                                Send ETH
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Transaction History */}
            <div>
              <h3 className="flex items-center text-lg font-medium text-white mb-4">
                Transaction History
                <span className="ml-2 px-2 py-0.5 text-xs bg-slate-800 text-slate-400 rounded-full">
                  {transactions.length}
                </span>
              </h3>

              {transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="bg-slate-800/50 border border-slate-700/60 rounded-lg p-4 hover:bg-slate-800/70 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {tx.type === "received" ? (
                            <div className="p-1.5 rounded-lg bg-green-900/30 text-green-400">
                              <ArrowDownLeft className="h-4 w-4" />
                            </div>
                          ) : (
                            <div className="p-1.5 rounded-lg bg-blue-900/30 text-blue-400">
                              <ArrowUpRight className="h-4 w-4" />
                            </div>
                          )}
                          <span className="font-medium text-white">
                            {tx.type === "received" ? "Received" : "Sent"} ETH
                          </span>
                        </div>
                        <span className="text-sm flex items-center text-slate-400 gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatTimestamp(tx.timestamp)}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-400">
                            {tx.type === "received" ? "From" : "To"}:
                          </span>
                          <span className="font-mono text-sm text-white">
                            {formatAddress(
                              tx.type === "received" ? tx.from : tx.to
                            )}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-white">
                            {tx.amount}
                          </span>
                          <span className="text-slate-400">ETH</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <a
                          href={`https://${selectedTestnet.id}.etherscan.io/tx/${tx.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                        >
                          View on Etherscan <ExternalLink className="h-3 w-3" />
                        </a>

                        <div className="flex items-center gap-1.5">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              tx.status === "confirmed"
                                ? "bg-green-500"
                                : "bg-amber-500"
                            }`}
                          ></div>
                          <span className="text-xs capitalize text-slate-400">
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-8 text-center">
                  <div className="h-16 w-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArrowUpRight className="h-8 w-8 text-slate-500" />
                  </div>
                  <h4 className="text-lg font-medium text-white mb-2">
                    No Transactions Yet
                  </h4>
                  <p className="text-slate-400 max-w-md mx-auto mb-6">
                    Your transaction history will appear here once you start
                    sending or receiving ETH on the {selectedTestnet.name}{" "}
                    testnet.
                  </p>
                  <Button
                    onClick={() => setShowTxForm(true)}
                    className="bg-slate-700 hover:bg-slate-600 text-white"
                  >
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Send Your First Transaction
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Custom ChevronDown icon to match the design
function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
