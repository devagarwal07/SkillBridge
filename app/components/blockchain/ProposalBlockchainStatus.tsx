"use client";

import { useState, useEffect } from "react";
import {
  Wallet,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DESTINATION_ADDRESS } from "@/app/blockchain/page";
import Link from "next/link";

interface ProposalBlockchainStatusProps {
  studentId: string;
  alreadyConnected?: boolean;
}

export default function ProposalBlockchainStatus({
  studentId,
  alreadyConnected = false,
}: ProposalBlockchainStatusProps) {
  const [blockchainDetails, setBlockchainDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingBlockchain, setViewingBlockchain] = useState(false);

  useEffect(() => {
    const fetchBlockchainDetails = async () => {
      try {
        if (alreadyConnected) {
          const response = await fetch(
            `/api/blockchain/student-proposal?studentId=${studentId}`
          );
          if (response.ok) {
            const data = await response.json();
            setBlockchainDetails(data);
          } else {
            // Handle 404 or other errors
            setError("No blockchain connection found for this student");
          }
        } else {
          setBlockchainDetails(null);
        }
      } catch (err) {
        setError("Error loading blockchain details");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlockchainDetails();
  }, [studentId, alreadyConnected]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
        <span className="ml-2 text-slate-400">Loading blockchain data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg flex items-start gap-2">
        <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5" />
        <div>
          <p className="text-slate-300">{error}</p>
          <p className="text-slate-400 text-sm mt-1">
            This student's funding request has not yet been connected to the
            blockchain.
          </p>
        </div>
      </div>
    );
  }

  if (!blockchainDetails && !alreadyConnected) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="h-5 w-5 text-slate-400" />
          <p className="text-slate-300 font-medium">Not Connected</p>
        </div>
        <p className="text-slate-400 text-sm mb-3">
          This proposal is not yet connected to the blockchain.
        </p>
        <Button
          size="sm"
          className="bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 text-blue-400"
        >
          Connect to Blockchain
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-blue-900/10 border border-blue-800/30 p-3 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle className="h-5 w-5 text-blue-400" />
        <p className="text-blue-300 font-medium">Blockchain Connected</p>
      </div>

      <div className="bg-slate-800/60 rounded-md p-2 mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-slate-400 text-sm">Proposal ID:</span>
          <span className="text-white font-mono text-sm">
            {blockchainDetails?.blockchainId || "#1"}
          </span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-slate-400 text-sm">Title:</span>
          <span className="text-white text-sm">
            {blockchainDetails?.title || "Community Education Fund"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400 text-sm">Amount:</span>
          <span className="text-white text-sm">
            {blockchainDetails?.ethAmount || "5"} ETH
          </span>
        </div>
      </div>

      <div className="flex justify-between">
        <Badge
          variant="outline"
          className="bg-blue-900/20 text-blue-400 border-blue-800/40"
        >
          {viewingBlockchain ? "Exit Blockchain" : "View on Blockchain"}
        </Badge>

        <Link
          href={`/blockchain?proposal=${
            blockchainDetails?.blockchainId || "1"
          }`}
          className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
        >
          Details
          <ExternalLink className="h-3.5 w-3.5 ml-1" />
        </Link>
      </div>

      {viewingBlockchain && (
        <div className="mt-4 bg-slate-800/50 p-2 rounded text-xs font-mono text-slate-300 break-all">
          Contract: {DESTINATION_ADDRESS}
        </div>
      )}
    </div>
  );
}
