"use client";

import { useState, useEffect } from "react";
import {
  FilePlus,
  ChevronRight,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DESTINATION_ADDRESS } from "../page";
import { ethers } from "ethers";

type ProposalStatus = "active" | "completed" | "rejected";

// Sample proposals data (in a real app, this would come from a smart contract)
const PROPOSALS: {
  id: number;
  title: string;
  description: string;
  amount: number;
  status: ProposalStatus;
  votes: { yes: number; no: number };
  deadline: string;
}[] = [
  {
    id: 1,
    title: "Community Education Fund",
    description:
      "Allocate 5 ETH for developing educational content for blockchain skills",
    amount: 5,
    status: "active",
    votes: { yes: 24, no: 7 },
    deadline: "2025-05-15",
  },
  {
    id: 2,
    title: "Developer Grants Program",
    description:
      "Fund promising developers to build tools for the SkillBridge ecosystem",
    amount: 10,
    status: "active",
    votes: { yes: 31, no: 12 },
    deadline: "2025-05-20",
  },
  {
    id: 3,
    title: "UX Improvements",
    description: "Hire a UX consultant to improve the platform user experience",
    amount: 3,
    status: "completed",
    votes: { yes: 42, no: 5 },
    deadline: "2025-04-01",
  },
  {
    id: 4,
    title: "Marketing Campaign",
    description:
      "Launch a targeted marketing campaign to attract more users to the platform",
    amount: 7,
    status: "rejected",
    votes: { yes: 15, no: 28 },
    deadline: "2025-03-20",
  },
];

interface ProposalListProps {
  selectedProposalId?: number;
}

