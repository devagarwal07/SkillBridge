"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FormStepIndicator from "./FormStepIndicator";
import FormNavigation from "./FormNavigation";
import PersonalInfoStep from "./steps/PresonalInfoStep";
import EducationSkillsStep from "./steps/EducationSkillsStep";
import FundingGoalsStep from "./steps/FundingGoalsStep";
import CareerPlansStep from "./steps/CareerPlansStep";
import DocumentationStep from "./steps/DocumentationStep";
import ReviewSubmitStep from "./steps/ReviewSubmitStep";

// Application steps
const steps = [
  "Personal Information",
  "Education & Skills",
  "Funding Goals",
  "Career Plans",
  "Documentation",
  "Review & Submit",
];

type FormContainerProps = {
  userData: any;
  investors: any[];
  initialFormData: any;
  onSubmit: (formData: any) => void;
};

export default function FormContainer({
  userData,
  investors,
  initialFormData,
  onSubmit,
}: FormContainerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to top when changing steps
  useEffect(() => {
    if (formContainerRef.current) {
      formContainerRef.current.scrollTo(0, 0);
    }
  }, [currentStep]);

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    // Clear error when field is updated
    if (errors[`${section}.${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`${section}.${field}`];
        return newErrors;
      });
    }
  };

  const validateCurrentStep = () => {
    const currentErrors: Record<string, string> = {};

    if (currentStep === 0) {
      // Validate personal info
      if (!formData.personalInfo.name)
        currentErrors["personalInfo.name"] = "Name is required";
      if (!formData.personalInfo.email)
        currentErrors["personalInfo.email"] = "Email is required";
      if (!formData.personalInfo.phone)
        currentErrors["personalInfo.phone"] = "Phone number is required";
      if (!formData.personalInfo.location)
        currentErrors["personalInfo.location"] = "Location is required";
    } else if (currentStep === 1) {
      // Validate education
      if (!formData.education.institution)
        currentErrors["education.institution"] = "Institution is required";
      if (!formData.education.major)
        currentErrors["education.major"] = "Major is required";
      if (!formData.education.graduationDate)
        currentErrors["education.graduationDate"] =
          "Graduation date is required";
    } else if (currentStep === 2) {
      // Validate funding
      if (!formData.funding.amount)
        currentErrors["funding.amount"] = "Amount is required";
      if (!formData.funding.purpose)
        currentErrors["funding.purpose"] = "Purpose is required";
      if (!formData.funding.timeline)
        currentErrors["funding.timeline"] = "Timeline is required";
    } else if (currentStep === 3) {
      // Validate career
      if (!formData.career.shortTermGoals)
        currentErrors["career.shortTermGoals"] =
          "Short-term goals are required";
      if (!formData.career.longTermGoals)
        currentErrors["career.longTermGoals"] = "Long-term goals are required";
      if (formData.career.targetIndustries.length === 0)
        currentErrors["career.targetIndustries"] =
          "At least one target industry is required";
    }

    return currentErrors;
  };

  const handleNextStep = () => {
    // Validate current step
    const currentErrors = validateCurrentStep();

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    // If validation passes, go to next step
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar with steps */}
      <FormStepIndicator
        steps={steps}
        currentStep={currentStep}
        userData={userData}
      />

      {/* Main form area */}
      <div ref={formContainerRef} className="lg:w-3/4 flex-1 overflow-y-auto">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-md p-6 mb-6">
          <div className="mb-6">
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">
                  Application Progress
                </span>
                <span className="text-sm text-gray-400">
                  {Math.round(((currentStep + 1) / steps.length) * 100)}%
                </span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                  style={{
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[400px]"
            >
              {currentStep === 0 && (
                <PersonalInfoStep
                  formData={formData.personalInfo}
                  errors={errors}
                  onChange={(field, value) =>
                    handleInputChange("personalInfo", field, value)
                  }
                />
              )}

              {currentStep === 1 && (
                <EducationSkillsStep
                  formData={formData.education}
                  userData={userData}
                  errors={errors}
                  onChange={(field, value) =>
                    handleInputChange("education", field, value)
                  }
                />
              )}

              {currentStep === 2 && (
                <FundingGoalsStep
                  formData={formData.funding}
                  investors={investors}
                  errors={errors}
                  onChange={(field, value) =>
                    handleInputChange("funding", field, value)
                  }
                />
              )}

              {currentStep === 3 && (
                <CareerPlansStep
                  formData={formData.career}
                  errors={errors}
                  onChange={(field, value) =>
                    handleInputChange("career", field, value)
                  }
                />
              )}

              {currentStep === 4 && (
                <DocumentationStep
                  formData={formData.documents}
                  errors={errors}
                  onChange={(field, value) =>
                    handleInputChange("documents", field, value)
                  }
                />
              )}

              {currentStep === 5 && (
                <ReviewSubmitStep formData={formData} onEdit={setCurrentStep} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <FormNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          onPrev={handlePrevStep}
          onNext={handleNextStep}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
