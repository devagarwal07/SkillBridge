"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUserAlt,
  FaGraduationCap,
  FaAward,
  FaBriefcase,
  FaFileAlt,
  FaRobot,
  FaDownload,
  FaCheck,
  FaClipboard,
  FaInfoCircle,
  FaChevronDown,
  FaChevronRight,
  FaEye,
  FaPaperPlane,
  FaMagic,
} from "react-icons/fa";
import Head from "next/head";
import { GoogleGenerativeAI } from "@google/generative-ai";
import LoadingSpinner from "../components/ui/LoadingScreen";
import Layout from "../components/layout/Layout";
import Image from "next/image";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

// Template options for letter
const LETTER_TEMPLATES = [
  { id: "formal", name: "Formal Academic", color: "blue" },
  { id: "professional", name: "Professional", color: "purple" },
  { id: "detailed", name: "Detailed Technical", color: "emerald" },
  { id: "concise", name: "Concise Standard", color: "gray" },
];

// Default mentor information
const DEFAULT_MENTOR_INFO = {
  name: "Dr. Richard Thompson",
  title: "Professor of Computer Science",
  designation: "Department Chair",
  affiliation: "Massachusetts Institute of Technology",
  email: "rthompson@mit.edu",
  phone: "(617) 253-1000",
  relationship: "Academic Advisor",
};

type MentorInfo = {
  name: string;
  title: string;
  designation: string;
  affiliation: string;
  email: string;
  phone: string;
  relationship: string;
};

type StudentInfo = {
  name: string;
  id: string;
  program: string;
  targetOpportunity: string;
};

type SkillsAndAchievements = {
  skills: string[];
  projects: string[];
  achievements: string[];
};

type PersonalTraits = {
  traits: string[];
  examples: string[];
};

type RecommendationData = {
  mentorInfo: MentorInfo;
  studentInfo: StudentInfo;
  skillsAndAchievements: SkillsAndAchievements;
  personalTraits: PersonalTraits;
  endorsement: string;
  template: string;
  color: string;
};

type LetterSection = {
  id: string;
  title: string;
  content: string;
  placeholder: string;
  icon: React.ReactNode;
  expanded: boolean;
};

