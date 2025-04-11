import React from "react";
import { Search } from "lucide-react";

type SearchFiltersProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  focusFilter: string | null;
  setFocusFilter: (field: string | null) => void;
  fundingModelFilter: string | null;
  setFundingModelFilter: (model: string | null) => void;
  allFocusAreas: string[];
  allFundingModels: string[];
  totalInvestors: number;
  filteredCount: number;
};

export default function SearchFilters({
  searchQuery,
  setSearchQuery,
  focusFilter,
  setFocusFilter,
  fundingModelFilter,
  setFundingModelFilter,
  allFocusAreas,
  allFundingModels,
  totalInvestors,
  filteredCount,
}: SearchFiltersProps) {
  const clearAllFilters = () => {
    setSearchQuery("");
    setFocusFilter(null);
    setFundingModelFilter(null);
  };

  const filtersApplied = searchQuery || focusFilter || fundingModelFilter;

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 h-5 w-5" />
          <input
            placeholder="Search by name, description, or focus area..."
            className="w-full pl-10 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm whitespace-nowrap text-gray-300">
            Filter by:
          </span>
          <select
            value={focusFilter || ""}
            onChange={(e) => setFocusFilter(e.target.value || null)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white text-sm"
          >
            <option value="" className="bg-gray-800">
              All Focus Areas
            </option>
            {allFocusAreas.map((area) => (
              <option key={area} value={area} className="bg-gray-800">
                {area}
              </option>
            ))}
          </select>

          <select
            value={fundingModelFilter || ""}
            onChange={(e) => setFundingModelFilter(e.target.value || null)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white text-sm"
          >
            <option value="" className="bg-gray-800">
              All Funding Models
            </option>
            {allFundingModels.map((model) => (
              <option key={model} value={model} className="bg-gray-800">
                {model}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtersApplied && (
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-400">
            Showing {filteredCount} of {totalInvestors} investors
            {searchQuery && <span> • Search: "{searchQuery}"</span>}
            {focusFilter && <span> • Focus: {focusFilter}</span>}
            {fundingModelFilter && <span> • Model: {fundingModelFilter}</span>}
          </div>

          <button
            className="text-sm text-indigo-400 hover:text-indigo-300 hover:underline transition-colors ml-2"
            onClick={clearAllFilters}
          >
            Clear Filters
          </button>
        </div>
      )}
    </>
  );
}
