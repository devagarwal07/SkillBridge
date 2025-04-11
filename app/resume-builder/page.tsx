"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaFileAlt,
  FaBriefcase,
  FaGraduationCap,
  FaTools,
  FaUserAlt,
  FaRobot,
  FaMagic,
  FaDownload,
  FaCheck,
  FaClipboard,
  FaInfoCircle,
  FaChevronDown,
  FaChevronRight,
  FaPalette,
  FaEye,
} from "react-icons/fa";
import Head from "next/head";
import { GoogleGenerativeAI } from "@google/generative-ai";
import LoadingSpinner from "../components/ui/LoadingScreen";
import Layout from "../components/layout/Layout";
// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

// Template options for resume
const RESUME_TEMPLATES = [
  { id: "modern", name: "Modern Professional", color: "blue" },
  { id: "classic", name: "Classic Elegant", color: "purple" },
  { id: "creative", name: "Creative Bold", color: "emerald" },
  { id: "minimal", name: "Minimal Clean", color: "gray" },
];

// Sample job titles for autocomplete
const JOB_TITLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Product Manager",
  "UX Designer",
  "Data Scientist",
  "DevOps Engineer",
  "Cloud Architect",
  "Machine Learning Engineer",
];

type ResumeSection = {
  id: string;
  title: string;
  content: string;
  placeholder: string;
  icon: React.ReactNode;
  expanded: boolean;
};

type WorkExperience = {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
};

type Education = {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
};

type ResumeData = {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedIn: string;
    website: string;
  };
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
  targetJobTitle: string;
  template: string;
  color: string;
};

type AIFeedback = {
  score: number;
  suggestions: {
    section: string;
    feedback: string;
    improvement: string;
  }[];
  keywordMatches: {
    matched: string[];
    missing: string[];
  };
};

