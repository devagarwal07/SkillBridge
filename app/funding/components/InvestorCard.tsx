import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  ChevronDown,
  LineChart,
  Check,
  X,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SparkleButton from "@/components/ui/SparkleButton";
import { formatCurrency } from "@/lib/utils";

type InvestorCardProps = {
  investor: any;
  isExpanded: boolean;
  onToggleExpand: () => void;
  userData: any;
  delay?: number;
};

export default function InvestorCard({
  investor,
  isExpanded,
  onToggleExpand,
  userData,
  delay = 0,
}: InvestorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-indigo-500/40 transition-all"
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/20">
              <Image
                src={investor.logo}
                alt={investor.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                {investor.name}
              </h3>
              <p className="text-gray-400">{investor.type}</p>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 md:mt-0">
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Total Invested</span>
              <span className="font-semibold text-white">
                ${formatCurrency(investor.totalInvested)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Average ROI</span>
              <span className="font-semibold text-white">
                {investor.averageROI}%
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Success Rate</span>
              <span className="font-semibold text-white">
                {investor.successRate}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Link href={`/funding/investor/${investor.id}`}>
              <span className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-300 font-medium hover:bg-indigo-500/30 transition-colors">
                View Details
              </span>
            </Link>
            <button
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                isExpanded
                  ? "bg-indigo-500/20 text-indigo-300"
                  : "bg-white/5 text-gray-300"
              } hover:bg-indigo-500/30 hover:text-indigo-300 transition-colors`}
              onClick={onToggleExpand}
              aria-expanded={isExpanded}
            >
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-white">About</h4>
                    <p className="text-sm text-gray-300 mb-4">
                      {investor.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-indigo-400" />
                        <span className="text-gray-400">Investment Range:</span>
                        <span className="text-white">
                          ${formatCurrency(investor.investmentRange.min)} - $
                          {formatCurrency(investor.investmentRange.max)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 text-white">Focus Areas</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {investor.focusAreas.map(
                        (area: string, index: number) => (
                          <Badge
                            key={index}
                            className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-none"
                          >
                            {area}
                          </Badge>
                        )
                      )}
                    </div>

                    <h4 className="font-medium mb-3 text-white">
                      Requirements
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <LineChart className="h-4 w-4 text-indigo-400" />
                        <span className="text-gray-400">Min Credit Score:</span>
                        <span className="font-medium text-white">
                          {investor.requirements.minimumEducationCreditScore}
                        </span>
                        {userData.educationCreditScore >=
                        investor.requirements.minimumEducationCreditScore ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <X className="h-4 w-4 text-red-400" />
                        )}
                      </div>

                      <div className="text-sm">
                        <span className="text-gray-400">Preferred Fields:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {investor.requirements.preferredFields.map(
                            (field: string, index: number) => (
                              <Badge
                                key={index}
                                className="bg-white/5 text-gray-300 hover:bg-purple-500/10 hover:text-purple-300 border border-white/10 hover:border-purple-500/30 transition-colors"
                              >
                                {field}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 text-white">
                      Funding Models
                    </h4>
                    <div className="space-y-3">
                      {investor.fundingModels.map(
                        (model: any, index: number) => (
                          <div
                            key={index}
                            className="bg-white/5 border border-white/10 p-3 rounded-lg"
                          >
                            <div className="font-medium text-white">
                              {model.type}
                            </div>
                            <div className="text-sm mt-1">
                              {model.type === "Income Share Agreement" && (
                                <div className="space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">
                                      Percentage Range:
                                    </span>
                                    <span className="text-gray-300">
                                      {model.details.percentageRange[0]}% -{" "}
                                      {model.details.percentageRange[1]}%
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">
                                      Term Range:
                                    </span>
                                    <span className="text-gray-300">
                                      {model.details.termRange[0]} -{" "}
                                      {model.details.termRange[1]} months
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">
                                      Cap Multiplier:
                                    </span>
                                    <span className="text-gray-300">
                                      {model.details.capMultiplier}x
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Render other model types... */}
                              {model.type === "Milestone-Based" && (
                                <div className="space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">
                                      Milestone Types:
                                    </span>
                                    <span className="text-gray-300">
                                      {model.details.milestoneTypes.join(", ")}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">
                                      Bonus Available:
                                    </span>
                                    <span className="text-gray-300">
                                      {model.details.bonusAvailable
                                        ? "Yes"
                                        : "No"}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {model.type === "Low-Interest Loan" && (
                                <div className="space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">
                                      Interest Range:
                                    </span>
                                    <span className="text-gray-300">
                                      {model.details.interestRange[0]}% -{" "}
                                      {model.details.interestRange[1]}%
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">
                                      Term Range:
                                    </span>
                                    <span className="text-gray-300">
                                      {model.details.termRange[0]} -{" "}
                                      {model.details.termRange[1]} months
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <SparkleButton
                    href={`/funding/apply/${investor.id}`}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
                  >
                    Apply for Funding
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </SparkleButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
