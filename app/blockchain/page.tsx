"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Wallet, Clock } from "lucide-react";
import Layout from "@/app/components/layout/Layout";
import BlockchainTransactions from "./components/BlockchainTransactions";

// Current time and user info as requested
const CURRENT_TIME = "2025-04-05 22:30:16";
const CURRENT_USER = "vkhare2909";

export default function BlockchainPage() {
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
              Blockchain Transactions
            </h1>
            <p className="text-slate-400">
              Connect to MetaMask and use testnet ETH to practice sending and
              receiving transactions
            </p>
          </motion.div>

          {/* Blockchain Transaction Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <BlockchainTransactions />
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
