import React from "react";
import { GraduationCap, Users, BookOpen } from "lucide-react";

type CategoryFilterProps = {
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
};

export default function CategoryFilter({
  selectedType,
  setSelectedType,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
      <button
        className={`px-4 py-2 rounded-lg ${
          selectedType === null
            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
            : "bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10"
        } transition-all flex items-center gap-2 whitespace-nowrap`}
        onClick={() => setSelectedType(null)}
      >
        All Types
      </button>

      <button
        className={`px-4 py-2 rounded-lg ${
          selectedType === "course"
            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
            : "bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10"
        } transition-all flex items-center gap-2 whitespace-nowrap`}
        onClick={() => setSelectedType("course")}
      >
        <GraduationCap className="h-4 w-4" />
        Courses
      </button>

      <button
        className={`px-4 py-2 rounded-lg ${
          selectedType === "mentorship"
            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
            : "bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10"
        } transition-all flex items-center gap-2 whitespace-nowrap`}
        onClick={() => setSelectedType("mentorship")}
      >
        <Users className="h-4 w-4" />
        Mentorship
      </button>

      <button
        className={`px-4 py-2 rounded-lg ${
          selectedType === "peer-teaching"
            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
            : "bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10"
        } transition-all flex items-center gap-2 whitespace-nowrap`}
        onClick={() => setSelectedType("peer-teaching")}
      >
        <BookOpen className="h-4 w-4" />
        Peer Learning
      </button>
    </div>
  );
}
