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
  School,
  BookOpen,
  BadgeCheck,
  CheckCircle2,
  Code,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Layout from "../../components/layout/Layout";

// Current user information
const currentTime = "2025-04-11 13:58:14";
const currentUser = "vkhare2909";

// Define steps
const steps = [
  "Personal Details",
  "Educational Background",
  "Skills & Interests",
  "Summary",
];

export default function StudentOnboardingPage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    institution: "",
    courseOfStudy: "",
    yearOfStudy: "",
    skills: [],
    interests: [],
    role: "student", // Add role field
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

  // Handle input change
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

  // Handle skills change
  const handleSkillsChange = (skill, action) => {
    if (action === "add" && !formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    } else if (action === "remove") {
      setFormData((prev) => ({
        ...prev,
        skills: prev.skills.filter((s) => s !== skill),
      }));
    }
  };

  // Handle interests change
  const handleInterestsChange = (interest, action) => {
    if (action === "add" && !formData.interests.includes(interest)) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, interest],
      }));
    } else if (action === "remove") {
      setFormData((prev) => ({
        ...prev,
        interests: prev.interests.filter((i) => i !== interest),
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
      // Validate educational background
      if (!formData.institution) {
        currentErrors.institution = "Institution is required";
      }
      if (!formData.courseOfStudy) {
        currentErrors.courseOfStudy = "Course of study is required";
      }
      if (!formData.yearOfStudy) {
        currentErrors.yearOfStudy = "Year of study is required";
      }
    } else if (currentStep === 2) {
      // Validate skills & interests
      if (formData.skills.length === 0) {
        currentErrors.skills = "Please select at least one skill";
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
      // Make API call to save onboarding data
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save onboarding data");
      }

      // Show success message
      toast.success("Onboarding completed successfully!");

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      setApiError(error.message);
      toast.error("Failed to submit onboarding data");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sample skill options
  const skillOptions = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "HTML/CSS",
    "Java",
    "C++",
    "Data Analysis",
    "Machine Learning",
    "UI/UX Design",
    "Mobile Development",
    "Cloud Computing",
    "DevOps",
    "Blockchain",
  ];

  // Sample interest options
  const interestOptions = [
    "Web Development",
    "AI & Machine Learning",
    "Data Science",
    "Mobile Apps",
    "Game Development",
    "Cybersecurity",
    "Cloud Computing",
    "Blockchain",
    "IoT",
    "Augmented Reality",
    "Design",
    "Product Management",
    "Entrepreneurship",
    "Open Source",
  ];

  // Sample year of study options
  const yearOptions = [
    "First Year",
    "Second Year",
    "Third Year",
    "Fourth Year",
    "Fifth Year",
    "Masters",
    "PhD",
  ];

  return (
    <Layout>
      <div className="min-h-screen flex flex-col bg-slate-950 text-white relative">
        {/* Background gradients */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-[50%] h-[40%] bg-blue-500/5 blur-3xl rounded-full transform-gpu"></div>
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-emerald-500/5 blur-3xl rounded-full transform-gpu"></div>
          <div className="absolute top-1/3 left-1/4 w-[30%] h-[30%] bg-purple-500/5 blur-3xl rounded-full transform-gpu"></div>
        </div>

        {/* User info in the bottom corner */}
        <div className="fixed bottom-2 right-2 text-slate-500 text-xs flex items-center gap-1 opacity-70">
          <span>{currentTime}</span>
          <span className="w-1 h-1 rounded-full bg-slate-500"></span>
          <span>{currentUser}</span>
        </div>

        <header className="border-b border-slate-800 backdrop-blur-sm bg-slate-900/50 z-10 relative">
          <div className="container mx-auto py-4 px-4 flex items-center justify-between">
            <div className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
              Student Onboarding
            </div>
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard/student")}
              className="text-slate-300 hover:text-white hover:bg-slate-800"
            >
              Skip for now
            </Button>
          </div>
        </header>

        <main className="flex-1 container mx-auto py-8 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-10">
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">
                Complete Your Student Profile
              </h1>
              <p className="text-slate-400 mt-3">
                Tell us more about yourself so we can personalize your
                experience
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
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full transition-all duration-300 ease-out"
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
                        ? "bg-blue-500 text-white"
                        : currentStep === index
                        ? "border-2 border-blue-500 text-blue-400"
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
              className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-6 md:p-8 backdrop-blur-sm shadow-xl shadow-blue-950/10 mb-8"
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
                        <User className="h-5 w-5 text-blue-400" />
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
                            className={`bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
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
                          <label className="block text-sm font-medium mb-2 text-slate-300">
                            Email Address
                          </label>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            className={`bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
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

                  {/* Step 2: Educational Background */}
                  {currentStep === 1 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                        <School className="h-5 w-5 text-blue-400" />
                        Educational Background
                      </h2>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-slate-300">
                            Institution
                          </label>
                          <Input
                            name="institution"
                            value={formData.institution}
                            onChange={handleChange}
                            placeholder="University, College or School name"
                            className={`bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                              errors.institution ? "border-red-500" : ""
                            }`}
                          />
                          {errors.institution && (
                            <p className="mt-1 text-sm text-red-400">
                              {errors.institution}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-slate-300">
                            Course of Study
                          </label>
                          <Input
                            name="courseOfStudy"
                            value={formData.courseOfStudy}
                            onChange={handleChange}
                            placeholder="E.g., Computer Science, Business, etc."
                            className={`bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                              errors.courseOfStudy ? "border-red-500" : ""
                            }`}
                          />
                          {errors.courseOfStudy && (
                            <p className="mt-1 text-sm text-red-400">
                              {errors.courseOfStudy}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-slate-300">
                            Year of Study
                          </label>
                          <select
                            name="yearOfStudy"
                            value={formData.yearOfStudy}
                            onChange={handleChange}
                            className={`w-full rounded-md bg-slate-800/50 border border-slate-700 text-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors ${
                              errors.yearOfStudy ? "border-red-500" : ""
                            }`}
                          >
                            <option value="">Select Year of Study</option>
                            {yearOptions.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                          {errors.yearOfStudy && (
                            <p className="mt-1 text-sm text-red-400">
                              {errors.yearOfStudy}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Skills & Interests */}
                  {currentStep === 2 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                        <BadgeCheck className="h-5 w-5 text-blue-400" />
                        Skills & Interests
                      </h2>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-slate-300">
                            <Code className="h-5 w-5 text-blue-400 inline mr-2" />
                            Your Skills
                          </label>
                          <p className="text-sm text-slate-400 mb-4">
                            Select the technical skills you currently have
                          </p>

                          {errors.skills && (
                            <p className="mt-1 mb-3 text-sm text-red-400">
                              {errors.skills}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2 mb-4">
                            {formData.skills.map((skill) => (
                              <span
                                key={skill}
                                className="inline-flex items-center bg-blue-500/20 text-blue-300 text-sm px-3 py-1 rounded-full border border-blue-500/30"
                              >
                                {skill}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSkillsChange(skill, "remove")
                                  }
                                  className="ml-1.5 h-4 w-4 rounded-full flex items-center justify-center hover:bg-blue-400/20 transition-colors"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {skillOptions
                              .filter(
                                (skill) => !formData.skills.includes(skill)
                              )
                              .map((skill) => (
                                <div
                                  key={skill}
                                  className="border border-slate-700 bg-slate-800/30 rounded-md p-2 cursor-pointer hover:bg-slate-800/70 hover:border-blue-500/30 transition-all duration-200"
                                  onClick={() =>
                                    handleSkillsChange(skill, "add")
                                  }
                                >
                                  <span className="text-sm text-slate-300">
                                    {skill}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-slate-300">
                            <Lightbulb className="h-5 w-5 text-blue-400 inline mr-2" />
                            Your Interests
                          </label>
                          <p className="text-sm text-slate-400 mb-4">
                            Select areas you're interested in learning more
                            about
                          </p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {formData.interests.map((interest) => (
                              <span
                                key={interest}
                                className="inline-flex items-center bg-indigo-500/20 text-indigo-300 text-sm px-3 py-1 rounded-full border border-indigo-500/30"
                              >
                                {interest}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleInterestsChange(interest, "remove")
                                  }
                                  className="ml-1.5 h-4 w-4 rounded-full flex items-center justify-center hover:bg-indigo-400/20 transition-colors"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {interestOptions
                              .filter(
                                (interest) =>
                                  !formData.interests.includes(interest)
                              )
                              .map((interest) => (
                                <div
                                  key={interest}
                                  className="border border-slate-700 bg-slate-800/30 rounded-md p-2 cursor-pointer hover:bg-slate-800/70 hover:border-indigo-500/30 transition-all duration-200"
                                  onClick={() =>
                                    handleInterestsChange(interest, "add")
                                  }
                                >
                                  <span className="text-sm text-slate-300">
                                    {interest}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Summary */}
                  {currentStep === 3 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                        <CheckCircle2 className="h-5 w-5 text-blue-400" />
                        Review Your Information
                      </h2>

                      <div className="space-y-6">
                        <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700">
                          <h3 className="font-medium text-blue-400 mb-2">
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
                          <h3 className="font-medium text-blue-400 mb-2">
                            Educational Background
                          </h3>
                          <p className="text-white mb-1">
                            <span className="text-slate-400">Institution:</span>{" "}
                            {formData.institution}
                          </p>
                          <p className="text-white mb-1">
                            <span className="text-slate-400">
                              Course of Study:
                            </span>{" "}
                            {formData.courseOfStudy}
                          </p>
                          <p className="text-white">
                            <span className="text-slate-400">
                              Year of Study:
                            </span>{" "}
                            {formData.yearOfStudy}
                          </p>
                        </div>

                        <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700">
                          <h3 className="font-medium text-blue-400 mb-2">
                            Skills & Interests
                          </h3>
                          <div className="mb-3">
                            <span className="text-slate-400 block mb-2">
                              Skills:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {formData.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="inline-flex items-center bg-blue-500/20 text-blue-300 text-sm px-3 py-1 rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-400 block mb-2">
                              Interests:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {formData.interests.map((interest) => (
                                <span
                                  key={interest}
                                  className="inline-flex items-center bg-indigo-500/20 text-indigo-300 text-sm px-3 py-1 rounded-full"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                          </div>
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
                className={`bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white border-none shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all ${
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
