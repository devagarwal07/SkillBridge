import React from "react";
import { Badge } from "@/components/ui/badge";

type CareerPlansStepProps = {
  formData: {
    shortTermGoals: string;
    longTermGoals: string;
    targetIndustries: string[];
    targetRoles: string[];
    salaryExpectations: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: any) => void;
};

export default function CareerPlansStep({
  formData,
  errors,
  onChange,
}: CareerPlansStepProps) {
  const addToList = (
    field: "targetIndustries" | "targetRoles",
    value: string,
    input: HTMLInputElement
  ) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      onChange(field, [...formData[field], value.trim()]);
      input.value = "";
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">Career Plans</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Short-Term Career Goals (1-2 years)
          </label>
          <textarea
            rows={3}
            value={formData.shortTermGoals}
            onChange={(e) => onChange("shortTermGoals", e.target.value)}
            placeholder="Describe your career goals for the next 1-2 years"
            className={`w-full px-3 py-2 bg-white/5 border ${
              errors["career.shortTermGoals"]
                ? "border-red-500"
                : "border-white/20"
            } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
          ></textarea>
          {errors["career.shortTermGoals"] && (
            <p className="mt-1 text-sm text-red-500">
              {errors["career.shortTermGoals"]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Long-Term Career Goals (3-5 years)
          </label>
          <textarea
            rows={3}
            value={formData.longTermGoals}
            onChange={(e) => onChange("longTermGoals", e.target.value)}
            placeholder="Describe your career goals for the next 3-5 years"
            className={`w-full px-3 py-2 bg-white/5 border ${
              errors["career.longTermGoals"]
                ? "border-red-500"
                : "border-white/20"
            } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
          ></textarea>
          {errors["career.longTermGoals"] && (
            <p className="mt-1 text-sm text-red-500">
              {errors["career.longTermGoals"]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Target Industries
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.targetIndustries.map((industry, index) => (
              <Badge
                key={index}
                className="bg-white/5 text-gray-300 hover:bg-indigo-500/10 hover:text-indigo-300 border border-white/10 hover:border-indigo-500/30 transition-colors flex items-center gap-1"
              >
                {industry}
                <button
                  type="button"
                  onClick={() => {
                    const newIndustries = [...formData.targetIndustries];
                    newIndustries.splice(index, 1);
                    onChange("targetIndustries", newIndustries);
                  }}
                  className="text-gray-400 hover:text-gray-200 ml-1"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              placeholder="Add an industry (e.g., Technology, Finance)"
              className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  e.preventDefault();
                  addToList(
                    "targetIndustries",
                    e.currentTarget.value,
                    e.currentTarget
                  );
                }
              }}
            />
            <button
              type="button"
              className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg transition-colors"
              onClick={(e) => {
                const input = e.currentTarget
                  .previousElementSibling as HTMLInputElement;
                addToList("targetIndustries", input.value, input);
              }}
            >
              Add
            </button>
          </div>
          {errors["career.targetIndustries"] && (
            <p className="mt-1 text-sm text-red-500">
              {errors["career.targetIndustries"]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Target Roles
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.targetRoles.map((role, index) => (
              <Badge
                key={index}
                className="bg-white/5 text-gray-300 hover:bg-indigo-500/10 hover:text-indigo-300 border border-white/10 hover:border-indigo-500/30 transition-colors flex items-center gap-1"
              >
                {role}
                <button
                  type="button"
                  onClick={() => {
                    const newRoles = [...formData.targetRoles];
                    newRoles.splice(index, 1);
                    onChange("targetRoles", newRoles);
                  }}
                  className="text-gray-400 hover:text-gray-200 ml-1"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              placeholder="Add a role (e.g., Data Scientist, Software Engineer)"
              className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  e.preventDefault();
                  addToList(
                    "targetRoles",
                    e.currentTarget.value,
                    e.currentTarget
                  );
                }
              }}
            />
            <button
              type="button"
              className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg transition-colors"
              onClick={(e) => {
                const input = e.currentTarget
                  .previousElementSibling as HTMLInputElement;
                addToList("targetRoles", input.value, input);
              }}
            >
              Add
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Expected Salary Range
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              $
            </span>
            <input
              type="number"
              value={formData.salaryExpectations}
              onChange={(e) => onChange("salaryExpectations", e.target.value)}
              placeholder="e.g., 80000"
              className="w-full pl-7 pr-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">
            This helps investors understand your earning potential for Income
            Share Agreements.
          </p>
        </div>
      </div>
    </div>
  );
}
