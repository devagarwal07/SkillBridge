import React from "react";
import { Check, LineChart, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type FormStepIndicatorProps = {
  steps: string[];
  currentStep: number;
  userData: any;
};

export default function FormStepIndicator({
  steps,
  currentStep,
  userData,
}: FormStepIndicatorProps) {
  return (
    <div className="lg:w-1/4">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-md p-6 sticky top-24">
        <h2 className="text-xl font-bold mb-6 text-white">Application Steps</h2>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm 
                  ${
                    currentStep === index
                      ? "bg-indigo-500 text-white"
                      : currentStep > index
                      ? "bg-indigo-500/20 text-indigo-300"
                      : "bg-white/10 text-gray-400"
                  }
                `}
              >
                {currentStep > index ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`${
                  currentStep === index
                    ? "font-medium text-white"
                    : currentStep > index
                    ? "text-indigo-300"
                    : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm">
            <LineChart className="h-4 w-4 text-indigo-400" />
            <span className="text-gray-400">Education Credit Score:</span>
            <span className="font-medium text-white">
              {userData.educationCreditScore}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-2">
            <DollarSign className="h-4 w-4 text-indigo-400" />
            <span className="text-gray-400">Funding Eligibility:</span>
            <span className="font-medium text-white">
              Up to ${formatCurrency(userData.educationCreditScore * 100)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