export default function ProposalList({
  selectedProposalId,
}: ProposalListProps) {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [isFunding, setIsFunding] = useState(false);
  const [hasVoted, setHasVoted] = useState<Record<number, string>>({});
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    // Check if MetaMask is available
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            getBalance(accounts[0]);
          }
        })
        .catch((error) =>
          console.error("Error connecting to MetaMask:", error)
        );
    }
  }, []);

  useEffect(() => {
    if (selectedProposalId) {
      const proposal = PROPOSALS.find((p) => p.id === selectedProposalId);
      if (proposal) {
        setSelectedProposal(proposal);
        setIsOpen(true);
      }
    }
  }, [selectedProposalId]);

  interface EthereumRequest {
    method: string;
    params: [string, string];
  }

  const getBalance = async (address: string): Promise<void> => {
    try {
      if (!window.ethereum) throw new Error("Ethereum object not found");
      const balance: string = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      } as EthereumRequest);
      setBalance(ethers.utils.formatEther(balance));
    } catch (error: unknown) {
      console.error("Error getting balance:", error);
    }
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        getBalance(accounts[0]);
      } else {
        alert("Please install MetaMask to use this feature");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  interface Votes {
    yes: number;
    no: number;
  }

  interface Proposal {
    id: number;
    title: string;
    description: string;
    amount: number;
    status: "active" | "completed" | "rejected";
    votes: Votes;
    deadline: string;
  }

  const openProposalDetails = (proposal: Proposal): void => {
    setSelectedProposal(proposal);
    setIsOpen(true);
  };

  type ProposalStatus = "active" | "completed" | "rejected";

  const getStatusColor = (status: ProposalStatus): string => {
    switch (status) {
      case "active":
        return "bg-blue-500/20 text-blue-400";
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "rejected":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-slate-500/20 text-slate-400";
    }
  };

  interface VoteState {
    [key: number]: string;
  }

  type VoteType = "yes" | "no";

  const handleVote = async (voteType: VoteType): Promise<void> => {
    if (!account) {
      alert("Please connect your wallet first");
      return;
    }

    if (!selectedProposal) {
      return;
    }

    setIsVoting(true);

    // Simulate blockchain interaction with a delay
    setTimeout(() => {
      // In a real app, this would be a transaction to a voting smart contract
      setHasVoted({ ...hasVoted, [selectedProposal.id]: voteType });
      setIsVoting(false);

      // Close the dialog after voting
      setTimeout(() => setIsOpen(false), 1500);
    }, 2000);
  };

  const fundProposal = async () => {
    if (!account) {
      alert("Please connect your wallet first");
      return;
    }

    if (!selectedProposal) {
      alert("No proposal selected");
      return;
    }

    if (selectedProposal.status !== "completed") {
      alert("You can only fund approved proposals");
      return;
    }

    setIsFunding(true);

    try {
      if (!window.ethereum) throw new Error("Ethereum object not found");

      // Prepare transaction parameters
      const transactionParameters = {
        to: DESTINATION_ADDRESS,
        from: account,
        value: ethers.utils.parseEther(selectedProposal.amount.toString())._hex,
        gas: "0x5208", // 21000 gas
      };

      // Send the transaction
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      alert(`Transaction submitted: ${txHash}`);
      getBalance(account);
    } catch (error) {
      console.error("Error funding proposal:", error);
      alert(
        `Error: ${
          error instanceof Error ? error.message : "Unknown error occurred"
        }`
      );
    } finally {
      setIsFunding(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {selectedProposalId && (
        <div className="mb-6 p-4 bg-blue-900/20 rounded-xl border border-blue-500/30 text-slate-300 text-sm flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-400 mb-1">
              Student Proposal Connection
            </p>
            <p className="mb-2">
              You are viewing this proposal because it's connected to a student
              funding request. When this proposal is funded, the money will go
              to support the student's education.
            </p>
            <p className="text-xs text-blue-300">
              Destination Address: {DESTINATION_ADDRESS}
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Governance Proposals</h2>
        {!account && (
          <Button
            onClick={connectWallet}
            variant="outline"
            className="bg-blue-900/20 text-blue-400 border-blue-800 hover:bg-blue-900/30"
          >
            Connect Wallet to Vote
          </Button>
        )}
        {account && (
          <div className="text-slate-400 text-sm">
            <span className="text-slate-300">Connected:</span>{" "}
            {`${account.substring(0, 6)}...${account.substring(
              account.length - 4
            )}`}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {PROPOSALS.map((proposal) => (
          <Card
            key={proposal.id}
            className={`bg-slate-900/70 border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-colors ${
              selectedProposalId === proposal.id
                ? "ring-2 ring-blue-500/50"
                : ""
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-white">{proposal.title}</CardTitle>
                <Badge
                  className={`${getStatusColor(proposal.status)} capitalize`}
                >
                  {proposal.status}
                </Badge>
              </div>
              <CardDescription className="text-slate-400">
                Proposal #{proposal.id}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-slate-300 mb-2 line-clamp-2">
                {proposal.description}
              </p>
              <div className="flex justify-between text-sm text-slate-400">
                <div>
                  Amount:{" "}
                  <span className="text-white">{proposal.amount} ETH</span>
                </div>
                <div>Deadline: {proposal.deadline}</div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-800 pt-3 flex justify-between">
              <div className="text-sm">
                <span className="text-green-400">{proposal.votes.yes} Yes</span>
                {" / "}
                <span className="text-red-400">{proposal.votes.no} No</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                onClick={() => openProposalDetails(proposal)}
              >
                Details <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Proposal Details Dialog */}
      {selectedProposal && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle className="text-xl font-bold">
                  Proposal #{selectedProposal.id}
                </DialogTitle>
                <Badge
                  className={`${getStatusColor(
                    selectedProposal.status
                  )} capitalize`}
                >
                  {selectedProposal.status}
                </Badge>
              </div>
              <DialogDescription className="text-slate-400">
                Created by SkillBridge Governance
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                {selectedProposal.title}
              </h3>
              <p className="text-slate-300">{selectedProposal.description}</p>

              <div className="grid grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <div>
                  <p className="text-slate-400 text-sm">Requested Amount</p>
                  <p className="text-white text-lg font-medium">
                    {selectedProposal.amount} ETH
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Deadline</p>
                  <p className="text-white">{selectedProposal.deadline}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Yes Votes</p>
                  <p className="text-green-400 font-medium">
                    {selectedProposal.votes.yes}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">No Votes</p>
                  <p className="text-red-400 font-medium">
                    {selectedProposal.votes.no}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-3">
              {selectedProposal.status === "active" &&
                !hasVoted[selectedProposal.id] && (
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Button
                      disabled={isVoting || !account}
                      variant="outline"
                      className="flex-1 sm:flex-none bg-green-900/20 hover:bg-green-900/40 text-green-400 border-green-800"
                      onClick={() => handleVote("yes")}
                    >
                      {isVoting ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Vote YES
                    </Button>
                    <Button
                      disabled={isVoting || !account}
                      variant="outline"
                      className="flex-1 sm:flex-none bg-red-900/20 hover:bg-red-900/40 text-red-400 border-red-800"
                      onClick={() => handleVote("no")}
                    >
                      {isVoting ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Vote NO
                    </Button>
                  </div>
                )}

              {hasVoted[selectedProposal.id] && (
                <div className="text-green-400 bg-green-900/20 px-4 py-2 rounded-md border border-green-800 w-full text-center">
                  You voted {hasVoted[selectedProposal.id].toUpperCase()} on
                  this proposal
                </div>
              )}

              {selectedProposal.status === "completed" && (
                <Button
                  disabled={isFunding || !account}
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                  onClick={fundProposal}
                >
                  {isFunding ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FilePlus className="h-4 w-4 mr-2" />
                  )}
                  Fund This Proposal ({selectedProposal.amount} ETH)
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
