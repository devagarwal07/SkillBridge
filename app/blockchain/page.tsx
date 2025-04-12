"use client";

// Current time and user info as requested
const CURRENT_TIME = "2025-04-05 22:30:16";
const CURRENT_USER = "vkhare2909";

// Hardcoded destination address for blockchain transactions
export const DESTINATION_ADDRESS = "0x39DA975981777D1125a4044b1a48d4a558958F0f";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Wallet, Clock, FileText, Shield, DollarSign } from "lucide-react";
import Layout from "@/app/components/layout/Layout";
import BlockchainTransactions from "./components/BlockchainTransactions";
import ProposalList from "./components/ProposalList";
import ZkpVerification from "./components/ZkpVerification";
import UsdConverter from "./components/UsdConverter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BlockchainPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("transactions");
  const proposalParam = searchParams?.get("proposal");

  useEffect(() => {
    // If proposal parameter is present, switch to proposals tab
    if (proposalParam) {
      setActiveTab("proposals");
    }
  }, [proposalParam]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a101e] to-slate-950 text-white">
        {/* User information display */}
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50 flex items-center gap-3 shadow-xl">
          <Clock className="h-4 w-4 text-slate-400" />
          <span className="text-slate-300 text-sm font-medium">
            {CURRENT_TIME}
          </span>
          <div className="h-4 w-px bg-slate-700/50"></div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white font-bold">
              {CURRENT_USER.charAt(0).toUpperCase()}
            </div>
            <span className="text-slate-300 text-sm font-medium">
              {CURRENT_USER}
            </span>
          </div>
        </div>

        {/* Background elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-[5%] w-[90%] h-[20%] rounded-full bg-blue-900/20 blur-[120px]"></div>
          <div className="absolute bottom-0 right-[10%] w-[80%] h-[15%] rounded-full bg-indigo-900/20 blur-[100px]"></div>
          <div className="absolute top-[20%] right-[30%] w-[40%] h-[30%] rounded-full bg-purple-900/10 blur-[120px] opacity-70"></div>

          {/* Subtle grid overlay */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02]"></div>

          {/* Noise texture */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]"></div>
        </div>

        <div className="container mx-auto py-8 px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 mb-2">
              Blockchain Ecosystem
            </h1>
            <p className="text-slate-400">
              Access proposals, send transactions, verify identity with
              zero-knowledge proofs, and convert between ETH and USD
            </p>
          </motion.div>

          {/* Blockchain Components */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 mb-6 bg-slate-900/50 border border-slate-800">
                <TabsTrigger
                  value="transactions"
                  className="data-[state=active]:bg-blue-900/30"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Transactions
                </TabsTrigger>
                <TabsTrigger
                  value="proposals"
                  className="data-[state=active]:bg-blue-900/30"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Proposals
                </TabsTrigger>
                <TabsTrigger
                  value="zkp"
                  className="data-[state=active]:bg-blue-900/30"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  ID Verification
                </TabsTrigger>
                <TabsTrigger
                  value="usd"
                  className="data-[state=active]:bg-blue-900/30"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  USD Converter
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transactions">
                <BlockchainTransactions
                  destinationAddress={DESTINATION_ADDRESS}
                />
              </TabsContent>

              <TabsContent value="proposals">
                <ProposalList
                  selectedProposalId={
                    proposalParam ? parseInt(proposalParam, 10) : undefined
                  }
                />
              </TabsContent>

              <TabsContent value="zkp">
                <ZkpVerification />
              </TabsContent>

              <TabsContent value="usd">
                <UsdConverter />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
