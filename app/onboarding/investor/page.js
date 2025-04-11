"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Briefcase,
  Building,
  Target,
  BarChart3,
  DollarSign,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Layout from "../../components/layout/Layout";

// Current user information
const currentTime = "2025-04-11 14:07:25";
const currentUser = "vkhare2909";

// Define steps
const steps = [
  "Personal Details",
  "Company Information",
  "Investment Preferences",
  "Review",
];

export default function InvestorOnboardingPage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    position: "",
    investmentFocus: [],
    investmentStage: "",
    portfolioSize: "",
    role: "investor", // Add role field
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // Pre-fill form with user data if available
  useEffect(() => {
    if (isLoaded && user) {
      setFormData((prev) => ({
        ...prev,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [isLoaded, user]);

  // Handle input change for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is updated
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle investment focus change
  const handleInvestmentFocusChange = (e) => {
    const focus = e.target.value.split(",").map((item) => item.trim());
    setFormData((prev) => ({
      ...prev,
      investmentFocus: focus,
    }));

    // Clear error
    if (errors.investmentFocus) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.investmentFocus;
        return newErrors;
      });
    }
  };

  // Add/remove individual investment focus
  const handleFocusItemChange = (item, action) => {
    if (action === "add" && !formData.investmentFocus.includes(item)) {
      setFormData((prev) => ({
        ...prev,
        investmentFocus: [...prev.investmentFocus, item],
      }));
    } else if (action === "remove") {
      setFormData((prev) => ({
        ...prev,
        investmentFocus: prev.investmentFocus.filter((focus) => focus !== item),
      }));
    }
  };

  // Handle next step
  const handleNextStep = () => {
    // Validate current step
    const currentErrors = {};

    if (currentStep === 0) {
      // Validate personal details
      if (!formData.name) {
        currentErrors.name = "Name is required";
      }
      if (!formData.email) {
        currentErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        currentErrors.email = "Email is invalid";
      }
    } else if (currentStep === 1) {
      // Validate company details
      if (!formData.company) {
        currentErrors.company = "Company is required";
      }
      if (!formData.position) {
        currentErrors.position = "Position is required";
      }
    } else if (currentStep === 2) {
      // Validate investment preferences
      if (formData.investmentFocus.length === 0) {
        currentErrors.investmentFocus =
          "Please specify at least one investment focus";
      }
      if (!formData.investmentStage) {
        currentErrors.investmentStage = "Investment stage is required";
      }
      if (!formData.portfolioSize) {
        currentErrors.portfolioSize = "Portfolio size is required";
      }
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    // Go to next step
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Onboarding completed successfully!");
        router.push("/investor"); // Redirect to investor dashboard
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting onboarding data:", error);
      setApiError(error.message || "Failed to submit onboarding data");
      toast.error("Failed to submit onboarding data");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sample investment focus options
  const focusOptions = [
    "Fintech",
    "EdTech",
    "HealthTech",
    "AI/ML",
    "SaaS",
    "E-commerce",
    "Clean Energy",
    "Biotech",
    "Blockchain",
    "Cybersecurity",
    "Consumer Apps",
    "Enterprise Software",
    "Hardware",
    "Robotics",
    "Space Tech",
  ];

  return (
    <Layout>
      <div className="min-h-screen flex flex-col bg-slate-950 text-white relative">
        {/* Background gradients */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-[50%] h-[40%] bg-purple-500/5 blur-3xl rounded-full transform-gpu"></div>
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-500/5 blur-3xl rounded-full transform-gpu"></div>
          <div className="absolute top-1/3 left-1/4 w-[30%] h-[30%] bg-emerald-500/5 blur-3xl rounded-full transform-gpu"></div>
        </div>

        {/* User info in the bottom corner */}
        <div className="fixed bottom-2 right-2 text-slate-500 text-xs flex items-center gap-1 opacity-70">
          <span>{currentTime}</span>
          <span className="w-1 h-1 rounded-full bg-slate-500"></span>
          <span>{currentUser}</span>
        </div>

        <header className="border-b border-slate-800 backdrop-blur-sm bg-slate-900/50 z-10 relative">
          <div className="container mx-auto py-4 px-4 flex items-center justify-between">
            <div className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Investor Onboarding
            </div>
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard/investor")}
              className="text-slate-300 hover:text-white hover:bg-slate-800"
            >
              Skip for now
            </Button>
          </div>
        </header>

        <main className="flex-1 container mx-auto py-8 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-10">
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400">
                Complete Your Investor Profile
              </h1>
              <p className="text-slate-400 mt-3">
                Tell us about your investment preferences to help us match you
                with the right opportunities
              </p>
            </div>

            {/* API Error Message */}
            {apiError && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-300">
                <AlertCircle className="h-5 w-5" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Progress bar */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">
                  Profile completion
                </span>
                <span className="text-sm text-slate-400">
                  {Math.round(((currentStep + 1) / steps.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800/70 rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Steps indicator */}
            <div className="hidden md:flex items-center mb-10">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center flex-1">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${
                      currentStep > index
                        ? "bg-purple-600 text-white"
                        : currentStep === index
                        ? "border-2 border-purple-500 text-purple-400"
                        : "border-2 border-slate-700 text-slate-500"
                    }`}
                  >
                    {currentStep > index ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  <span
                    className={`ml-3 font-medium transition-colors duration-300 ${
                      currentStep === index ? "text-white" : "text-slate-400"
                    }`}
                  >
                    {step}
                  </span>

                  {index < steps.length - 1 && (
                    <div className="flex-1 h-px bg-slate-800 mx-4"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile steps indicator */}
            <div className="md:hidden flex items-center justify-center mb-8">
              <span className="text-slate-300 font-medium">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
              </span>
            </div>

            {/* Form container */}
            <motion.div
              initial={{ opacity: 0.9, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-6 md:p-8 backdrop-blur-sm shadow-xl shadow-purple-950/10 mb-8"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-[300px]"
                >
                  {/* Step 1: Personal Details */}
                  {currentStep === 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                        <User className="h-5 w-5 text-purple-400" />
                        Personal Details
                      </h2>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-slate-300">
                            Full Name
                          </label>
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            className={`bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${
                              errors.name ? "border-red-500" : ""
                            }`}
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-400">
                              {errors.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="flex items-center text-sm font-medium mb-2 text-slate-300">
                            <Mail className="h-4 w-4 mr-2 text-purple-400" />
                            Email Address
                          </label>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            className={`bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${
                              errors.email ? "border-red-500" : ""
                            }`}
                          />
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-400">
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Company Information */}
                  {currentStep === 1 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                        <Building className="h-5 w-5 text-purple-400" />
                        Company Information
                      </h2>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-slate-300">
                            Company
                          </label>
                          <Input
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Your company or fund name"
                            className={`bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${
                              errors.company ? "border-red-500" : ""
                            }`}
                          />
                          {errors.company && (
                            <p className="mt-1 text-sm text-red-400">
                              {errors.company}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="flex items-center text-sm font-medium mb-2 text-slate-300">
                            <Briefcase className="h-4 w-4 mr-2 text-purple-400" />
                            Position
                          </label>
                          <Input
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            placeholder="Your role (e.g., Managing Partner, VC Associate)"
                            className={`bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${
                              errors.position ? "border-red-500" : ""
                            }`}
                          />
                          {errors.position && (
                            <p className="mt-1 text-sm text-red-400">
                              {errors.position}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Investment Preferences */}
                  {currentStep === 2 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                        <Target className="h-5 w-5 text-purple-400" />
                        Investment Preferences
                      </h2>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-slate-300">
                            Investment Focus
                          </label>
                          <div className="mb-2">
                            <Input
                              name="investmentFocusInput"
                              placeholder="Enter focus areas (comma separated)"
                              onChange={handleInvestmentFocusChange}
                              className={`bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${
                                errors.investmentFocus ? "border-red-500" : ""
                              }`}
                            />
                          </div>

                          {errors.investmentFocus && (
                            <p className="mt-1 mb-2 text-sm text-red-400">
                              {errors.investmentFocus}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2 mb-4">
                            {formData.investmentFocus.map((focus) => (
                              <span
                                key={focus}
                                className="inline-flex items-center bg-purple-500/20 text-purple-300 text-sm px-3 py-1 rounded-full border border-purple-500/30"
                              >
                                {focus}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleFocusItemChange(focus, "remove")
                                  }
                                  className="ml-1.5 h-4 w-4 rounded-full flex items-center justify-center hover:bg-purple-400/20 transition-colors"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>

                          <p className="text-sm text-slate-400 mb-3">
                            Or select from common focus areas:
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {focusOptions
                              .filter(
                                (focus) =>
                                  !formData.investmentFocus.includes(focus)
                              )
                              .map((focus) => (
                                <div
                                  key={focus}
                                  className="border border-slate-700 bg-slate-800/30 rounded-md p-2 cursor-pointer hover:bg-slate-800/70 hover:border-purple-500/30 transition-all duration-200"
                                  onClick={() =>
                                    handleFocusItemChange(focus, "add")
                                  }
                                >
                                  <span className="text-sm text-slate-300">
                                    {focus}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>

                        <div>
                          <label className="flex items-center text-sm font-medium mb-2 text-slate-300">
                            <BarChart3 className="h-4 w-4 mr-2 text-purple-400" />
                            Investment Stage
                          </label>
                          <select
                            name="investmentStage"
                            value={formData.investmentStage}
                            onChange={handleChange}
                            className={`w-full rounded-md bg-slate-800/50 border border-slate-700 text-white px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors appearance-none ${
                              errors.investmentStage ? "border-red-500" : ""
                            }`}
                          >
                            <option value="">Select Stage</option>
                            <option value="Pre-seed">Pre-seed</option>
                            <option value="Seed">Seed</option>
                            <option value="Series A">Series A</option>
                            <option value="Series B">Series B</option>
                            <option value="Series C and beyond">
                              Series C and beyond
                            </option>
                            <option value="All Stages">All Stages</option>
                          </select>
                          {errors.investmentStage && (
                            <p className="mt-1 text-sm text-red-400">
                              {errors.investmentStage}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="flex items-center text-sm font-medium mb-2 text-slate-300">
                            <DollarSign className="h-4 w-4 mr-2 text-purple-400" />
                            Portfolio Size
                          </label>
                          <select
                            name="portfolioSize"
                            value={formData.portfolioSize}
                            onChange={handleChange}
                            className={`w-full rounded-md bg-slate-800/50 border border-slate-700 text-white px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors appearance-none ${
                              errors.portfolioSize ? "border-red-500" : ""
                            }`}
                          >
                            <option value="">Select Portfolio Size</option>
                            <option value="Less than $1M">Less than $1M</option>
                            <option value="$1M - $5M">$1M - $5M</option>
                            <option value="$5M - $10M">$5M - $10M</option>
                            <option value="$10M - $50M">$10M - $50M</option>
                            <option value="$50M - $100M">$50M - $100M</option>
                            <option value="More than $100M">
                              More than $100M
                            </option>
                          </select>
                          {errors.portfolioSize && (
                            <p className="mt-1 text-sm text-red-400">
                              {errors.portfolioSize}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Review */}
                  {currentStep === 3 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                        <CheckCircle2 className="h-5 w-5 text-purple-400" />
                        Review Your Information
                      </h2>

                      <div className="space-y-6">
                        <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700">
                          <h3 className="font-medium text-purple-400 mb-2">
                            Personal Details
                          </h3>
                          <p className="text-white mb-1">
                            <span className="text-slate-400">Name:</span>{" "}
                            {formData.name}
                          </p>
                          <p className="text-white">
                            <span className="text-slate-400">Email:</span>{" "}
                            {formData.email}
                          </p>
                        </div>

                        <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700">
                          <h3 className="font-medium text-purple-400 mb-2">
                            Company Information
                          </h3>
                          <p className="text-white mb-1">
                            <span className="text-slate-400">Company:</span>{" "}
                            {formData.company}
                          </p>
                          <p className="text-white">
                            <span className="text-slate-400">Position:</span>{" "}
                            {formData.position}
                          </p>
                        </div>

                        <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700">
                          <h3 className="font-medium text-purple-400 mb-2">
                            Investment Preferences
                          </h3>
                          <div className="mb-3">
                            <span className="text-slate-400 block mb-2">
                              Investment Focus:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {formData.investmentFocus.map((focus) => (
                                <span
                                  key={focus}
                                  className="inline-flex items-center bg-purple-500/20 text-purple-300 text-sm px-3 py-1 rounded-full"
                                >
                                  {focus}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-white mb-1">
                            <span className="text-slate-400">
                              Investment Stage:
                            </span>{" "}
                            {formData.investmentStage}
                          </p>
                          <p className="text-white">
                            <span className="text-slate-400">
                              Portfolio Size:
                            </span>{" "}
                            {formData.portfolioSize}
                          </p>
                        </div>

                        <p className="text-slate-400 text-sm">
                          Please review your information above. Click "Complete
                          Onboarding" to submit, or go back to make changes.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Navigation buttons */}
            <div className="flex justify-between">
              <Button
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className={`border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all ${
                  currentStep === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <Button
                onClick={handleNextStep}
                disabled={isSubmitting}
                className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-none shadow-md shadow-purple-500/20 hover:shadow-purple-500/30 transition-all ${
                  isSubmitting ? "opacity-80" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : currentStep === steps.length - 1 ? (
                  <>
                    Complete Onboarding
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
