import React from "react";
import { Search } from "lucide-react";

type SearchFiltersProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedField: string | null;
  setSelectedField: (field: string | null) => void;
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  allFields: string[];
  allFundingTypes: string[];
};

export default function SearchFilters({
  searchQuery,
  setSearchQuery,
  selectedField,
  setSelectedField,
  selectedType,
  setSelectedType,
  allFields,
  allFundingTypes,
}: SearchFiltersProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 h-5 w-5" />
          <input
            placeholder="Search investors by name, description, or focus area..."
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
            value={selectedField || ""}
            onChange={(e) => setSelectedField(e.target.value || null)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white text-sm"
          >
            <option value="" className="bg-gray-800">
              All Fields
            </option>
            {allFields.map((field) => (
              <option key={field} value={field} className="bg-gray-800">
                {field}
              </option>
            ))}
          </select>

          <select
            value={selectedType || ""}
            onChange={(e) => setSelectedType(e.target.value || null)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white text-sm"
          >
            <option value="" className="bg-gray-800">
              All Funding Types
            </option>
            {allFundingTypes.map((type) => (
              <option key={type} value={type} className="bg-gray-800">
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(searchQuery || selectedField || selectedType) && (
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-400">
            Filter applied: {searchQuery ? `"${searchQuery}"` : ""}{" "}
            {selectedField ? `Field: ${selectedField}` : ""}{" "}
            {selectedType ? `Type: ${selectedType}` : ""}
          </div>

          <button
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            onClick={() => {
              setSearchQuery("");
              setSelectedField(null);
              setSelectedType(null);
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </>
  );
}
