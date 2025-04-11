import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SparkleButton from "@/components/ui/SparkleButton";

type FormNavigationProps = {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  isSubmitting: boolean;
};

export default function FormNavigation({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  isSubmitting,
}: FormNavigationProps) {
  return (
    <div className="flex justify-between mt-8">
      {currentStep > 0 ? (
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </button>
      ) : (
        <Link href="/funding">
          <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-all">
            <ArrowLeft className="h-4 w-4" />
            Back to Funding
          </span>
        </Link>
      )}

      <div
        onClick={(e) => {
          e.preventDefault();
          onNext();
        }}
      >
        <SparkleButton
          href="#"
          className={`px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all ${
            isSubmitting ? "opacity-70 pointer-events-none" : ""
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </div>
          ) : currentStep === totalSteps - 1 ? (
            <>
              Submit Application
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </SparkleButton>
      </div>
    </div>
  );
}