const ResumeBuilder = () => {
  // Main resume data
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      linkedIn: "",
      website: "",
    },
    summary: "",
    workExperience: [
      {
        id: "1",
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
        highlights: [""],
      },
    ],
    education: [
      {
        id: "1",
        degree: "",
        institution: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    skills: [""],
    targetJobTitle: "",
    template: "modern",
    color: "blue",
  });

  // UI state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [sections, setSections] = useState<ResumeSection[]>([
    {
      id: "personal",
      title: "Personal Information",
      content: "",
      placeholder: "Your basic contact information",
      icon: <FaUserAlt />,
      expanded: true,
    },
    {
      id: "summary",
      title: "Professional Summary",
      content: resumeData.summary,
      placeholder:
        "A brief overview of your professional background and objectives",
      icon: <FaFileAlt />,
      expanded: false,
    },
    {
      id: "experience",
      title: "Work Experience",
      content: "",
      placeholder: "Your relevant work history",
      icon: <FaBriefcase />,
      expanded: false,
    },
    {
      id: "education",
      title: "Education",
      content: "",
      placeholder: "Your academic background",
      icon: <FaGraduationCap />,
      expanded: false,
    },
    {
      id: "skills",
      title: "Skills",
      content: "",
      placeholder: "Technical and soft skills relevant to your target position",
      icon: <FaTools />,
      expanded: false,
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("personal");
  const [aiFeedback, setAIFeedback] = useState<AIFeedback | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [jobDescriptionText, setJobDescriptionText] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const previewRef = useRef<HTMLDivElement>(null);

  // Handle section expansion toggle
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
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Add new work experience entry
  const addWorkExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        {
          id: `work-${Date.now()}`,
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
          highlights: [""],
        },
      ],
    }));
  };

  // Add new education entry
  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: `edu-${Date.now()}`,
          degree: "",
          institution: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
  };

  // Add new skill
  const addSkill = () => {
    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, ""],
    }));
  };

  // Handle work experience changes
  const handleWorkExperienceChange = (
    index: number,
    field: keyof WorkExperience,
    value: string
  ) => {
    const updatedExperience = [...resumeData.workExperience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    };

    setResumeData((prev) => ({
      ...prev,
      workExperience: updatedExperience,
    }));
  };

  // Handle education changes
  const handleEducationChange = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const updatedEducation = [...resumeData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };

    setResumeData((prev) => ({
      ...prev,
      education: updatedEducation,
    }));
  };

  // Handle highlight changes
  const handleHighlightChange = (
    experienceIndex: number,
    highlightIndex: number,
    value: string
  ) => {
    const updatedExperience = [...resumeData.workExperience];
    const updatedHighlights = [
      ...updatedExperience[experienceIndex].highlights,
    ];
    updatedHighlights[highlightIndex] = value;

    updatedExperience[experienceIndex] = {
      ...updatedExperience[experienceIndex],
      highlights: updatedHighlights,
    };

    setResumeData((prev) => ({
      ...prev,
      workExperience: updatedExperience,
    }));
  };

  // Add new highlight to a work experience
  const addHighlight = (experienceIndex: number) => {
    const updatedExperience = [...resumeData.workExperience];
    updatedExperience[experienceIndex].highlights.push("");

    setResumeData((prev) => ({
      ...prev,
      workExperience: updatedExperience,
    }));
  };

  // Handle skill changes
  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...resumeData.skills];
    updatedSkills[index] = value;

    setResumeData((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
  };

  // Handle personal info changes
  const handlePersonalInfoChange = (
    field: keyof typeof resumeData.personalInfo,
    value: string
  ) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  // Remove work experience
  const removeWorkExperience = (index: number) => {
    if (resumeData.workExperience.length === 1) return;

    const updatedExperience = [...resumeData.workExperience];
    updatedExperience.splice(index, 1);

    setResumeData((prev) => ({
      ...prev,
      workExperience: updatedExperience,
    }));
  };

  // Remove education
  const removeEducation = (index: number) => {
    if (resumeData.education.length === 1) return;

    const updatedEducation = [...resumeData.education];
    updatedEducation.splice(index, 1);

    setResumeData((prev) => ({
      ...prev,
      education: updatedEducation,
    }));
  };

  // Remove highlight
  const removeHighlight = (experienceIndex: number, highlightIndex: number) => {
    if (resumeData.workExperience[experienceIndex].highlights.length === 1)
      return;

    const updatedExperience = [...resumeData.workExperience];
    updatedExperience[experienceIndex].highlights.splice(highlightIndex, 1);

    setResumeData((prev) => ({
      ...prev,
      workExperience: updatedExperience,
    }));
  };

  // Remove skill
  const removeSkill = (index: number) => {
    if (resumeData.skills.length === 1) return;

    const updatedSkills = [...resumeData.skills];
    updatedSkills.splice(index, 1);

    setResumeData((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
  };

  // Generate AI suggestions for resume improvement
  // Replace the generateAISuggestions function in your ResumeBuilder component with this improved version

  const generateAISuggestions = async () => {
    setIsLoading(true);
    setAIFeedback(null);
    try {
      if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        throw new Error("API key is not configured");
      }

      const resumeTextForAI = `
    Personal Information:
    ${JSON.stringify(resumeData.personalInfo, null, 2)}

    Summary:
    ${resumeData.summary}

    Work Experience:
    ${JSON.stringify(resumeData.workExperience, null, 2)}

    Education:
    ${JSON.stringify(resumeData.education, null, 2)}

    Skills:
    ${JSON.stringify(resumeData.skills, null, 2)}
    `;

      const detailedPrompt = `
    Analyze the following resume text and provide feedback to optimize it for Applicant Tracking Systems (ATS) and improve its overall quality for the target job title: "${
      resumeData.targetJobTitle
    }".

    Resume Text:
    \`\`\`
    ${resumeTextForAI}
    \`\`\`

    ${
      jobDescriptionText
        ? `Job Description:\n\`\`\`\n${jobDescriptionText}\n\`\`\`\n`
        : ""
    }

    **You MUST respond with valid JSON only. Do not include any introductory or concluding text, just the JSON.  The JSON should conform to the following structure exactly:**

    \`\`\`json
    {
      "score": (ATS compatibility score out of 100, focus on keyword relevance, formatting, section completeness. Provide an integer between 0 and 100),
      "suggestions": [
        {
          "section": "(e.g., Summary, Work Experience, Skills).  Choose from these sections: Summary, Work Experience, Education, Skills, Personal Information. ",
          "feedback": "(Specific feedback on this section. Be concise and actionable)",
          "improvement": "(Concrete suggestion for improvement. Be specific and easy to implement)"
        },
        ... (more suggestions as needed, aim for 2-5 suggestions)
      ],
      "keywordMatches": {
        "matched": ["list", "of", "keywords", "found", "in", "the", "resume", "that", "are", "relevant", "to", "the", "job", "description", "if provided"],
        "missing": ["list", "of", "keywords", "to", "consider", "adding", "to", "the", "resume", "to", "better", "match", "the", "job", "description", "if provided", "or", "to", "improve", "ATS", "compatibility", "in", "general"]
      }
    }
    \`\`\`

    **Ensure the entire output is valid JSON and nothing else.  Do not add any text outside of the JSON block.  If you cannot provide a score or suggestions, still return valid JSON with empty or null values for those fields, but the JSON structure must be maintained.**

    Focus on providing actionable advice to improve the resume's chances of getting past ATS and impressing human recruiters for the target job title. Be direct and to the point.
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
        console.error("Gemini API error:", errorData);
        throw new Error(
          `Gemini API request failed: ${response.status} ${
            response.statusText
          } - ${errorData?.error?.message || "No detailed error message"}`
        );
      }

      const data = await response.json();
      let aiResponseContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiResponseContent) {
        throw new Error("No content returned from Gemini AI.");
      }

      console.error("Raw AI Response:", aiResponseContent); // Keep raw response logging

      // **--- START OF FIX: Remove Markdown Code Block ---**
      let jsonString = aiResponseContent;

      if (jsonString.startsWith("```json\n") && jsonString.endsWith("\n```")) {
        jsonString = jsonString.substring(8, jsonString.length - 4); // Remove ```json\n from start and \n``` from end
      } else if (
        jsonString.startsWith("```json") &&
        jsonString.endsWith("```")
      ) {
        jsonString = jsonString.substring(7, jsonString.length - 3); // Remove ```json from start and ``` from end (if no newline after ```json)
      } else if (
        jsonString.startsWith("```\n") &&
        jsonString.endsWith("\n```")
      ) {
        jsonString = jsonString.substring(4, jsonString.length - 4); //remove ```\n and \n``` if just ``` without json
      } else if (jsonString.startsWith("```") && jsonString.endsWith("```")) {
        jsonString = jsonString.substring(3, jsonString.length - 3); // remove ``` and ``` if just ``` without json and newlines
      }

      // **--- END OF FIX ---**

      let feedbackData;
      try {
        feedbackData = JSON.parse(jsonString); // Parse the cleaned JSON string
        if (typeof feedbackData !== "object" || feedbackData === null) {
          throw new Error(
            "AI response is not a valid JSON object after Markdown removal."
          );
        }
      } catch (jsonError: any) {
        console.error(
          "Error parsing Gemini JSON response (after Markdown removal):",
          jsonError,
          jsonError.message
        );
        throw new Error(
          "Failed to parse AI response as JSON even after removing Markdown. Response might still be malformed JSON."
        );
      }

      if (
        typeof feedbackData.score === "number" &&
        Array.isArray(feedbackData.suggestions) &&
        typeof feedbackData.keywordMatches === "object"
      ) {
        setAIFeedback(feedbackData as AIFeedback);
        setCurrentStep(3);
      } else {
        console.error("Invalid AI feedback structure:", feedbackData);
        throw new Error("AI response JSON structure is not as expected.");
      }
    } catch (error: any) {
      console.error("Error generating AI suggestions:", error);
      alert(`Failed to generate AI suggestions: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  // Suggest job titles based on input
  useEffect(() => {
    if (resumeData.targetJobTitle.length > 1) {
      const filtered = JOB_TITLES.filter((title) =>
        title.toLowerCase().includes(resumeData.targetJobTitle.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [resumeData.targetJobTitle]);

  // Export resume as PDF
  const exportResume = () => {
    if (!previewRef.current) return;

    // This would typically use a library like jsPDF or html2pdf
    // For this example, we'll just show an alert
    alert("Resume export functionality would generate a PDF here.");

    // Example implementation with html2pdf:
    // import html2pdf from 'html2pdf.js';
    // const element = previewRef.current;
    // const opt = {
    //   margin: 1,
    //   filename: `${resumeData.personalInfo.name.replace(' ', '_')}_Resume.pdf`,
    //   image: { type: 'jpeg', quality: 0.98 },
    //   html2canvas: { scale: 2 },
    //   jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    // };
    // html2pdf().set(opt).from(element).save();
  };

  // Copy resume content to clipboard
  const copyToClipboard = () => {
    const resumeText = `
${resumeData.personalInfo.name}
${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${
      resumeData.personalInfo.location
    }
${
  resumeData.personalInfo.linkedIn
    ? resumeData.personalInfo.linkedIn + " | "
    : ""
}${resumeData.personalInfo.website || ""}

PROFESSIONAL SUMMARY
${resumeData.summary}

EXPERIENCE
${resumeData.workExperience
  .map(
    (exp) => `
${exp.title} | ${exp.company} | ${exp.location}
${exp.startDate} - ${exp.endDate}
${exp.description}
${exp.highlights.map((h) => `• ${h}`).join("\n")}
`
  )
  .join("\n")}

EDUCATION
${resumeData.education
  .map(
    (edu) => `
${edu.degree} | ${edu.institution} | ${edu.location}
${edu.startDate} - ${edu.endDate}
${edu.description}
`
  )
  .join("\n")}

SKILLS
${resumeData.skills.join(", ")}
    `;

    navigator.clipboard.writeText(resumeText.trim());
    alert("Resume copied to clipboard!");
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
          <title>AI Resume Builder | SkillBridge</title>
          <meta
            name="description"
            content="Create an ATS-optimized resume with AI assistance"
          />
        </Head>

        <div className="min-h-screen bg-gray-900 pb-20 pt-24">
          <div className="container mx-auto px-4">
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                AI-Powered Resume Builder
              </h1>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Create an ATS-optimized resume tailored to your target job with
                the help of AI. Get real-time feedback and suggestions to
                maximize your chances of landing interviews.
              </p>
            </div>

            {/* Step indicator */}
            <div className="mb-10 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4].map((step) => (
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
                      {step === 1 && "Resume Details"}
                      {step === 2 && "Job Target"}
                      {step === 3 && "AI Optimization"}
                      {step === 4 && "Export"}
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
                {/* Step 1: Resume Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">Resume Details</h2>
                    </div>

                    {/* Sections accordion */}
                    <div className="space-y-3">
                      {/* Personal Information */}
                      <div className="border border-gray-700 rounded-lg overflow-hidden">
                        <button
                          className={`w-full flex justify-between items-center p-4 text-left font-medium transition-colors ${
                            sections[0].expanded
                              ? "bg-blue-500/20 text-blue-100"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                          onClick={() => toggleSection("personal")}
                        >
                          <div className="flex items-center">
                            <FaUserAlt className="mr-3 text-blue-400" />
                            <span>Personal Information</span>
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
                                  value={resumeData.personalInfo.name}
                                  onChange={(e) =>
                                    handlePersonalInfoChange(
                                      "name",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                  Email
                                </label>
                                <input
                                  type="email"
                                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={resumeData.personalInfo.email}
                                  onChange={(e) =>
                                    handlePersonalInfoChange(
                                      "email",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                  Phone
                                </label>
                                <input
                                  type="tel"
                                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={resumeData.personalInfo.phone}
                                  onChange={(e) =>
                                    handlePersonalInfoChange(
                                      "phone",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                  Location
                                </label>
                                <input
                                  type="text"
                                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={resumeData.personalInfo.location}
                                  placeholder="City, State"
                                  onChange={(e) =>
                                    handlePersonalInfoChange(
                                      "location",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                  LinkedIn (optional)
                                </label>
                                <input
                                  type="url"
                                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={resumeData.personalInfo.linkedIn}
                                  placeholder="linkedin.com/in/username"
                                  onChange={(e) =>
                                    handlePersonalInfoChange(
                                      "linkedIn",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                  Website (optional)
                                </label>
                                <input
                                  type="url"
                                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={resumeData.personalInfo.website}
                                  placeholder="yourwebsite.com"
                                  onChange={(e) =>
                                    handlePersonalInfoChange(
                                      "website",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Professional Summary */}
                      <div className="border border-gray-700 rounded-lg overflow-hidden">
                        <button
                          className={`w-full flex justify-between items-center p-4 text-left font-medium transition-colors ${
                            sections[1].expanded
                              ? "bg-blue-500/20 text-blue-100"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                          onClick={() => toggleSection("summary")}
                        >
                          <div className="flex items-center">
                            <FaFileAlt className="mr-3 text-blue-400" />
                            <span>Professional Summary</span>
                          </div>
                          {sections[1].expanded ? (
                            <FaChevronDown />
                          ) : (
                            <FaChevronRight />
                          )}
                        </button>

                        {sections[1].expanded && (
                          <div className="p-5 border-t border-gray-700 bg-gray-800/50">
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">
                                Summary
                              </label>
                              <textarea
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                                value={resumeData.summary}
                                onChange={(e) =>
                                  setResumeData((prev) => ({
                                    ...prev,
                                    summary: e.target.value,
                                  }))
                                }
                                placeholder="A concise overview of your professional background, key skills, and career goals."
                              ></textarea>
                              <div className="mt-2 text-xs flex items-center text-gray-400">
                                <FaInfoCircle className="mr-1" />
                                <span>
                                  Keep this to 3-5 sentences and include
                                  relevant keywords.
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Work Experience */}
                      <div className="border border-gray-700 rounded-lg overflow-hidden">
                        <button
                          className={`w-full flex justify-between items-center p-4 text-left font-medium transition-colors ${
                            sections[2].expanded
                              ? "bg-blue-500/20 text-blue-100"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                          onClick={() => toggleSection("experience")}
                        >
                          <div className="flex items-center">
                            <FaBriefcase className="mr-3 text-blue-400" />
                            <span>Work Experience</span>
                          </div>
                          {sections[2].expanded ? (
                            <FaChevronDown />
                          ) : (
                            <FaChevronRight />
                          )}
                        </button>

                        {sections[2].expanded && (
                          <div className="p-5 border-t border-gray-700 bg-gray-800/50">
                            {resumeData.workExperience.map((exp, index) => (
                              <div
                                key={exp.id}
                                className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700"
                              >
                                <div className="flex justify-between items-center mb-3">
                                  <h3 className="font-medium">
                                    Position {index + 1}
                                  </h3>
                                  {resumeData.workExperience.length > 1 && (
                                    <button
                                      className="text-red-400 hover:text-red-300 text-sm"
                                      onClick={() =>
                                        removeWorkExperience(index)
                                      }
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">
                                      Job Title
                                    </label>
                                    <input
                                      type="text"
                                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      value={exp.title}
                                      onChange={(e) =>
                                        handleWorkExperienceChange(
                                          index,
                                          "title",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">
                                      Company
                                    </label>
                                    <input
                                      type="text"
                                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      value={exp.company}
                                      onChange={(e) =>
                                        handleWorkExperienceChange(
                                          index,
                                          "company",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">
                                      Location
                                    </label>
                                    <input
                                      type="text"
                                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      value={exp.location}
                                      placeholder="City, State or Remote"
                                      onChange={(e) =>
                                        handleWorkExperienceChange(
                                          index,
                                          "location",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-400 mb-1">
                                        Start Date
                                      </label>
                                      <input
                                        type="text"
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={exp.startDate}
                                        placeholder="MM/YYYY"
                                        onChange={(e) =>
                                          handleWorkExperienceChange(
                                            index,
                                            "startDate",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-400 mb-1">
                                        End Date
                                      </label>
                                      <input
                                        type="text"
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={exp.endDate}
                                        placeholder="MM/YYYY or Present"
                                        onChange={(e) =>
                                          handleWorkExperienceChange(
                                            index,
                                            "endDate",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Description
                                  </label>
                                  <textarea
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                                    value={exp.description}
                                    onChange={(e) =>
                                      handleWorkExperienceChange(
                                        index,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Brief description of your role and responsibilities"
                                  ></textarea>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Key Achievements & Responsibilities
                                  </label>

                                  {exp.highlights.map((highlight, hIndex) => (
                                    <div
                                      key={`${exp.id}-highlight-${hIndex}`}
                                      className="flex items-start mb-2"
                                    >
                                      <span className="mt-3 mr-2 text-blue-400">
                                        •
                                      </span>
                                      <div className="flex-1">
                                        <textarea
                                          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          value={highlight}
                                          rows={1}
                                          onChange={(e) =>
                                            handleHighlightChange(
                                              index,
                                              hIndex,
                                              e.target.value
                                            )
                                          }
                                          placeholder="Use action verbs and include metrics when possible"
                                        ></textarea>
                                      </div>
                                      {exp.highlights.length > 1 && (
                                        <button
                                          className="text-red-400 hover:text-red-300 ml-2 mt-2.5"
                                          onClick={() =>
                                            removeHighlight(index, hIndex)
                                          }
                                        >
                                          ✕
                                        </button>
                                      )}
                                    </div>
                                  ))}

                                  <button
                                    className="text-sm text-blue-400 hover:text-blue-300 mt-2 flex items-center"
                                    onClick={() => addHighlight(index)}
                                  >
                                    <svg
                                      className="w-4 h-4 mr-1"
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
                                    Add Achievement
                                  </button>
                                </div>
                              </div>
                            ))}

                            <button
                              className="w-full p-2 rounded-lg border border-dashed border-gray-600 hover:border-blue-400 text-gray-400 hover:text-blue-400 transition-colors flex items-center justify-center"
                              onClick={addWorkExperience}
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
                              Add Another Position
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Education */}
                      <div className="border border-gray-700 rounded-lg overflow-hidden">
                        <button
                          className={`w-full flex justify-between items-center p-4 text-left font-medium transition-colors ${
                            sections[3].expanded
                              ? "bg-blue-500/20 text-blue-100"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                          onClick={() => toggleSection("education")}
                        >
                          <div className="flex items-center">
                            <FaGraduationCap className="mr-3 text-blue-400" />
                            <span>Education</span>
                          </div>
                          {sections[3].expanded ? (
                            <FaChevronDown />
                          ) : (
                            <FaChevronRight />
                          )}
                        </button>

                        {sections[3].expanded && (
                          <div className="p-5 border-t border-gray-700 bg-gray-800/50">
                            {resumeData.education.map((edu, index) => (
                              <div
                                key={edu.id}
                                className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700"
                              >
                                <div className="flex justify-between items-center mb-3">
                                  <h3 className="font-medium">
                                    Education {index + 1}
                                  </h3>
                                  {resumeData.education.length > 1 && (
                                    <button
                                      className="text-red-400 hover:text-red-300 text-sm"
                                      onClick={() => removeEducation(index)}
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">
                                      Degree/Certificate
                                    </label>
                                    <input
                                      type="text"
                                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      value={edu.degree}
                                      onChange={(e) =>
                                        handleEducationChange(
                                          index,
                                          "degree",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Bachelor of Science in Computer Science"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">
                                      Institution
                                    </label>
                                    <input
                                      type="text"
                                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      value={edu.institution}
                                      onChange={(e) =>
                                        handleEducationChange(
                                          index,
                                          "institution",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">
                                      Location
                                    </label>
                                    <input
                                      type="text"
                                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      value={edu.location}
                                      onChange={(e) =>
                                        handleEducationChange(
                                          index,
                                          "location",
                                          e.target.value
                                        )
                                      }
                                      placeholder="City, State"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-400 mb-1">
                                        Start Date
                                      </label>
                                      <input
                                        type="text"
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={edu.startDate}
                                        onChange={(e) =>
                                          handleEducationChange(
                                            index,
                                            "startDate",
                                            e.target.value
                                          )
                                        }
                                        placeholder="MM/YYYY"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-400 mb-1">
                                        End Date
                                      </label>
                                      <input
                                        type="text"
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={edu.endDate}
                                        onChange={(e) =>
                                          handleEducationChange(
                                            index,
                                            "endDate",
                                            e.target.value
                                          )
                                        }
                                        placeholder="MM/YYYY or Present"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Additional Details (Optional)
                                  </label>
                                  <textarea
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={edu.description}
                                    onChange={(e) =>
                                      handleEducationChange(
                                        index,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Relevant coursework, honors, GPA, etc."
                                  ></textarea>
                                </div>
                              </div>
                            ))}

                            <button
                              className="w-full p-2 rounded-lg border border-dashed border-gray-600 hover:border-blue-400 text-gray-400 hover:text-blue-400 transition-colors flex items-center justify-center"
                              onClick={addEducation}
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
                              Add Another Education
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Skills */}
                      <div className="border border-gray-700 rounded-lg overflow-hidden">
                        <button
                          className={`w-full flex justify-between items-center p-4 text-left font-medium transition-colors ${
                            sections[4].expanded
                              ? "bg-blue-500/20 text-blue-100"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                          onClick={() => toggleSection("skills")}
                        >
                          <div className="flex items-center">
                            <FaTools className="mr-3 text-blue-400" />
                            <span>Skills</span>
                          </div>
                          {sections[4].expanded ? (
                            <FaChevronDown />
                          ) : (
                            <FaChevronRight />
                          )}
                        </button>

                        {sections[4].expanded && (
                          <div className="p-5 border-t border-gray-700 bg-gray-800/50">
                            <div className="mb-4 text-sm text-gray-400">
                              <FaInfoCircle className="inline mr-1" />
                              List skills relevant to your target position.
                              Include technical skills, soft skills, and tools
                              you're proficient with.
                            </div>

                            <div className="space-y-2">
                              {resumeData.skills.map((skill, index) => (
                                <div key={index} className="flex items-center">
                                  <input
                                    type="text"
                                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={skill}
                                    onChange={(e) =>
                                      handleSkillChange(index, e.target.value)
                                    }
                                    placeholder="e.g., JavaScript, React, Project Management"
                                  />
                                  {resumeData.skills.length > 1 && (
                                    <button
                                      className="text-red-400 hover:text-red-300 ml-2"
                                      onClick={() => removeSkill(index)}
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>

                            <button
                              className="mt-3 p-2 rounded-lg border border-dashed border-gray-600 hover:border-blue-400 text-gray-400 hover:text-blue-400 transition-colors flex items-center justify-center w-full"
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
                        Next: Target Job
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Job Target */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">
                        Job Target Information
                      </h2>
                    </div>

                    <div className="p-5 border border-gray-700 rounded-lg bg-gray-800/50">
                      <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Target Job Title
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={resumeData.targetJobTitle}
                            onChange={(e) =>
                              setResumeData((prev) => ({
                                ...prev,
                                targetJobTitle: e.target.value,
                              }))
                            }
                            placeholder="e.g., Frontend Developer, Product Manager"
                          />

                          {suggestions.length > 0 && (
                            <div className="absolute z-10 mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
                              {suggestions.map((suggestion, index) => (
                                <div
                                  key={index}
                                  className="p-2 hover:bg-gray-800 cursor-pointer"
                                  onClick={() => {
                                    setResumeData((prev) => ({
                                      ...prev,
                                      targetJobTitle: suggestion,
                                    }));
                                    setSuggestions([]);
                                  }}
                                >
                                  {suggestion}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-gray-400">
                          Enter the exact job title you're targeting for better
                          ATS optimization.
                        </p>
                      </div>

                      <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Job Description (Optional)
                        </label>
                        <textarea
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
                          value={jobDescriptionText}
                          onChange={(e) =>
                            setJobDescriptionText(e.target.value)
                          }
                          placeholder="Paste the job description here to help AI optimize your resume for this specific position..."
                        ></textarea>
                        <p className="mt-1 text-xs text-gray-400">
                          <FaInfoCircle className="inline mr-1" />
                          Pasting the job description helps AI tailor your
                          resume to match the specific requirements.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-3">
                          Choose Resume Template
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {RESUME_TEMPLATES.map((template) => (
                            <div key={template.id} className="relative">
                              <input
                                type="radio"
                                id={`template-${template.id}`}
                                name="template"
                                className="hidden peer"
                                checked={resumeData.template === template.id}
                                onChange={() =>
                                  setResumeData((prev) => ({
                                    ...prev,
                                    template: template.id,
                                    color: template.color,
                                  }))
                                }
                              />
                              <label
                                htmlFor={`template-${template.id}`}
                                className={`block p-3 border rounded-lg cursor-pointer transition-all ${
                                  resumeData.template === template.id
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

                                {resumeData.template === template.id && (
                                  <div className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full bg-blue-500 text-white">
                                    <FaCheck size={10} />
                                  </div>
                                )}
                              </label>
                            </div>
                          ))}
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
                      <motion.button
                        className={`px-6 py-2.5 rounded-lg flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-colors shadow-lg shadow-blue-500/20 ${
                          isLoading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                        onClick={generateAISuggestions}
                        disabled={isLoading}
                        whileHover={!isLoading ? { scale: 1.03 } : {}}
                        whileTap={!isLoading ? { scale: 0.97 } : {}}
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
                            Optimizing Resume...
                          </>
                        ) : (
                          <>
                            <FaRobot />
                            Optimize with AI
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Step 3: AI Optimization */}
                {currentStep === 3 && aiFeedback && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <FaRobot className="text-blue-400" />
                      AI Review & Optimization Results
                    </h2>

                    <div className="p-6 border border-gray-700 rounded-lg bg-gray-800/50">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-lg">
                          ATS Compatibility Score
                        </h3>
                        <div className="relative w-20 h-20">
                          <svg className="w-full h-full" viewBox="0 0 36 36">
                            <circle
                              cx="18"
                              cy="18"
                              r="16"
                              fill="none"
                              className="stroke-gray-700"
                              strokeWidth="2"
                            ></circle>
                            <circle
                              cx="18"
                              cy="18"
                              r="16"
                              fill="none"
                              className="stroke-blue-500"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeDasharray="100"
                              strokeDashoffset={
                                ((100 - aiFeedback.score) / 100) * 100
                              }
                              transform="rotate(-90 18 18)"
                            ></circle>
                            <text
                              x="18"
                              y="18"
                              textAnchor="middle"
                              dy=".3em"
                              className="text-xl font-bold fill-white"
                            >
                              {aiFeedback.score}%
                            </text>
                          </svg>
                        </div>
                      </div>

                      <div className="space-y-4 mt-6">
                        <h3 className="font-medium">Keyword Analysis</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <h4 className="text-sm font-medium text-green-400 mb-2 flex items-center">
                              <FaCheck className="mr-2" />
                              Matched Keywords
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {aiFeedback.keywordMatches.matched.map(
                                (keyword, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs"
                                  >
                                    {keyword}
                                  </span>
                                )
                              )}
                              {aiFeedback.keywordMatches.matched.length ===
                                0 && (
                                <span className="text-gray-400 text-sm">
                                  No matched keywords found
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                            <h4 className="text-sm font-medium text-amber-400 mb-2 flex items-center">
                              <FaInfoCircle className="mr-2" />
                              Missing Keywords
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {aiFeedback.keywordMatches.missing.map(
                                (keyword, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs"
                                  >
                                    {keyword}
                                  </span>
                                )
                              )}
                              {aiFeedback.keywordMatches.missing.length ===
                                0 && (
                                <span className="text-gray-400 text-sm">
                                  No missing keywords detected
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="font-medium mb-3">
                          Improvement Suggestions
                        </h3>
                        <div className="space-y-3">
                          {aiFeedback.suggestions.map((suggestion, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg"
                            >
                              <h4 className="text-sm font-medium text-blue-400 mb-1">
                                {suggestion.section}
                              </h4>
                              <p className="text-gray-300 text-sm mb-2">
                                {suggestion.feedback}
                              </p>
                              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs text-blue-300">
                                <span className="font-medium block mb-1">
                                  Suggestion:
                                </span>
                                {suggestion.improvement}
                              </div>
                            </motion.div>
                          ))}
                        </div>
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
                        className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-colors shadow-lg shadow-blue-500/20"
                        onClick={() => setCurrentStep(4)}
                      >
                        Next: Export Resume
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Export */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">
                      Export Your Resume
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
                          onClick={exportResume}
                        >
                          <div className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                              <FaDownload className="text-blue-400" />
                            </div>
                            <div>
                              <h4 className="font-medium">Download as PDF</h4>
                              <p className="text-sm text-gray-400">
                                Get a professionally formatted PDF for
                                applications
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
                                Plain text format for easy pasting
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
                              <FaPalette className="text-amber-400" />
                            </div>
                            <div>
                              <h4 className="font-medium">Customize Design</h4>
                              <p className="text-sm text-gray-400">
                                Adjust colors and layout before export
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      <div className="mt-6 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                        <h4 className="font-medium mb-2 flex items-center">
                          <FaInfoCircle className="mr-2 text-blue-400" />
                          Tips for Applying
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                          <li className="flex items-start">
                            <div className="text-blue-400 mr-2">•</div>
                            <div>
                              Always tailor your resume to each specific job
                              application
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="text-blue-400 mr-2">•</div>
                            <div>
                              Follow up within one week after submitting your
                              application
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="text-blue-400 mr-2">•</div>
                            <div>
                              Keep your LinkedIn profile updated to match your
                              resume
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="text-blue-400 mr-2">•</div>
                            <div>
                              Include a tailored cover letter when possible
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-between mt-8">
                      <button
                        className="px-6 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                        onClick={() => setCurrentStep(3)}
                      >
                        Previous
                      </button>
                      <button
                        className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white transition-colors shadow-lg shadow-green-500/20"
                        onClick={() =>
                          alert("Thank you for using the AI Resume Builder!")
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
                    <h2 className="text-xl font-semibold">Resume Preview</h2>
                  </div>

                  <div
                    ref={previewRef}
                    className="bg-white text-black rounded-lg p-8 shadow-xl max-h-[800px] overflow-y-auto"
                    style={{
                      fontFamily:
                        resumeData.template === "modern"
                          ? "Inter, sans-serif"
                          : resumeData.template === "classic"
                          ? "Georgia, serif"
                          : resumeData.template === "creative"
                          ? "Poppins, sans-serif"
                          : "Arial, sans-serif",
                    }}
                  >
                    {/* Resume Header */}
                    <div
                      className={`mb-6 ${
                        resumeData.template === "modern"
                          ? "border-b-2 pb-4"
                          : resumeData.template === "creative"
                          ? "bg-gradient-to-r p-4 rounded"
                          : "text-center"
                      }`}
                      style={{
                        borderColor:
                          resumeData.template === "modern"
                            ? `var(--color-${resumeData.color}-600)`
                            : "",
                        background:
                          resumeData.template === "creative"
                            ? `linear-gradient(to right, var(--color-${resumeData.color}-500), var(--color-${resumeData.color}-700))`
                            : "",
                        color:
                          resumeData.template === "creative" ? "white" : "",
                      }}
                    >
                      <h1
                        className={`text-2xl font-bold ${
                          resumeData.template === "classic"
                            ? "uppercase tracking-wider"
                            : resumeData.template === "creative"
                            ? "text-3xl"
                            : ""
                        }`}
                      >
                        {resumeData.personalInfo.name || "Your Name"}
                      </h1>

                      <div
                        className={`mt-2 ${
                          resumeData.template === "modern"
                            ? "flex flex-wrap gap-4 text-sm"
                            : resumeData.template === "classic"
                            ? "mt-3 text-center"
                            : resumeData.template === "creative"
                            ? "flex flex-wrap gap-3 mt-3"
                            : "text-sm"
                        }`}
                      >
                        {resumeData.personalInfo.email && (
                          <div>{resumeData.personalInfo.email}</div>
                        )}
                        {resumeData.personalInfo.phone && (
                          <div>{resumeData.personalInfo.phone}</div>
                        )}
                        {resumeData.personalInfo.location && (
                          <div>{resumeData.personalInfo.location}</div>
                        )}
                        {resumeData.personalInfo.linkedIn && (
                          <div>{resumeData.personalInfo.linkedIn}</div>
                        )}
                        {resumeData.personalInfo.website && (
                          <div>{resumeData.personalInfo.website}</div>
                        )}
                      </div>
                    </div>

                    {/* Summary */}
                    {resumeData.summary && (
                      <div className="mb-6">
                        <h2
                          className={`text-lg font-bold mb-2 ${
                            resumeData.template === "modern"
                              ? `text-${resumeData.color}-600`
                              : resumeData.template === "classic"
                              ? "uppercase border-b"
                              : resumeData.template === "creative"
                              ? `text-${resumeData.color}-500`
                              : ""
                          }`}
                        >
                          Professional Summary
                        </h2>
                        <p className="text-sm">{resumeData.summary}</p>
                      </div>
                    )}

                    {/* Experience */}
                    {resumeData.workExperience.some(
                      (exp) => exp.title || exp.company
                    ) && (
                      <div className="mb-6">
                        <h2
                          className={`text-lg font-bold mb-3 ${
                            resumeData.template === "modern"
                              ? `text-${resumeData.color}-600`
                              : resumeData.template === "classic"
                              ? "uppercase border-b"
                              : resumeData.template === "creative"
                              ? `text-${resumeData.color}-500`
                              : ""
                          }`}
                        >
                          Work Experience
                        </h2>

                        {resumeData.workExperience.map((exp, index) =>
                          exp.title || exp.company ? (
                            <div
                              key={exp.id}
                              className={`mb-4 ${
                                index !== resumeData.workExperience.length - 1
                                  ? "pb-4"
                                  : ""
                              } ${
                                resumeData.template === "modern"
                                  ? "border-b border-gray-200"
                                  : ""
                              }`}
                            >
                              <div
                                className={`${
                                  resumeData.template === "modern"
                                    ? "flex justify-between items-start"
                                    : resumeData.template === "creative"
                                    ? "flex flex-wrap gap-2 items-center"
                                    : ""
                                }`}
                              >
                                <h3 className="font-bold text-base">
                                  {exp.title || "Position"}
                                </h3>
                                <div
                                  className={`${
                                    resumeData.template === "modern"
                                      ? "text-right"
                                      : resumeData.template === "classic"
                                      ? "italic"
                                      : ""
                                  }`}
                                >
                                  <span className="font-medium">
                                    {exp.company || "Company"}
                                  </span>
                                  {exp.location && (
                                    <span> | {exp.location}</span>
                                  )}
                                </div>
                              </div>

                              <div className="text-sm text-gray-600 mt-1">
                                {exp.startDate && exp.endDate
                                  ? `${exp.startDate} - ${exp.endDate}`
                                  : "Date Range"}
                              </div>

                              {exp.description && (
                                <p className="mt-2 text-sm">
                                  {exp.description}
                                </p>
                              )}

                              {exp.highlights.some((h) => h) && (
                                <ul className="mt-2 pl-5 text-sm list-disc">
                                  {exp.highlights.map((highlight, hIndex) =>
                                    highlight ? (
                                      <li key={hIndex} className="mt-1">
                                        {highlight}
                                      </li>
                                    ) : null
                                  )}
                                </ul>
                              )}
                            </div>
                          ) : null
                        )}
                      </div>
                    )}

                    {/* Education */}
                    {resumeData.education.some(
                      (edu) => edu.degree || edu.institution
                    ) && (
                      <div className="mb-6">
                        <h2
                          className={`text-lg font-bold mb-3 ${
                            resumeData.template === "modern"
                              ? `text-${resumeData.color}-600`
                              : resumeData.template === "classic"
                              ? "uppercase border-b"
                              : resumeData.template === "creative"
                              ? `text-${resumeData.color}-500`
                              : ""
                          }`}
                        >
                          Education
                        </h2>

                        {resumeData.education.map((edu, index) =>
                          edu.degree || edu.institution ? (
                            <div
                              key={edu.id}
                              className={`mb-4 ${
                                index !== resumeData.education.length - 1
                                  ? "pb-4"
                                  : ""
                              } ${
                                resumeData.template === "modern"
                                  ? "border-b border-gray-200"
                                  : ""
                              }`}
                            >
                              <div
                                className={`${
                                  resumeData.template === "modern"
                                    ? "flex justify-between items-start"
                                    : resumeData.template === "creative"
                                    ? "flex flex-wrap gap-2 items-center"
                                    : ""
                                }`}
                              >
                                <h3 className="font-bold text-base">
                                  {edu.degree || "Degree"}
                                </h3>
                                <div
                                  className={`${
                                    resumeData.template === "modern"
                                      ? "text-right"
                                      : resumeData.template === "classic"
                                      ? "italic"
                                      : ""
                                  }`}
                                >
                                  <span className="font-medium">
                                    {edu.institution || "Institution"}
                                  </span>
                                  {edu.location && (
                                    <span> | {edu.location}</span>
                                  )}
                                </div>
                              </div>

                              <div className="text-sm text-gray-600 mt-1">
                                {edu.startDate && edu.endDate
                                  ? `${edu.startDate} - ${edu.endDate}`
                                  : "Date Range"}
                              </div>

                              {edu.description && (
                                <p className="mt-2 text-sm">
                                  {edu.description}
                                </p>
                              )}
                            </div>
                          ) : null
                        )}
                      </div>
                    )}

                    {/* Skills */}
                    {resumeData.skills.some((skill) => skill) && (
                      <div>
                        <h2
                          className={`text-lg font-bold mb-3 ${
                            resumeData.template === "modern"
                              ? `text-${resumeData.color}-600`
                              : resumeData.template === "classic"
                              ? "uppercase border-b"
                              : resumeData.template === "creative"
                              ? `text-${resumeData.color}-500`
                              : ""
                          }`}
                        >
                          Skills
                        </h2>

                        <div
                          className={`${
                            resumeData.template === "modern"
                              ? "flex flex-wrap gap-2"
                              : resumeData.template === "creative"
                              ? "flex flex-wrap gap-2"
                              : ""
                          }`}
                        >
                          {resumeData.template === "modern" ||
                          resumeData.template === "creative" ? (
                            resumeData.skills.map((skill, index) =>
                              skill ? (
                                <div
                                  key={index}
                                  className={`text-sm px-3 py-1 rounded-full ${
                                    resumeData.template === "modern"
                                      ? `bg-${resumeData.color}-100 text-${resumeData.color}-800`
                                      : resumeData.template === "creative"
                                      ? `bg-${resumeData.color}-500/20 border border-${resumeData.color}-500/30`
                                      : ""
                                  }`}
                                >
                                  {skill}
                                </div>
                              ) : null
                            )
                          ) : (
                            <div className="text-sm">
                              {resumeData.skills.filter(Boolean).join(" • ")}
                            </div>
                          )}
                        </div>
                      </div>
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

export default ResumeBuilder;
