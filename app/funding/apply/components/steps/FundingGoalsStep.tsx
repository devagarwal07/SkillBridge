import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";

type FundingGoalsStepProps = {
  formData: {
    amount: string;
    purpose: string;
    timeline: string;
    preferredModel: string;
    specificInvestors: string[];
  };
  investors: any[];
  errors: Record<string, string>;
  onChange: (field: string, value: any) => void;
};

export default function FundingGoalsStep({
  formData,
  investors,
  errors,
  onChange,
}: FundingGoalsStepProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">Funding Goals</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Amount Requested
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              $
            </span>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => onChange("amount", e.target.value)}
              placeholder="e.g., 15000"
              className={`w-full pl-7 pr-3 py-2 bg-white/5 border ${
                errors["funding.amount"] ? "border-red-500" : "border-white/20"
              } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            />
          </div>
          {errors["funding.amount"] && (
            <p className="mt-1 text-sm text-red-500">
              {errors["funding.amount"]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Funding Timeline
          </label>
          <select
            value={formData.timeline}
            onChange={(e) => onChange("timeline", e.target.value)}
            className={`w-full px-3 py-2 bg-white/5 border ${
              errors["funding.timeline"] ? "border-red-500" : "border-white/20"
            } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
          >
            <option value="" className="bg-gray-800">
              Select a timeline
            </option>
            <option value="Immediate" className="bg-gray-800">
              Immediate (within 1 month)
            </option>
            <option value="Short-term" className="bg-gray-800">
              Short-term (1-3 months)
            </option>
            <option value="Medium-term" className="bg-gray-800">
              Medium-term (3-6 months)
            </option>
            <option value="Long-term" className="bg-gray-800">
              Long-term (6+ months)
            </option>
          </select>
          {errors["funding.timeline"] && (
            <p className="mt-1 text-sm text-red-500">
              {errors["funding.timeline"]}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Purpose of Funding
          </label>
          <textarea
            rows={4}
            value={formData.purpose}
            onChange={(e) => onChange("purpose", e.target.value)}
            placeholder="Explain how you plan to use the funding (e.g., tuition, living expenses, project costs)"
            className={`w-full px-3 py-2 bg-white/5 border ${
              errors["funding.purpose"] ? "border-red-500" : "border-white/20"
            } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
          ></textarea>
          {errors["funding.purpose"] && (
            <p className="mt-1 text-sm text-red-500">
              {errors["funding.purpose"]}
            </p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Specific Investors (Optional)
        </label>
        <p className="text-sm text-gray-400 mb-4">
          Select any specific investors you'd like to apply to. Leave blank to
          be matched with all suitable investors.
        </p>

        <div className="space-y-3">
          {investors.map((investor) => (
            <div
              key={investor.id}
              className={`p-4 rounded-lg border ${
                formData.specificInvestors.includes(investor.id)
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-white/20 bg-white/5"
              } cursor-pointer transition-colors`}
              onClick={() => {
                const newInvestors = formData.specificInvestors.includes(
                  investor.id
                )
                  ? formData.specificInvestors.filter(
                      (id) => id !== investor.id
                    )
                  : [...formData.specificInvestors, investor.id];
                onChange("specificInvestors", newInvestors);
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center ${
                    formData.specificInvestors.includes(investor.id)
                      ? "border-indigo-500 bg-indigo-500 text-white"
                      : "border-white/20"
                  }`}
                >
                  {formData.specificInvestors.includes(investor.id) && (
                    <Check className="h-3 w-3" />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20">
                    <Image
                      src={investor.logo}
                      alt={investor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      {investor.name}
                    </div>
                    <div className="text-xs text-gray-400">{investor.type}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
