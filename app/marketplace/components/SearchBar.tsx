import React from "react";
import { Search } from "lucide-react";

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export default function SearchBar({
  searchQuery,
  setSearchQuery,
}: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 h-5 w-5" />
      <input
        placeholder="Search courses, mentors, and resources..."
        className="w-full pl-10 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