const RecommendationLetterBuilder = () => {
  const [letterData, setLetterData] = useState<RecommendationData>({
    mentorInfo: DEFAULT_MENTOR_INFO,
    studentInfo: {
      name: "",
      id: "",
      program: "",
      targetOpportunity: "",
    },
    skillsAndAchievements: {
      skills: [""],
      projects: [""],
      achievements: [""],
    },
    personalTraits: {
      traits: [""],
      examples: [""],
    },
    endorsement: "",
    template: "formal",
    color: "blue",
  });

  // UI state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [sections, setSections] = useState<LetterSection[]>([
    {
      id: "mentor",
      title: "Mentor Information",
      content: "",
      placeholder: "Your details as the recommender",
      icon: <FaBriefcase />,
      expanded: true,
    },
    {
      id: "student",
      title: "Student Information",
      content: "",
      placeholder: "Details about the student",
      icon: <FaUserAlt />,
      expanded: false,
    },
    {
      id: "skills",
      title: "Skills & Achievements",
      content: "",
      placeholder: "Student's skills, projects, and achievements",
      icon: <FaAward />,
      expanded: false,
    },
    {
      id: "traits",
      title: "Personal Traits & Examples",
      content: "",
      placeholder: "Character traits with supporting examples",
      icon: <FaGraduationCap />,
      expanded: false,
    },
    {
      id: "endorsement",
      title: "Final Endorsement",
      content: "",
      placeholder: "Your final recommendation and confidence in the student",
      icon: <FaFileAlt />,
      expanded: false,
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("mentor");
  const [aiLetter, setAiLetter] = useState<string | null>(null);
  const [processedLetter, setProcessedLetter] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  const previewRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, expanded: !section.expanded }
          : { ...section, expanded: false }
      )
    );
    setActiveSection(sectionId);
  };

  useEffect(() => {
    // Simulate API data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-generate letter when moving to step 2
  useEffect(() => {
    if (currentStep === 2) {
      generateAILetter();
    }
  }, [currentStep]);

  // Process the AI letter to remove signature block
  useEffect(() => {
    if (aiLetter) {
      // Remove any signature block from the AI-generated letter
      let processed = aiLetter;

      // Find common signature markers and remove everything after them
      const signatureMarkers = [
        "Sincerely,",
        "Yours sincerely,",
        "Respectfully,",
        "Regards,",
      ];

      for (const marker of signatureMarkers) {
        const index = processed.indexOf(marker);
        if (index !== -1) {
          processed = processed.substring(0, index);
          break;
        }
      }

      // Replace any remaining placeholders with actual mentor info
      processed = processed
        .replace(/\[Your Name\]/g, letterData.mentorInfo.name)
        .replace(/\[Your Title\]/g, letterData.mentorInfo.title)
        .replace(/\[Your Department\]/g, letterData.mentorInfo.designation)
        .replace(/\[Your Affiliation\]/g, letterData.mentorInfo.affiliation)
        .replace(/\[Your Email Address\]/g, letterData.mentorInfo.email)
        .replace(/\[Your Phone Number\]/g, letterData.mentorInfo.phone)
        .replace(/\[Date\]/g, currentDate)
        .replace(/\[Current Date\]/g, currentDate);

      setProcessedLetter(processed);
    }
  }, [aiLetter, letterData.mentorInfo, currentDate]);

  // Handle mentor info changes
  const handleMentorInfoChange = (field: keyof MentorInfo, value: string) => {
    setLetterData((prev) => ({
      ...prev,
      mentorInfo: {
        ...prev.mentorInfo,
        [field]: value,
      },
    }));
  };

  // Handle student info changes
  const handleStudentInfoChange = (field: keyof StudentInfo, value: string) => {
    setLetterData((prev) => ({
      ...prev,
      studentInfo: {
        ...prev.studentInfo,
        [field]: value,
      },
    }));
  };

  // Handle skills and achievements
  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...letterData.skillsAndAchievements.skills];
    updatedSkills[index] = value;

    setLetterData((prev) => ({
      ...prev,
      skillsAndAchievements: {
        ...prev.skillsAndAchievements,
        skills: updatedSkills,
      },
    }));
  };

  const handleProjectChange = (index: number, value: string) => {
    const updatedProjects = [...letterData.skillsAndAchievements.projects];
    updatedProjects[index] = value;

    setLetterData((prev) => ({
      ...prev,
      skillsAndAchievements: {
        ...prev.skillsAndAchievements,
        projects: updatedProjects,
      },
    }));
  };

  const handleAchievementChange = (index: number, value: string) => {
    const updatedAchievements = [
      ...letterData.skillsAndAchievements.achievements,
    ];
    updatedAchievements[index] = value;

    setLetterData((prev) => ({
      ...prev,
      skillsAndAchievements: {
        ...prev.skillsAndAchievements,
        achievements: updatedAchievements,
      },
    }));
  };

  // Handle personal traits
  const handleTraitChange = (index: number, value: string) => {
    const updatedTraits = [...letterData.personalTraits.traits];
    updatedTraits[index] = value;

    setLetterData((prev) => ({
      ...prev,
      personalTraits: {
        ...prev.personalTraits,
        traits: updatedTraits,
      },
    }));
  };

  const handleExampleChange = (index: number, value: string) => {
    const updatedExamples = [...letterData.personalTraits.examples];
    updatedExamples[index] = value;

    setLetterData((prev) => ({
      ...prev,
      personalTraits: {
        ...prev.personalTraits,
        examples: updatedExamples,
      },
    }));
  };

  // Add/remove functions
  const addSkill = () => {
    setLetterData((prev) => ({
      ...prev,
      skillsAndAchievements: {
        ...prev.skillsAndAchievements,
        skills: [...prev.skillsAndAchievements.skills, ""],
      },
    }));
  };

  const removeSkill = (index: number) => {
    if (letterData.skillsAndAchievements.skills.length <= 1) return;

    const updatedSkills = [...letterData.skillsAndAchievements.skills];
    updatedSkills.splice(index, 1);

    setLetterData((prev) => ({
      ...prev,
      skillsAndAchievements: {
        ...prev.skillsAndAchievements,
        skills: updatedSkills,
      },
    }));
  };

  const addProject = () => {
    setLetterData((prev) => ({
      ...prev,
      skillsAndAchievements: {
        ...prev.skillsAndAchievements,
        projects: [...prev.skillsAndAchievements.projects, ""],
      },
    }));
  };

  const removeProject = (index: number) => {
    if (letterData.skillsAndAchievements.projects.length <= 1) return;

    const updatedProjects = [...letterData.skillsAndAchievements.projects];
    updatedProjects.splice(index, 1);

    setLetterData((prev) => ({
      ...prev,
      skillsAndAchievements: {
        ...prev.skillsAndAchievements,
        projects: updatedProjects,
      },
    }));
  };

  const addAchievement = () => {
    setLetterData((prev) => ({
      ...prev,
      skillsAndAchievements: {
        ...prev.skillsAndAchievements,
        achievements: [...prev.skillsAndAchievements.achievements, ""],
      },
    }));
  };

  const removeAchievement = (index: number) => {
    if (letterData.skillsAndAchievements.achievements.length <= 1) return;

    const updatedAchievements = [
      ...letterData.skillsAndAchievements.achievements,
    ];
    updatedAchievements.splice(index, 1);

    setLetterData((prev) => ({
      ...prev,
      skillsAndAchievements: {
        ...prev.skillsAndAchievements,
        achievements: updatedAchievements,
      },
    }));
  };

  const addTrait = () => {
    setLetterData((prev) => ({
      ...prev,
      personalTraits: {
        ...prev.personalTraits,
        traits: [...prev.personalTraits.traits, ""],
      },
    }));
  };

  const removeTrait = (index: number) => {
    if (letterData.personalTraits.traits.length <= 1) return;

    const updatedTraits = [...letterData.personalTraits.traits];
    updatedTraits.splice(index, 1);

    setLetterData((prev) => ({
      ...prev,
      personalTraits: {
        ...prev.personalTraits,
        traits: updatedTraits,
      },
    }));
  };

  const addExample = () => {
    setLetterData((prev) => ({
      ...prev,
      personalTraits: {
        ...prev.personalTraits,
        examples: [...prev.personalTraits.examples, ""],
      },
    }));
  };

  const removeExample = (index: number) => {
    if (letterData.personalTraits.examples.length <= 1) return;

    const updatedExamples = [...letterData.personalTraits.examples];
    updatedExamples.splice(index, 1);

    setLetterData((prev) => ({
      ...prev,
      personalTraits: {
        ...prev.personalTraits,
        examples: updatedExamples,
      },
    }));
  };

  // Generate AI letter
  const generateAILetter = async () => {
    setIsLoading(true);
    setAiLetter(null);
    setProcessedLetter(null);

    try {
      if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        throw new Error("API key is not configured");
      }

      const letterInput = `
Mentor Information:
Name: ${letterData.mentorInfo.name}
Title: ${letterData.mentorInfo.title}
Designation: ${letterData.mentorInfo.designation}
Affiliation: ${letterData.mentorInfo.affiliation}
Relationship with Student: ${letterData.mentorInfo.relationship}

Student Information:
Name: ${letterData.studentInfo.name || "[Student Name]"}
ID/Roll Number: ${letterData.studentInfo.id || "[Student ID]"}
Current Program: ${letterData.studentInfo.program || "[Student Program]"}
Target Opportunity: ${
        letterData.studentInfo.targetOpportunity || "[Target Opportunity]"
      }

Skills:
${letterData.skillsAndAchievements.skills
  .filter((s) => s)
  .map((s) => `- ${s}`)
  .join("\n")}

Projects:
${letterData.skillsAndAchievements.projects
  .filter((p) => p)
  .map((p) => `- ${p}`)
  .join("\n")}

Achievements:
${letterData.skillsAndAchievements.achievements
  .filter((a) => a)
  .map((a) => `- ${a}`)
  .join("\n")}

Personal Traits:
${letterData.personalTraits.traits
  .filter((t) => t)
  .map(
    (t, i) =>
      `- ${t}${
        letterData.personalTraits.examples[i]
          ? ` (Example: ${letterData.personalTraits.examples[i]})`
          : ""
      }`
  )
  .join("\n")}

Final Endorsement:
${letterData.endorsement}

Letter Style: ${letterData.template}
Current Date: ${currentDate}
      `;

      const detailedPrompt = `
Please write a formal letter of recommendation for a student based on the following information:

${letterInput}

The letter should:
1. Begin with the current date (${currentDate})
2. Use "To Whom It May Concern:" as the salutation
3. Have an introduction paragraph stating who you are and your relationship with the student
4. Discuss the student's skills and achievements with specific examples
5. Highlight the student's personal traits with supporting evidence
6. Include a strong endorsement for the specific opportunity they're applying for
7. End with "Sincerely," but DO NOT include any signature, name, title, or contact information after "Sincerely,"

The tone should be formal, enthusiastic, and supportive. Use professional language and formatting with clear paragraphs.
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: detailedPrompt.trim() }] }],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Gemini API request failed: ${
            errorData?.error?.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      const aiResponseContent =
        data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiResponseContent) {
        throw new Error("No content returned from Gemini AI.");
      }

      setAiLetter(aiResponseContent);
      setCurrentStep(3);
    } catch (error: any) {
      console.error("Error generating AI letter:", error);
      alert(`Failed to generate AI letter: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Export letter as PDF
  const exportLetter = () => {
    if (!previewRef.current) return;
    alert("Letter export functionality would generate a PDF here.");
  };

  // Copy letter to clipboard
  const copyToClipboard = () => {
    if (!processedLetter) return;

    // Get the full letter including the signature
    const signatureBlock = `
Sincerely,

Dr. Richard Thompson
Professor of Computer Science
Department Chair
Massachusetts Institute of Technology
rthompson@mit.edu
(617) 253-1000

MIT Faculty ID: 7851249
Member, American Association for the Advancement of Science
Fellow, Association for Computing Machinery
IEEE Senior Member since 2015
    `;

    navigator.clipboard.writeText(processedLetter + signatureBlock);
    alert("Letter copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Layout>
        <Head>
          <title>Recommendation Letter Generator | UpSkillr</title>
          <meta
            name="description"
            content="Create professional letters of recommendation with AI assistance"
          />
        </Head>

        <div className="min-h-screen bg-gray-900 pb-20 pt-24">
          <div className="container mx-auto px-4">
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Letter of Recommendation Builder
              </h1>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Create a professional, detailed letter of recommendation for
                your student or colleague, customized for their specific
                opportunity and enhanced with AI assistance.
              </p>
            </div>

            {/* Step indicator */}
            <div className="mb-10 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                        currentStep >= step
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20"
                          : "bg-gray-800 text-gray-400 border border-gray-700"
                      }`}
                    >
                      {currentStep > step ? <FaCheck /> : step}
                    </div>
                    <div className="text-xs font-medium text-gray-400">
                      {step === 1 && "Letter Details"}
                      {step === 2 && "Template & Style"}
                      {step === 3 && "Export"}
                    </div>
                  </div>
                ))}

                {/* Progress lines between steps */}
                <div className="absolute left-0 right-0 flex justify-center -z-10">
                  <div className="h-0.5 bg-gray-700 w-3/4 max-w-3xl"></div>
                </div>
              </div>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main form area */}
              <div
                className={`lg:col-span-${
                  showPreview ? "6" : "12"
                } bg-gray-800/30 backdrop-blur-md border border-gray-700/50 rounded-xl p-6 shadow-lg`}
              >
                {/* Step 1: Letter Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">Letter Details</h2>
                    </div>

                    {/* Sections accordion */}
                    <div className="space-y-3">
                      {/* Mentor Information */}
                      <div className="border border-gray-700 rounded-lg overflow-hidden">
                        <button
                          className={`w-full flex justify-between items-center p-4 text-left font-medium transition-colors ${
                            sections[0].expanded
                              ? "bg-blue-500/20 text-blue-100"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                          onClick={() => toggleSection("mentor")}
                        >
                          <div className="flex items-center">
                            <FaBriefcase className="mr-3 text-blue-400" />
                            <span>Mentor Information</span>
                          </div>
                          {sections[0].expanded ? (
                            <FaChevronDown />
                          ) : (
                            <FaChevronRight />
                          )}
                        </button>

                        {sections[0].expanded && (
                          <div className="p-5 border-t border-gray-700 bg-gray-800/50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                  Full Name
                                </label>
                                <input
                                  type="text"
                                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={letterData.mentorInfo.name}
                                  onChange={(e) =>
                                    handleMentorInfoChange(
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Prof. Jane Smith"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={letterData.mentorInfo.title}
                                  onChange={(e) =>
                                    handleMentorInfoChange(
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Associate Professor"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                  Designation
                                </label>
                                <input
                                  type="text"
                                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={letterData.mentorInfo.designation}
                                  onChange={(e) =>
                                    handleMentorInfoChange(
                                      "designation",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Head of Computer Science Department"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                  Affiliation
                                </label>
                                <input
                                  type="text"
                                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={letterData.mentorInfo.affiliation}
                                  onChange={(e) =>
                                    handleMentorInfoChange(
                                      "affiliation",
                                      e.target.value
                                    )
                                  }
                                  placeholder="University of Technology"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                  Email
                                </label>
                                <input
                                  type="email"
                                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={letterData.mentorInfo.email}
                                  onChange={(e) =>
                                    handleMentorInfoChange(
                                      "email",
                                      e.target.value
                                    )
                                  }
                                  placeholder="jsmith@university.edu"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                  Phone
                                </label>
                                <input
                                  type="tel"
                                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={letterData.mentorInfo.phone}
                                  onChange={(e) =>
                                    handleMentorInfoChange(
                                      "phone",
                                      e.target.value
                                    )
                                  }
                                  placeholder="(555) 123-4567"
                                />
                              </div>

                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                  Relationship with Student
                                </label>
                                <input
                                  type="text"
                                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={letterData.mentorInfo.relationship}
                                  onChange={(e) =>
                                    handleMentorInfoChange(
                                      "relationship",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Thesis Advisor, Project Mentor, etc."
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Student Information */}
                      <div className="border border-gray-700 rounded-lg overflow-hidden">
                        <button
                          className={`w-full flex justify-between items-center p-4 text-left font-medium transition-colors ${
                            sections[1].expanded
                              ? "bg-blue-500/20 text-blue-100"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                          onClick={() => toggleSection("student")}
                        >
                          <div className="flex items-center">
                            <FaUserAlt className="mr-3 text-blue-400" />
                            <span>Student Information</span>
                          </div>
                          {sections[1].expanded ? (
                            <FaChevronDown />
                          ) : (
                            <FaChevronRight />
                          )}
                        </button>

                        {sections[1].expanded && (
                          <div className="p-5 border-t border-gray-700 bg-gray-800/50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                  Full Name
                                </label>
                                <input
                                  type="text"
                                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={letterData.studentInfo.name}
                                  onChange={(e) =>
                                    handleStudentInfoChange(
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  placeholder="John Doe"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                  ID/Roll Number
                                </label>
                                <input
                                  type="text"
                                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={letterData.studentInfo.id}
                                  onChange={(e) =>
                                    handleStudentInfoChange(
                                      "id",
                                      e.target.value
                                    )
                                  }
                                  placeholder="123456789"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                  Current Program/Position
                                </label>
                                <input
                                  type="text"
                                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={letterData.studentInfo.program}
                                  onChange={(e) =>
                                    handleStudentInfoChange(
                                      "program",
                                      e.target.value
                                    )
                                  }
                                  placeholder="BS in Computer Science"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                  Target Opportunity
                                </label>
                                <input
                                  type="text"
                                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={
                                    letterData.studentInfo.targetOpportunity
                                  }
                                  onChange={(e) =>
                                    handleStudentInfoChange(
                                      "targetOpportunity",
                                      e.target.value
                                    )
                                  }
                                  placeholder="MS in Computer Science at Stanford University"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Skills & Achievements */}
                      <div className="border border-gray-700 rounded-lg overflow-hidden">
                        <button
                          className={`w-full flex justify-between items-center p-4 text-left font-medium transition-colors ${
                            sections[2].expanded
                              ? "bg-blue-500/20 text-blue-100"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                          onClick={() => toggleSection("skills")}
                        >
                          <div className="flex items-center">
                            <FaAward className="mr-3 text-blue-400" />
                            <span>Skills & Achievements</span>
                          </div>
                          {sections[2].expanded ? (
                            <FaChevronDown />
                          ) : (
                            <FaChevronRight />
                          )}
                        </button>

                        {sections[2].expanded && (
                          <div className="p-5 border-t border-gray-700 bg-gray-800/50">
                            {/* Skills */}
                            <div className="mb-6">
                              <label className="block text-sm font-medium text-gray-400 mb-2">
                                Key Skills
                              </label>
                              <div className="space-y-2">
                                {letterData.skillsAndAchievements.skills.map(
                                  (skill, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center"
                                    >
                                      <input
                                        type="text"
                                        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={skill}
                                        onChange={(e) =>
                                          handleSkillChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                        placeholder="e.g., Machine Learning, Problem Solving, Leadership"
                                      />
                                      {letterData.skillsAndAchievements.skills
                                        .length > 1 && (
                                        <button
                                          className="text-red-400 hover:text-red-300 ml-2"
                                          onClick={() => removeSkill(index)}
                                        >
                                          ✕
                                        </button>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                              <button
                                className="mt-3 p-2 rounded-lg border border-dashed border-gray-600 hover:border-blue-400 text-gray-400 hover:text-blue-400 transition-colors flex items-center justify-center"
                                onClick={addSkill}
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                                Add Another Skill
                              </button>
                            </div>

                            {/* Projects */}
                            <div className="mb-6">
                              <label className="block text-sm font-medium text-gray-400 mb-2">
                                Projects Worked On
                              </label>
                              <div className="space-y-2">
                                {letterData.skillsAndAchievements.projects.map(
                                  (project, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center"
                                    >
                                      <input
                                        type="text"
                                        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={project}
                                        onChange={(e) =>
                                          handleProjectChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                        placeholder="e.g., Developed a machine learning model for..."
                                      />
                                      {letterData.skillsAndAchievements.projects
                                        .length > 1 && (
                                        <button
                                          className="text-red-400 hover:text-red-300 ml-2"
                                          onClick={() => removeProject(index)}
                                        >
                                          ✕
                                        </button>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                              <button
                                className="mt-3 p-2 rounded-lg border border-dashed border-gray-600 hover:border-blue-400 text-gray-400 hover:text-blue-400 transition-colors flex items-center justify-center"
                                onClick={addProject}
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                                Add Another Project
                              </button>
                            </div>

                            {/* Achievements */}
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-2">
                                Key Achievements
                              </label>
                              <div className="space-y-2">
                                {letterData.skillsAndAchievements.achievements.map(
                                  (achievement, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center"
                                    >
                                      <input
                                        type="text"
                                        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={achievement}
                                        onChange={(e) =>
                                          handleAchievementChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                        placeholder="e.g., First prize in university-level hackathon"
                                      />
                                      {letterData.skillsAndAchievements
                                        .achievements.length > 1 && (
                                        <button
                                          className="text-red-400 hover:text-red-300 ml-2"
                                          onClick={() =>
                                            removeAchievement(index)
                                          }
                                        >
                                          ✕
                                        </button>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                              <button
                                className="mt-3 p-2 rounded-lg border border-dashed border-gray-600 hover:border-blue-400 text-gray-400 hover:text-blue-400 transition-colors flex items-center justify-center"
                                onClick={addAchievement}
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                                Add Another Achievement
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Personal Traits */}
                      <div className="border border-gray-700 rounded-lg overflow-hidden">
                        <button
                          className={`w-full flex justify-between items-center p-4 text-left font-medium transition-colors ${
                            sections[3].expanded
                              ? "bg-blue-500/20 text-blue-100"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                          onClick={() => toggleSection("traits")}
                        >
                          <div className="flex items-center">
                            <FaGraduationCap className="mr-3 text-blue-400" />
                            <span>Personal Traits</span>
                          </div>
                          {sections[3].expanded ? (
                            <FaChevronDown />
                          ) : (
                            <FaChevronRight />
                          )}
                        </button>

                        {sections[3].expanded && (
                          <div className="p-5 border-t border-gray-700 bg-gray-800/50">
                            {letterData.personalTraits.traits.map(
                              (trait, index) => (
                                <div
                                  key={index}
                                  className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700"
                                >
                                  <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-medium">
                                      Trait {index + 1}
                                    </h3>
                                    {letterData.personalTraits.traits.length >
                                      1 && (
                                      <button
                                        className="text-red-400 hover:text-red-300 text-sm"
                                        onClick={() => removeTrait(index)}
                                      >
                                        Remove
                                      </button>
                                    )}
                                  </div>

                                  <div className="space-y-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-400 mb-1">
                                        Personal Trait
                                      </label>
                                      <input
                                        type="text"
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={trait}
                                        onChange={(e) =>
                                          handleTraitChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                        placeholder="e.g., Leadership, Problem-solving, Teamwork"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium text-gray-400 mb-1">
                                        Example/Evidence
                                      </label>
                                      <textarea
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                                        value={
                                          letterData.personalTraits.examples[
                                            index
                                          ] || ""
                                        }
                                        onChange={(e) =>
                                          handleExampleChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                        placeholder="Provide a specific example that demonstrates this trait"
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}

                            <button
                              className="w-full p-2 rounded-lg border border-dashed border-gray-600 hover:border-blue-400 text-gray-400 hover:text-blue-400 transition-colors flex items-center justify-center"
                              onClick={addTrait}
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                              Add Another Trait
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Final Endorsement */}
                      <div className="border border-gray-700 rounded-lg overflow-hidden">
                        <button
                          className={`w-full flex justify-between items-center p-4 text-left font-medium transition-colors ${
                            sections[4].expanded
                              ? "bg-blue-500/20 text-blue-100"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                          onClick={() => toggleSection("endorsement")}
                        >
                          <div className="flex items-center">
                            <FaFileAlt className="mr-3 text-blue-400" />
                            <span>Final Endorsement</span>
                          </div>
                          {sections[4].expanded ? (
                            <FaChevronDown />
                          ) : (
                            <FaChevronRight />
                          )}
                        </button>

                        {sections[4].expanded && (
                          <div className="p-5 border-t border-gray-700 bg-gray-800/50">
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">
                                Your Final Recommendation
                              </label>
                              <textarea
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                                value={letterData.endorsement}
                                onChange={(e) =>
                                  setLetterData((prev) => ({
                                    ...prev,
                                    endorsement: e.target.value,
                                  }))
                                }
                                placeholder="I strongly endorse [Student Name] for [Program/Opportunity]. Based on their performance, I am confident they will excel in this program and make significant contributions."
                              ></textarea>
                              <div className="mt-2 text-xs flex items-center text-gray-400">
                                <FaInfoCircle className="mr-1" />
                                <span>
                                  Be specific about your level of recommendation
                                  (e.g., highest recommendation, strongly
                                  recommend, etc.)
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between mt-8">
                      <button className="px-6 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors">
                        Save Draft
                      </button>
                      <button
                        className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-colors shadow-lg shadow-blue-500/20"
                        onClick={() => setCurrentStep(2)}
                      >
                        Next: Template & Style
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Template & Style */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">
                        Template & Style
                      </h2>
                    </div>

                    <div className="p-5 border border-gray-700 rounded-lg bg-gray-800/50">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-3">
                          Choose Letter Template
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {LETTER_TEMPLATES.map((template) => (
                            <div key={template.id} className="relative">
                              <input
                                type="radio"
                                id={`template-${template.id}`}
                                name="template"
                                className="hidden peer"
                                checked={letterData.template === template.id}
                                onChange={() =>
                                  setLetterData((prev) => ({
                                    ...prev,
                                    template: template.id,
                                    color: template.color,
                                  }))
                                }
                              />
                              <label
                                htmlFor={`template-${template.id}`}
                                className={`block p-3 border rounded-lg cursor-pointer transition-all ${
                                  letterData.template === template.id
                                    ? `border-${template.color}-500 bg-${template.color}-500/20`
                                    : "border-gray-700 bg-gray-800 hover:bg-gray-700"
                                }`}
                              >
                                <div className="h-20 mb-2 bg-gray-900 rounded flex items-center justify-center overflow-hidden">
                                  <div
                                    className={`w-8 h-8 rounded-full bg-gradient-to-r from-${
                                      template.color
                                    }-500 to-${
                                      template.color === "blue"
                                        ? "purple"
                                        : template.color === "purple"
                                        ? "pink"
                                        : "teal"
                                    }-600`}
                                  ></div>
                                </div>
                                <div className="text-xs text-center font-medium">
                                  {template.name}
                                </div>

                                {letterData.template === template.id && (
                                  <div className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full bg-blue-500 text-white">
                                    <FaCheck size={10} />
                                  </div>
                                )}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-sm font-medium text-gray-400 mb-3">
                          Template Preview
                        </h3>
                        <div className="p-6 bg-white text-black rounded-lg">
                          <div className="mb-6">
                            <div className="text-gray-700 mb-2">
                              {currentDate}
                            </div>
                            <div className="font-medium">
                              To Whom It May Concern,
                            </div>
                          </div>
                          <div className="text-sm mb-4">
                            {letterData.template === "formal" ? (
                              <p className="mb-2">
                                I am writing this letter to recommend{" "}
                                {letterData.studentInfo.name ||
                                  "[Student Name]"}{" "}
                                for{" "}
                                {letterData.studentInfo.targetOpportunity ||
                                  "[Program]"}
                                . As {letterData.mentorInfo.relationship}, I
                                have had the opportunity to observe their
                                academic performance and personal qualities.
                              </p>
                            ) : letterData.template === "professional" ? (
                              <p className="mb-2">
                                It is with great enthusiasm that I recommend{" "}
                                {letterData.studentInfo.name ||
                                  "[Student Name]"}{" "}
                                for{" "}
                                {letterData.studentInfo.targetOpportunity ||
                                  "[Program]"}
                                . In my capacity as{" "}
                                {letterData.mentorInfo.relationship}, I have
                                witnessed their professional growth and
                                achievements.
                              </p>
                            ) : letterData.template === "detailed" ? (
                              <p className="mb-2">
                                I am pleased to provide this detailed
                                recommendation for{" "}
                                {letterData.studentInfo.name ||
                                  "[Student Name]"}
                                , who is applying for{" "}
                                {letterData.studentInfo.targetOpportunity ||
                                  "[Program]"}
                                . Having worked closely with them as their{" "}
                                {letterData.mentorInfo.relationship}, I can
                                attest to their exceptional abilities.
                              </p>
                            ) : (
                              <p className="mb-2">
                                I am writing to recommend{" "}
                                {letterData.studentInfo.name ||
                                  "[Student Name]"}{" "}
                                for{" "}
                                {letterData.studentInfo.targetOpportunity ||
                                  "[Program]"}
                                . I have known the applicant as their{" "}
                                {letterData.mentorInfo.relationship} and can
                                confidently speak to their qualifications.
                              </p>
                            )}
                            <p className="opacity-50">
                              {isLoading
                                ? "Generating letter with AI assistance..."
                                : "Full letter will be generated with AI assistance..."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-8">
                      <button
                        className="px-6 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                        onClick={() => setCurrentStep(1)}
                      >
                        Previous
                      </button>
                      <button
                        className={`px-6 py-2.5 rounded-lg flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-colors shadow-lg shadow-blue-500/20 ${
                          isLoading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                        onClick={() => setCurrentStep(3)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>Next: Export Letter</>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Export */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">
                      Export Your Letter
                    </h2>

                    <div className="p-6 border border-gray-700 rounded-lg bg-gray-800/50">
                      <h3 className="font-medium mb-4">
                        Choose Export Options
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="p-4 border border-gray-700 rounded-lg bg-gray-900/50 cursor-pointer hover:border-blue-500/50 transition-all"
                          onClick={exportLetter}
                        >
                          <div className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                              <FaDownload className="text-blue-400" />
                            </div>
                            <div>
                              <h4 className="font-medium">Download as PDF</h4>
                              <p className="text-sm text-gray-400">
                                Get a professionally formatted PDF for
                                submission
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="p-4 border border-gray-700 rounded-lg bg-gray-900/50 cursor-pointer hover:border-purple-500/50 transition-all"
                          onClick={copyToClipboard}
                        >
                          <div className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                              <FaClipboard className="text-purple-400" />
                            </div>
                            <div>
                              <h4 className="font-medium">Copy to Clipboard</h4>
                              <p className="text-sm text-gray-400">
                                Plain text format for easy editing
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          className="p-4 border border-gray-700 rounded-lg bg-gray-900/50 cursor-pointer hover:border-emerald-500/50 transition-all"
                        >
                          <div className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
                              <FaMagic className="text-emerald-400" />
                            </div>
                            <div>
                              <h4 className="font-medium">Download as DOCX</h4>
                              <p className="text-sm text-gray-400">
                                Editable Word document format
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          className="p-4 border border-gray-700 rounded-lg bg-gray-900/50 cursor-pointer hover:border-amber-500/50 transition-all"
                        >
                          <div className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
                              <FaPaperPlane className="text-amber-400" />
                            </div>
                            <div>
                              <h4 className="font-medium">Email Letter</h4>
                              <p className="text-sm text-gray-400">
                                Send directly to admissions office
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      <div className="mt-6 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                        <h4 className="font-medium mb-2 flex items-center">
                          <FaInfoCircle className="mr-2 text-blue-400" />
                          Recommendation Letter Best Practices
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                          <li className="flex items-start">
                            <div className="text-blue-400 mr-2">•</div>
                            <div>
                              Sign the letter by hand if submitting a physical
                              copy
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="text-blue-400 mr-2">•</div>
                            <div>
                              Follow the institution's specific submission
                              guidelines
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="text-blue-400 mr-2">•</div>
                            <div>
                              Keep a copy of the letter for your records
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="text-blue-400 mr-2">•</div>
                            <div>
                              Submit before the deadline to ensure consideration
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-between mt-8">
                      <button
                        className="px-6 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                        onClick={() => setCurrentStep(2)}
                      >
                        Previous
                      </button>
                      <button
                        className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white transition-colors shadow-lg shadow-green-500/20"
                        onClick={() =>
                          alert(
                            "Thank you for using the Letter of Recommendation Generator!"
                          )
                        }
                      >
                        Finish
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview panel */}
              {showPreview && (
                <div className="lg:col-span-6 bg-gray-800/30 backdrop-blur-md border border-gray-700/50 rounded-xl p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Letter Preview</h2>
                  </div>

                  <div
                    ref={previewRef}
                    className="bg-white text-black rounded-lg p-8 shadow-xl max-h-[800px] overflow-y-auto relative"
                    style={{
                      fontFamily:
                        letterData.template === "formal"
                          ? "Georgia, serif"
                          : letterData.template === "professional"
                          ? "Arial, sans-serif"
                          : letterData.template === "detailed"
                          ? "Garamond, serif"
                          : "Helvetica, Arial, sans-serif",
                    }}
                  >
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                      <div className="rotate-[-30deg] border-4 border-blue-500 rounded-lg p-3">
                        <span className="text-4xl font-bold text-blue-700">
                          VERIFIED
                        </span>
                      </div>
                    </div>

                    {/* Letter Content */}
                    {!processedLetter ? (
                      <>
                        {/* Introduction */}
                        <div className="mb-4">
                          <div className="text-right mb-6">
                            <div className="text-gray-700 mb-2">
                              {currentDate}
                            </div>
                          </div>
                          <div className="mb-6">
                            <div className="font-medium">
                              To Whom It May Concern:
                            </div>
                          </div>

                          <p>
                            {letterData.template === "formal" ? (
                              <>
                                I am writing this letter to recommend{" "}
                                {letterData.studentInfo.name ||
                                  "[Student Name]"}{" "}
                                for{" "}
                                {letterData.studentInfo.targetOpportunity ||
                                  "[Target Opportunity]"}
                                . As{" "}
                                {letterData.mentorInfo.relationship ||
                                  DEFAULT_MENTOR_INFO.relationship}
                                , I have had the opportunity to observe their
                                academic performance and personal qualities.
                              </>
                            ) : letterData.template === "professional" ? (
                              <>
                                It is with great enthusiasm that I recommend{" "}
                                {letterData.studentInfo.name ||
                                  "[Student Name]"}{" "}
                                for{" "}
                                {letterData.studentInfo.targetOpportunity ||
                                  "[Target Opportunity]"}
                                . In my capacity as{" "}
                                {letterData.mentorInfo.relationship ||
                                  DEFAULT_MENTOR_INFO.relationship}
                                , I have witnessed their professional growth and
                                achievements.
                              </>
                            ) : letterData.template === "detailed" ? (
                              <>
                                I am pleased to provide this detailed
                                recommendation for{" "}
                                {letterData.studentInfo.name ||
                                  "[Student Name]"}
                                , who is applying for{" "}
                                {letterData.studentInfo.targetOpportunity ||
                                  "[Target Opportunity]"}
                                . Having worked closely with them as their{" "}
                                {letterData.mentorInfo.relationship ||
                                  DEFAULT_MENTOR_INFO.relationship}
                                , I can attest to their exceptional abilities.
                              </>
                            ) : (
                              <>
                                I am writing to recommend{" "}
                                {letterData.studentInfo.name ||
                                  "[Student Name]"}{" "}
                                for{" "}
                                {letterData.studentInfo.targetOpportunity ||
                                  "[Target Opportunity]"}
                                . I have known the applicant as their{" "}
                                {letterData.mentorInfo.relationship ||
                                  DEFAULT_MENTOR_INFO.relationship}{" "}
                                and can confidently speak to their
                                qualifications.
                              </>
                            )}
                          </p>
                        </div>

                        {/* Placeholder for skills, achievements, traits */}
                        <div className="space-y-3 text-gray-600 italic">
                          {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="animate-pulse flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-b-blue-700 border-l-transparent border-r-transparent animate-spin"></div>
                                <p className="mt-4 text-blue-600">
                                  Generating letter with AI...
                                </p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p>
                                [Details about skills, achievements, and
                                personal traits will appear in the AI-generated
                                letter]
                              </p>
                              <p>
                                [Your final endorsement will be included here]
                              </p>
                            </>
                          )}
                        </div>

                        {/* Signature */}
                        <div className="mt-12 pt-4">
                          <p>Sincerely,</p>
                          <div className="my-8">
                            <div
                              className="font-cursive text-3xl text-blue-800"
                              style={{ fontFamily: "cursive" }}
                            >
                              Richard Thompson
                            </div>
                          </div>
                          <div className="font-bold">
                            {letterData.mentorInfo.name ||
                              DEFAULT_MENTOR_INFO.name}
                          </div>
                          <div>
                            {letterData.mentorInfo.title ||
                              DEFAULT_MENTOR_INFO.title}
                          </div>
                          <div>
                            {letterData.mentorInfo.designation ||
                              DEFAULT_MENTOR_INFO.designation}
                          </div>
                          <div>
                            {letterData.mentorInfo.affiliation ||
                              DEFAULT_MENTOR_INFO.affiliation}
                          </div>
                          <div>
                            {letterData.mentorInfo.email ||
                              DEFAULT_MENTOR_INFO.email}
                          </div>
                          <div>
                            {letterData.mentorInfo.phone ||
                              DEFAULT_MENTOR_INFO.phone}
                          </div>
                          <div className="mt-4 text-sm text-gray-500">
                            <div>MIT Faculty ID: 7851249</div>
                            <div>
                              Member, American Association for the Advancement
                              of Science
                            </div>
                            <div>
                              Fellow, Association for Computing Machinery
                            </div>
                            <div>IEEE Senior Member since 2015</div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* AI generated letter content */}
                        <div
                          dangerouslySetInnerHTML={{
                            __html: processedLetter.replace(/\n/g, "<br/>"),
                          }}
                        />

                        {/* Signature section */}
                        <div className="mt-12 pt-4">
                          <p>Sincerely,</p>
                          <div className="my-8">
                            <div
                              className="font-cursive text-3xl text-blue-800"
                              style={{ fontFamily: "cursive" }}
                            >
                              Richard Thompson
                            </div>
                          </div>
                          <div className="font-bold">
                            {letterData.mentorInfo.name ||
                              DEFAULT_MENTOR_INFO.name}
                          </div>
                          <div>
                            {letterData.mentorInfo.title ||
                              DEFAULT_MENTOR_INFO.title}
                          </div>
                          <div>
                            {letterData.mentorInfo.designation ||
                              DEFAULT_MENTOR_INFO.designation}
                          </div>
                          <div>
                            {letterData.mentorInfo.affiliation ||
                              DEFAULT_MENTOR_INFO.affiliation}
                          </div>
                          <div>
                            {letterData.mentorInfo.email ||
                              DEFAULT_MENTOR_INFO.email}
                          </div>
                          <div>
                            {letterData.mentorInfo.phone ||
                              DEFAULT_MENTOR_INFO.phone}
                          </div>
                          <div className="mt-4 text-sm text-gray-500">
                            <div>MIT Faculty ID: 7851249</div>
                            <div>
                              Member, American Association for the Advancement
                              of Science
                            </div>
                            <div>
                              Fellow, Association for Computing Machinery
                            </div>
                            <div>IEEE Senior Member since 2015</div>
                            <div>Date: {currentDate}</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default RecommendationLetterBuilder;
