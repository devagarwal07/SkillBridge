"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Editor from "@monaco-editor/react";
import Image from "next/image";
import Link from "next/link";
import {
  AlignLeft,
  Code,
  Terminal,
  Play,
  Check,
  ChevronRight,
  ChevronLeft,
  Clock,
  Zap,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Award,
  Save,
  Trophy,
  BookOpen,
  CheckSquare,
  ChevronDown,
  BrainCircuit,
  ArrowLeft,
  Lightbulb,
  ThumbsUp,
  RotateCcw,
  ChevronsRight,
  Rocket,
  Server,
  Users,
  X,
  Info,
  CheckCircle,
  Database,
  XCircle,
  Circle,
  BarChart4,
} from "lucide-react";
import {
  generateCodingProblem,
  verifyCodeSolution,
  generatePersonalizedHint,
  analyzeSolution,
} from "./components/lib/gemini";
import Header from "@/app/components/layout/Header";
import NoiseBackground from "@/app/components/effects/NoiseBackground";
import { TypingAnimation } from "./components/ui/TypingAnimation";
import { cn } from "@/lib/utils";
import Layout from "@/app/components/layout/Layout";
import LoadingSpinner from "../../components/ui/LoadingScreen";

const LANGUAGES = [
  {
    id: "javascript",
    name: "JavaScript",
    icon: "/icons/js.svg",
    defaultTemplate:
      "function solution(input) {\n  // Write your code here\n  \n  return result;\n}",
  },
  {
    id: "python",
    name: "Python",
    icon: "/icons/python.svg",
    defaultTemplate:
      "def solution(input):\n    # Write your code here\n    \n    return result",
  },
  {
    id: "java",
    name: "Java",
    icon: "/icons/java.svg",
    defaultTemplate:
      "public class Solution {\n    public static String solution(String input) {\n        // Write your code here\n        \n        return result;\n    }\n}",
  },
  {
    id: "cpp",
    name: "C++",
    icon: "/icons/cpp.svg",
    defaultTemplate:
      "#include <iostream>\n#include <string>\n\nstd::string solution(std::string input) {\n    // Write your code here\n    \n    return result;\n}",
  },
  {
    id: "typescript",
    name: "TypeScript",
    icon: "/icons/ts.svg",
    defaultTemplate:
      "function solution(input: any): any {\n  // Write your code here\n  \n  return result;\n}",
  },
];

// Difficulty levels
const DIFFICULTY_LEVELS = [
  {
    id: "easy",
    name: "Easy",
    color: "from-green-500 to-emerald-600",
    label: "Beginner",
    xp: 100,
  },
  {
    id: "medium",
    name: "Medium",
    color: "from-yellow-500 to-amber-600",
    label: "Intermediate",
    xp: 250,
  },
  {
    id: "hard",
    name: "Hard",
    color: "from-red-500 to-rose-600",
    label: "Advanced",
    xp: 500,
  },
];

// Custom notification component
function Notification({
  type,
  title,
  message,
  onClose,
}: {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  onClose: () => void;
}) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-400" />,
    error: <AlertCircle className="h-5 w-5 text-red-400" />,
    warning: <AlertCircle className="h-5 w-5 text-amber-400" />,
    info: <Info className="h-5 w-5 text-blue-400" />,
  };

  const colors = {
    success: "bg-green-500/10 border-green-500/30",
    error: "bg-red-500/10 border-red-500/30",
    warning: "bg-amber-500/10 border-amber-500/30",
    info: "bg-blue-500/10 border-blue-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-24 right-4 z-50 max-w-sm w-full p-4 rounded-lg shadow-lg backdrop-blur-sm border ${colors[type]}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3 mt-0.5">{icons[type]}</div>
        <div className="flex-1">
          <h4 className="text-white font-medium mb-1">{title}</h4>
          <p className="text-sm text-gray-300">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-300 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}

