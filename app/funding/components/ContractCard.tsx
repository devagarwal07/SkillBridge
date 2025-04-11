import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Clock, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type ContractCardProps = {
  contract: any;
  delay?: number;
};

export default function ContractCard({
  contract,
  delay = 0,
}: ContractCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-indigo-500/30 transition-all"
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div>
            <div className="text-xl font-semibold mb-1 text-white">
              Future Talents Fund
            </div>
            <div className="text-gray-400">
              Contract started{" "}
              {new Date(contract.startDate).toLocaleDateString()}
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 md:mt-0">
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Amount</span>
              <span className="font-semibold text-white">
                ${formatCurrency(contract.amount)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Contract Type</span>
              <span className="font-semibold text-white capitalize">
                {contract.termsType}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Term</span>
              <span className="font-semibold text-white">
                {contract.termDetails.months} months
              </span>
            </div>
          </div>

          <div className="mt-4 md:mt-0">
            <Link href={`/funding/contracts/${contract.id}`}>
              <span className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-300 font-medium hover:bg-indigo-500/30 transition-colors">
                View Details
                <ChevronRight className="ml-2 h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="font-medium mb-4 text-white">Milestones</h3>
          <div className="space-y-4">
            {contract.milestones.map((milestone: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div
                  className={`p-2 rounded-full ${
                    milestone.completed
                      ? "bg-green-500/20 text-green-400"
                      : "bg-white/10 text-gray-400"
                  }`}
                >
                  {milestone.completed ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Clock className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">
                    {milestone.description}
                  </div>
                  <div className="text-sm text-gray-400">
                    Due: {new Date(milestone.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-white">
                    ${formatCurrency(milestone.amount)}
                  </div>
                  <div className="text-xs text-gray-400">Milestone Value</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
