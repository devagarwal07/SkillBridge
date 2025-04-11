import React from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

type EmptyStateProps = {
  onReset: () => void;
};

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 border border-white/10 rounded-xl p-12 text-center"
    >
      <BookOpen className="h-16 w-16 mx-auto text-indigo-400 mb-6" />
      <h3 className="text-2xl font-semibold mb-4 text-white">No items found</h3>
      <p className="text-gray-300 max-w-md mx-auto mb-8">
        We couldn't find any items matching your search criteria. Try adjusting
        your filters or search terms.
      </p>
      <button
        onClick={onReset}
        className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
      >
        Clear All Filters
      </button>
    </motion.div>
  );
}