export default function CodingTestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const skill = searchParams?.get("skill") || "algorithms";
  const levelParam = searchParams?.get("level") || "medium";

  // State variables
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [problem, setProblem] = useState<any>(null);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(LANGUAGES[0].defaultTemplate);
  const [currentDateTime, setCurrentDateTime] = useState("2025-04-05 12:48:58");
  const [username, setUsername] = useState("vkhare2909");
  const [testResults, setTestResults] = useState<any>(null);
  const [output, setOutput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProblemDescriptionOpen, setIsProblemDescriptionOpen] =
    useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [activeTab, setActiveTab] = useState("description");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [passedTests, setPassedTests] = useState(0);
  const [totalTests, setTotalTests] = useState(0);
  const [codeAnalysis, setCodeAnalysis] = useState<any>(null);
  const [solutionStatus, setSolutionStatus] = useState<
    "initial" | "submitting" | "passed" | "failed"
  >("initial");
  const [activeTestTab, setActiveTestTab] = useState("results");
  const [difficulty, setDifficulty] = useState(
    DIFFICULTY_LEVELS.find((level) => level.id === levelParam) ||
      DIFFICULTY_LEVELS[1]
  );
  const [hasCompletedChallenge, setHasCompletedChallenge] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [earnedXP, setEarnedXP] = useState(0);
  const [notification, setNotification] = useState<{
    visible: boolean;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  }>({
    visible: false,
    type: "info",
    title: "",
    message: "",
  });

  const editorRef = useRef<any>(null);

  // Update the current time periodically
  useEffect(() => {
    // Initially set to the specific time
    setCurrentDateTime("2025-04-05 12:48:58");

    // Optional: update it every minute if you want it to be dynamic
    const timer = setInterval(() => {
      const now = new Date();
      // Format as YYYY-MM-DD HH:MM:SS
      const formatted = now.toISOString().slice(0, 19).replace("T", " ");
      setCurrentDateTime(formatted);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;

    // Set editor options
    editor.updateOptions({
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: 14,
      lineHeight: 1.6,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      renderLineHighlight: "all",
      cursorBlinking: "smooth",
      cursorSmoothCaretAnimation: true,
      smoothScrolling: true,
    });
  };

  // Show notification helper
  const showNotification = (
    type: "success" | "error" | "warning" | "info",
    title: string,
    message: string
  ) => {
    // Hide any existing notification first
    setNotification((prev) => ({ ...prev, visible: false }));

    // After a brief delay, show the new notification
    setTimeout(() => {
      setNotification({
        visible: true,
        type,
        title,
        message,
      });

      // Auto-hide after 5 seconds
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, visible: false }));
      }, 5000);
    }, 100);
  };

  // Initialize the problem and timer
  useEffect(() => {
    const fetchProblem = async () => {
      setInitializing(true);
      setIsGenerating(true);
      setErrorMessage(null);

      try {
        // Call the Gemini API to generate a coding problem based on skill and difficulty
        const generatedProblem = await generateCodingProblem(
          skill,
          difficulty.id
        );

        if (!generatedProblem) {
          throw new Error("Failed to generate problem");
        }

        setProblem(generatedProblem);

        if (generatedProblem.testCases && generatedProblem.testCases.length) {
          setTotalTests(generatedProblem.testCases.length);
        }

        // Update document title
        document.title = `${generatedProblem.title} | Coding Challenge`;
      } catch (error: any) {
        console.error("Error fetching problem:", error);
        setErrorMessage(
          error.message || "Failed to generate problem. Please try again."
        );
        showNotification(
          "error",
          "Error Generating Problem",
          "Please try refreshing or selecting a different skill."
        );
      } finally {
        setInitializing(false);
        setLoading(false);
        setIsGenerating(false);
      }
    };

    fetchProblem();

    // Set up the timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [skill, difficulty]);

  // Format time left into MM:SS
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle language change
  const handleLanguageChange = (languageId: string) => {
    const selectedLanguage =
      LANGUAGES.find((lang) => lang.id === languageId) || LANGUAGES[0];

    // Confirm if code has been modified and user wants to switch
    if (code !== language.defaultTemplate) {
      if (confirm("Changing languages will reset your code. Continue?")) {
        setLanguage(selectedLanguage);
        setCode(selectedLanguage.defaultTemplate);
      }
    } else {
      setLanguage(selectedLanguage);
      setCode(selectedLanguage.defaultTemplate);
    }
  };

  // Run the code against test cases
  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("");
    setErrorMessage(null);
    setTestResults(null);

    try {
      if (!code.trim()) {
        throw new Error("Please write some code before running.");
      }

      // Use Gemini to verify visible test cases
      const visibleTestCases = problem.testCases.filter(
        (tc: any) => !tc.isHidden
      );

      const results = await verifyCodeSolution({
        code,
        language: language.id,
        problem,
        testCases: visibleTestCases,
        mode: "run",
      });

      setOutput(results.output);
      setTestResults(results.testResults);

      // Count passed tests
      if (results.testResults) {
        const passed = results.testResults.filter(
          (result: any) => result.passed
        ).length;
        setPassedTests(passed);
      }

      // Show success notification if all visible tests passed
      if (results.testResults?.every((result: any) => result.passed)) {
        showNotification(
          "success",
          "Tests Passed!",
          "All test cases are passing. Ready to submit?"
        );
      }
    } catch (error: any) {
      console.error("Error running code:", error);
      setErrorMessage(
        error.message || "An error occurred while running your code."
      );
      showNotification(
        "error",
        "Error Running Code",
        error.message || "Something went wrong. Please check your code."
      );
    } finally {
      setIsRunning(false);
    }
  };

  // Submit the solution for full verification
  const handleSubmitSolution = async () => {
    setIsSubmitting(true);
    setOutput("");
    setErrorMessage(null);
    setFeedback(null);
    setSolutionStatus("submitting");

    try {
      if (!code.trim()) {
        throw new Error("Please write some code before submitting.");
      }

      // Use Gemini to verify all test cases, including hidden ones
      const results = await verifyCodeSolution({
        code,
        language: language.id,
        problem,
        testCases: problem.testCases,
        mode: "submit",
      });

      setOutput(results.output);
      setTestResults(results.testResults);

      // Count passed tests
      if (results.testResults) {
        const passed = results.testResults.filter(
          (result: any) => result.passed
        ).length;
        setPassedTests(passed);

        // Set completion status
        if (passed === problem.testCases.length) {
          setSolutionStatus("passed");
          setHasCompletedChallenge(true);

          // Calculate XP earned based on difficulty and hints used
          const baseXP = difficulty.xp;
          const hintPenalty = revealedHints.length * 10; // 10% penalty per hint
          const totalXP = Math.max(
            Math.floor(baseXP * (1 - hintPenalty / 100)),
            Math.floor(baseXP * 0.5)
          );

          setEarnedXP(totalXP);

          // Generate code analysis
          analyzeSolutionCode();

          showNotification(
            "success",
            "Challenge Completed! 🎉",
            `You earned ${totalXP} XP! All test cases passed.`
          );

          setFeedback(
            results.feedback ||
              "Great job! You've successfully completed this challenge."
          );
        } else {
          setSolutionStatus("failed");
          setFeedback(
            results.feedback ||
              "Some test cases failed. Try again after reviewing your code."
          );

          showNotification(
            "warning",
            "Almost There",
            `${passed}/${problem.testCases.length} test cases passed.`
          );
        }
      }
    } catch (error: any) {
      console.error("Error submitting solution:", error);
      setErrorMessage(
        error.message || "An error occurred while verifying your solution."
      );
      setSolutionStatus("initial");

      showNotification(
        "error",
        "Error Submitting Solution",
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate a personalized hint using Gemini
  const handleGetHint = async () => {
    setIsChecking(true);
    setErrorMessage(null);

    try {
      if (!code.trim()) {
        throw new Error(
          "Please write some code first to get a personalized hint."
        );
      }

      // Call Gemini API to generate a personalized hint based on current code
      const hint = await generatePersonalizedHint({
        code,
        language: language.id,
        problem,
      });

      if (!hint) {
        throw new Error("Could not generate a hint at this time.");
      }

      setFeedback(hint);

      // Track that user used a personalized hint
      const newRevealedHints = [...revealedHints];
      if (!newRevealedHints.includes(-1)) {
        newRevealedHints.push(-1); // Use -1 to indicate personalized hint
        setRevealedHints(newRevealedHints);
      }
    } catch (error: any) {
      console.error("Error getting hint:", error);
      setErrorMessage(
        error.message || "Could not generate a hint at this time."
      );

      showNotification(
        "error",
        "Error Getting Hint",
        error.message || "Please try again later."
      );
    } finally {
      setIsChecking(false);
    }
  };

  // Reveal a specific hint
  const revealHint = (index: number) => {
    if (problem?.hints && problem.hints[index]) {
      setFeedback(problem.hints[index]);

      // Track revealed hints
      if (!revealedHints.includes(index)) {
        setRevealedHints([...revealedHints, index]);
      }
    }
  };

  // Analyze submitted solution for feedback
  const analyzeSolutionCode = async () => {
    if (!code.trim() || !hasCompletedChallenge) return;

    setIsAnalyzing(true);

    try {
      const analysis = await analyzeSolution({
        code,
        language: language.id,
        problem,
      });

      setCodeAnalysis(analysis);
    } catch (error) {
      console.error("Error analyzing solution:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (errorMessage && !problem) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-900 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700/50 p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Problem Generation Failed
              </h2>
              <p className="text-gray-300 mb-6">{errorMessage}</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="h-5 w-5" />
                  Try Again
                </button>
                <Link
                  href="/skill-assessment"
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back to Assessment
                </Link>
              </div>
            </div>
          </div>

          {/* Footer with time and username */}
          <div className="mt-auto py-4 border-t border-gray-800 bg-gray-900/80">
            <div className="container mx-auto text-center text-sm text-gray-400">
              <p>
                Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted):{" "}
                {currentDateTime}
              </p>
              <p>Current User's Login: {username}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <NoiseBackground />

        {/* Notification - Fixed to NOT be wrapped in a Layout */}
        <AnimatePresence>
          {notification.visible && (
            <Notification
              type={notification.type}
              title={notification.title}
              message={notification.message}
              onClose={() =>
                setNotification((prev) => ({ ...prev, visible: false }))
              }
            />
          )}
        </AnimatePresence>

        <main className="flex-1 flex flex-col pt-20">
          {/* Top bar with challenge info */}
          <div className="bg-gray-800/50 border-b border-gray-700/50 backdrop-blur-md py-3 px-4 sticky top-20 z-30">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center">
                <Link
                  href="/skill-assessment"
                  className="mr-4 p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-400" />
                </Link>

                <div>
                  <div className="flex items-center">
                    <h1 className="text-xl font-bold text-white">
                      {problem?.title || "Loading challenge..."}
                    </h1>
                    <div
                      className={`ml-3 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${difficulty.color} text-white`}
                    >
                      {difficulty.name}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mt-0.5">
                    {skill.charAt(0).toUpperCase() + skill.slice(1)} /{" "}
                    {problem?.category || "General"}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-gray-700/40 rounded-lg p-1.5 text-sm">
                  <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
                  <span className="text-gray-300">{formatTimeLeft()}</span>
                </div>

                <div className="flex items-center">
                  <div className="h-2 bg-gray-700 rounded-full w-32 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      style={{
                        width: totalTests
                          ? `${(passedTests / totalTests) * 100}%`
                          : "0%",
                      }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-300">
                    {passedTests}/{totalTests} Passed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main content area with problem and editor */}
          <div className="flex-1 flex">
            {/* Problem description sidebar */}
            <AnimatePresence initial={false}>
              {isSidebarOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "40%", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800/30 border-r border-gray-700/50 backdrop-blur-sm overflow-auto relative"
                >
                  <div className="sticky top-0 z-10 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700/50 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setActiveTab("description")}
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            activeTab === "description"
                              ? "bg-indigo-500/20 text-indigo-300"
                              : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
                          } transition-colors`}
                        >
                          Description
                        </button>
                        <button
                          onClick={() => setActiveTab("hints")}
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            activeTab === "hints"
                              ? "bg-indigo-500/20 text-indigo-300"
                              : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
                          } transition-colors`}
                        >
                          Hints
                        </button>
                        <button
                          onClick={() => setActiveTab("discussion")}
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            activeTab === "discussion"
                              ? "bg-indigo-500/20 text-indigo-300"
                              : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
                          } transition-colors`}
                        >
                          Discussion
                        </button>
                      </div>

                      <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    {activeTab === "description" && (
                      <div className="prose prose-invert max-w-none">
                        <h2 className="text-xl font-bold text-white">
                          {problem?.title}
                        </h2>

                        <div className="my-4 flex flex-wrap gap-2">
                          <div className="flex items-center text-xs bg-gray-700/40 rounded-full px-3 py-1">
                            <Rocket className="h-3.5 w-3.5 mr-1 text-purple-400" />
                            <span>{problem?.category}</span>
                          </div>
                          <div className="flex items-center text-xs bg-gray-700/40 rounded-full px-3 py-1">
                            <Zap className="h-3.5 w-3.5 mr-1 text-amber-400" />
                            <span>Time: {problem?.timeComplexity}</span>
                          </div>
                          <div className="flex items-center text-xs bg-gray-700/40 rounded-full px-3 py-1">
                            <Server className="h-3.5 w-3.5 mr-1 text-blue-400" />
                            <span>Space: {problem?.spaceComplexity}</span>
                          </div>
                        </div>

                        <div
                          className="mt-6 text-gray-300"
                          dangerouslySetInnerHTML={{
                            __html: problem?.description,
                          }}
                        ></div>

                        <div className="mt-6">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            Constraints:
                          </h3>
                          <ul className="list-disc list-inside space-y-1 text-gray-300">
                            {problem?.constraints?.map(
                              (constraint: string, i: number) => (
                                <li key={i}>{constraint}</li>
                              )
                            )}
                          </ul>
                        </div>

                        <div className="mt-6">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            Examples:
                          </h3>

                          {problem?.examples?.map((example: any, i: number) => (
                            <div key={i} className="mt-4">
                              <div className="bg-gray-800/70 rounded-lg p-4 border border-gray-700/50">
                                <div className="mb-2">
                                  <span className="text-gray-400 font-medium">
                                    Input:
                                  </span>
                                  <code className="ml-2 px-2 py-0.5 rounded bg-gray-700/50 text-gray-200 font-mono">
                                    {example.input}
                                  </code>
                                </div>
                                <div className="mb-2">
                                  <span className="text-gray-400 font-medium">
                                    Output:
                                  </span>
                                  <code className="ml-2 px-2 py-0.5 rounded bg-gray-700/50 text-gray-200 font-mono">
                                    {example.output}
                                  </code>
                                </div>
                                {example.explanation && (
                                  <div>
                                    <span className="text-gray-400 font-medium">
                                      Explanation:
                                    </span>
                                    <p className="mt-1 text-gray-300">
                                      {example.explanation}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === "hints" && (
                      <div>
                        <div className="mb-6 px-4 py-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Lightbulb className="h-5 w-5 text-amber-400 mr-2" />
                            <h3 className="text-lg font-medium text-white">
                              Hint Options
                            </h3>
                          </div>
                          <p className="text-sm text-gray-300">
                            Need help? You can reveal hints below, or get
                            personalized assistance based on your current code.
                          </p>
                        </div>

                        {problem?.hints?.map((hint: string, i: number) => (
                          <div key={i} className="mb-4">
                            <button
                              className={`w-full text-left px-4 py-3 ${
                                revealedHints.includes(i)
                                  ? "bg-indigo-500/10 border-indigo-500/30"
                                  : "bg-gray-800/50 hover:bg-gray-800/80 border-gray-700/50"
                              } rounded-lg border transition-colors`}
                              onClick={() => revealHint(i)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div
                                    className={`w-8 h-8 rounded-full ${
                                      revealedHints.includes(i)
                                        ? "bg-indigo-500/20 text-indigo-300"
                                        : "bg-gray-700/70 text-gray-400"
                                    } flex items-center justify-center font-medium mr-3`}
                                  >
                                    {i + 1}
                                  </div>
                                  <span
                                    className={`${
                                      revealedHints.includes(i)
                                        ? "text-indigo-300"
                                        : "text-gray-300"
                                    } font-medium`}
                                  >
                                    {revealedHints.includes(i)
                                      ? "Hint"
                                      : "Reveal Hint"}{" "}
                                    {i + 1}
                                  </span>
                                </div>
                                {!revealedHints.includes(i) && (
                                  <ChevronRight className="h-5 w-5 text-gray-500" />
                                )}
                              </div>

                              {revealedHints.includes(i) && (
                                <div className="mt-3 pt-3 border-t border-indigo-500/20 text-gray-300">
                                  {hint}
                                </div>
                              )}
                            </button>
                          </div>
                        ))}

                        <div className="mt-8">
                          <button
                            onClick={handleGetHint}
                            disabled={isChecking}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70"
                          >
                            {isChecking ? (
                              <>
                                <RefreshCw className="h-5 w-5 animate-spin" />
                                Gemini is Analyzing Your Code...
                              </>
                            ) : (
                              <>
                                <BrainCircuit className="h-5 w-5" />
                                Get Personalized Hint
                              </>
                            )}
                          </button>

                          <p className="text-xs text-center text-gray-400 mt-2">
                            Note: Using hints will reduce XP earned for this
                            challenge
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === "discussion" && (
                      <div className="space-y-4">
                        {hasCompletedChallenge ? (
                          <>
                            <div className="mb-6 px-4 py-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                              <div className="flex items-center mb-3">
                                <Trophy className="h-5 w-5 text-amber-400 mr-2" />
                                <h3 className="text-lg font-medium text-white">
                                  Solution Stats
                                </h3>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-800/50 rounded-lg p-3">
                                  <div className="text-xs text-gray-400 mb-1">
                                    Time Complexity
                                  </div>
                                  <div className="text-lg text-white font-mono">
                                    {codeAnalysis?.timeComplexity ||
                                      problem?.timeComplexity ||
                                      "O(n)"}
                                  </div>
                                </div>

                                <div className="bg-gray-800/50 rounded-lg p-3">
                                  <div className="text-xs text-gray-400 mb-1">
                                    Space Complexity
                                  </div>
                                  <div className="text-lg text-white font-mono">
                                    {codeAnalysis?.spaceComplexity ||
                                      problem?.spaceComplexity ||
                                      "O(1)"}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 bg-gray-800/50 rounded-lg p-3">
                                <div className="text-xs text-gray-400 mb-1">
                                  XP Earned
                                </div>
                                <div className="flex items-center">
                                  <Sparkles className="h-4 w-4 mr-2 text-amber-400" />
                                  <span className="text-lg text-white font-medium">
                                    {earnedXP} XP
                                  </span>
                                </div>
                              </div>

                              {codeAnalysis && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium text-white mb-2">
                                    Analysis
                                  </h4>
                                  <p className="text-sm text-gray-300">
                                    {codeAnalysis.analysis}
                                  </p>
                                </div>
                              )}
                            </div>

                            {isAnalyzing ? (
                              <div className="text-center py-8">
                                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent"></div>
                                <p className="mt-4 text-gray-400">
                                  Gemini is analyzing your solution...
                                </p>
                              </div>
                            ) : codeAnalysis ? (
                              <div className="space-y-4">
                                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                                  <h4 className="text-lg font-medium text-white mb-3">
                                    Optimization Suggestions
                                  </h4>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        codeAnalysis.optimizationSuggestions,
                                    }}
                                  ></div>
                                </div>

                                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                                  <h4 className="text-lg font-medium text-white mb-3">
                                    Educational Insights
                                  </h4>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: codeAnalysis.educationalInsights,
                                    }}
                                  ></div>
                                </div>

                                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                                  <h4 className="text-lg font-medium text-white mb-3">
                                    Related Problems
                                  </h4>
                                  <ul className="space-y-2">
                                    {codeAnalysis.relatedProblems?.map(
                                      (problem: any, i: number) => (
                                        <li
                                          key={i}
                                          className="flex items-start"
                                        >
                                          <ChevronRight className="h-5 w-5 text-indigo-400 mt-0.5 mr-2 shrink-0" />
                                          <div>
                                            <div className="text-white font-medium">
                                              {problem.title}
                                            </div>
                                            <p className="text-sm text-gray-400">
                                              {problem.description}
                                            </p>
                                          </div>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <p className="text-center text-gray-400 py-6">
                                  Waiting for solution analysis...
                                </p>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="mb-6 px-4 py-3 bg-gray-800/70 border border-gray-700/50 rounded-lg">
                            <p className="text-sm text-gray-300">
                              Discussion and solution analysis will be available
                              after you successfully complete this challenge.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Coding editor and console */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {!isSidebarOpen && (
                <div className="absolute top-32 left-4 z-20">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 rounded-lg bg-gray-800/80 border border-gray-700/50 hover:bg-gray-700/80 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              )}

              {/* Language selector and editor */}
              <div className="flex-1 flex flex-col">
                <div className="bg-gray-800/50 border-b border-gray-700/50 px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => handleLanguageChange(lang.id)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          language.id === lang.id
                            ? "bg-indigo-500/20 text-indigo-300"
                            : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center">
                    <span className="text-xs text-gray-400 mr-2">
                      {username} • {currentDateTime}
                    </span>
                  </div>
                </div>

                {/* Code editor */}
                <div className="flex-1 relative">
                  <Editor
                    height="100%"
                    language={language.id}
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    onMount={handleEditorDidMount}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      wordWrap: "on",
                      tabSize: 2,
                      automaticLayout: true,
                    }}
                  />
                </div>

                {/* Console output and test results */}
                <div className="h-56 border-t border-gray-700/50 bg-gray-900/70 flex flex-col overflow-hidden">
                  <div className="bg-gray-800/80 px-4 py-2 flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setActiveTestTab("results")}
                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                          activeTestTab === "results"
                            ? "bg-gray-700/80 text-white"
                            : "text-gray-400 hover:text-gray-300"
                        }`}
                      >
                        Test Results
                      </button>
                      <button
                        onClick={() => setActiveTestTab("output")}
                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                          activeTestTab === "output"
                            ? "bg-gray-700/80 text-white"
                            : "text-gray-400 hover:text-gray-300"
                        }`}
                      >
                        Console Output
                      </button>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="px-4 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-700/50 text-white rounded-md text-sm font-medium transition-colors flex items-center"
                      >
                        {isRunning ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Running...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Run Code
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleSubmitSolution}
                        disabled={isSubmitting}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-700/50 text-white rounded-md text-sm font-medium transition-colors flex items-center"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Submit
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto p-4 font-mono text-sm">
                    {activeTestTab === "results" ? (
                      <>
                        {testResults ? (
                          <div className="space-y-3">
                            {testResults.map((result: any, index: number) => (
                              <div
                                key={index}
                                className={`p-3 rounded-md ${
                                  result.passed
                                    ? "bg-green-500/10 border border-green-500/30"
                                    : "bg-red-500/10 border border-red-500/30"
                                }`}
                              >
                                <div className="flex items-center mb-2">
                                  {result.passed ? (
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                                  )}
                                  <span
                                    className={`font-medium ${
                                      result.passed
                                        ? "text-green-400"
                                        : "text-red-400"
                                    }`}
                                  >
                                    Test Case {index + 1}{" "}
                                    {result.passed ? "Passed" : "Failed"}
                                  </span>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mt-2 text-xs">
                                  <div>
                                    <div className="text-gray-400 mb-1">
                                      Input:
                                    </div>
                                    <div className="text-gray-300 bg-gray-800/50 p-2 rounded overflow-x-auto">
                                      {result.input}
                                    </div>
                                  </div>

                                  <div>
                                    <div className="text-gray-400 mb-1">
                                      Expected:
                                    </div>
                                    <div className="text-gray-300 bg-gray-800/50 p-2 rounded overflow-x-auto">
                                      {result.expected}
                                    </div>
                                  </div>

                                  <div>
                                    <div className="text-gray-400 mb-1">
                                      Your Output:
                                    </div>
                                    <div
                                      className={`${
                                        result.passed
                                          ? "text-green-300"
                                          : "text-red-300"
                                      } bg-gray-800/50 p-2 rounded overflow-x-auto`}
                                    >
                                      {result.actual}
                                    </div>
                                  </div>
                                </div>

                                {!result.passed && result.error && (
                                  <div className="mt-2 text-red-300 bg-red-900/20 p-2 rounded text-xs">
                                    {result.error}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Terminal className="h-10 w-10 mb-3 text-gray-500" />
                            <p>Run your code to see test results</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {output ? (
                          <div className="text-gray-300 whitespace-pre-wrap">
                            {output}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Terminal className="h-10 w-10 mb-3 text-gray-500" />
                            <p>Console output will appear here</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Feedback panel */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed bottom-6 left-1/2 transform -translate-x-1/2 max-w-2xl w-full mx-auto p-4 bg-gray-800/90 backdrop-blur-md rounded-lg border border-gray-700/50 shadow-xl z-40"
            >
              <div className="flex items-start">
                <div
                  className={`mr-3 mt-1 p-2 rounded-full ${
                    solutionStatus === "passed"
                      ? "bg-green-500/20"
                      : solutionStatus === "failed"
                      ? "bg-amber-500/20"
                      : "bg-indigo-500/20"
                  }`}
                >
                  {solutionStatus === "passed" ? (
                    <Trophy className="h-5 w-5 text-green-400" />
                  ) : solutionStatus === "failed" ? (
                    <AlertCircle className="h-5 w-5 text-amber-400" />
                  ) : (
                    <Lightbulb className="h-5 w-5 text-indigo-400" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3
                      className={`text-lg font-medium ${
                        solutionStatus === "passed"
                          ? "text-green-400"
                          : solutionStatus === "failed"
                          ? "text-amber-400"
                          : "text-indigo-400"
                      }`}
                    >
                      {solutionStatus === "passed"
                        ? "Challenge Completed!"
                        : solutionStatus === "failed"
                        ? "Almost There"
                        : "Hint"}
                    </h3>
                    <button
                      onClick={() => setFeedback(null)}
                      className="p-1 rounded hover:bg-gray-700/50"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>

                  <div className="mt-1 text-gray-300">
                    <TypingAnimation text={feedback} speed={30} />
                  </div>

                  {solutionStatus === "passed" && (
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center bg-black/20 px-3 py-1.5 rounded-lg">
                        <Sparkles className="h-4 w-4 text-amber-400 mr-2" />
                        <span className="text-sm font-medium text-white">
                          {earnedXP} XP Earned
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push("/skill-assessment")}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition-colors"
                        >
                          More Challenges
                        </button>

                        <button
                          onClick={() => setActiveTab("discussion")}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-sm text-white transition-colors flex items-center"
                        >
                          View Analysis
                          <BarChart4 className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer with date and user info */}
        <div className="mt-auto py-4 border-t border-gray-800 bg-gray-900/80">
          <div className="container mx-auto text-center text-sm text-gray-400">
            <p>
              Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted):{" "}
              {currentDateTime}
            </p>
            <p>Current User's Login: {username}</p>
          </div>
        </div>

        {/* Global styles */}
        <style jsx global>{`
          @keyframes shimmer {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }

          @keyframes spin-reverse {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(-360deg);
            }
          }
        `}</style>
      </div>
    </Layout>
  );
}
