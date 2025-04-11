import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Create GoogleGenerativeAI client if API key exists
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export interface SkillQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

type GeminiResponse = {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
};

/**
 * Generates multiple-choice questions for a given skill and difficulty level
 */
export async function generateSkillQuestions(
  skillName: string,
  level: "beginner" | "intermediate" | "advanced" = "intermediate",
  count: number = 5
): Promise<SkillQuestion[]> {
  try {
    // Fallback to mock questions if no API key
    if (!GEMINI_API_KEY) {
      console.warn("Gemini API key not found, using mock questions");
      return getMockSkillQuestions(skillName, level).slice(0, count);
    }

    const prompt = `
      Create ${count} multiple-choice questions to assess knowledge of ${skillName} at ${level} level.
      Questions should increase in difficulty and be relevant to real-world applications.
      
      Format as a JSON array of objects with:
      - question: string
      - options: array of 4 strings
      - correctAnswer: integer (0-3)
      - explanation: string explaining the correct answer
      
      Return only the JSON array with no additional text.
    `;

    // Try GoogleGenerativeAI SDK first
    if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("Could not parse JSON from response");
      return JSON.parse(jsonMatch[0]).slice(0, count);
    }

    // Fallback to direct API call
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
      }),
    });

    const data: GeminiResponse = await response.json();
    const jsonText = data.candidates[0].content.parts[0].text.trim();
    const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("Could not parse JSON from response");
    return JSON.parse(jsonMatch[0]).slice(0, count);
  } catch (error) {
    console.error("Error generating skill questions:", error);
    return getMockSkillQuestions(skillName, level).slice(0, count);
  }
}

/**
 * Evaluates skill level based on quiz performance
 */
export async function evaluateSkillLevel(
  skillName: string,
  questions: SkillQuestion[],
  userAnswers: number[]
): Promise<{ level: number; feedback: string }> {
  try {
    const correctCount = questions.reduce(
      (count, q, i) => count + (q.correctAnswer === userAnswers[i] ? 1 : 0),
      0
    );
    const percentCorrect = (correctCount / questions.length) * 100;

    if (!GEMINI_API_KEY) {
      return {
        level: Math.round(percentCorrect),
        feedback: `You scored ${percentCorrect}% on the ${skillName} quiz. Practice more to improve your skills.`,
      };
    }

    const prompt = `
      A user scored ${correctCount}/${questions.length
      } (${percentCorrect}%) on a ${skillName} quiz.
      Performance details:
      ${questions
        .map(
          (q, i) =>
            `Q: "${q.question.substring(0, 50)}...": ${userAnswers[i] === q.correctAnswer ? "Correct" : "Incorrect"
            }`
        )
        .join("\n")}
      
      Provide:
      1. Skill level (0-100)
      2. Feedback with strengths, weaknesses, and 2-3 learning recommendations (HTML formatted)
      
      Return JSON with "level" (number) and "feedback" (string) properties only.
    `;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
      }),
    });

    const data: GeminiResponse = await response.json();
    const jsonText = data.candidates[0].content.parts[0].text.trim();
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : jsonText);
  } catch (error) {
    console.error("Error evaluating skill level:", error);
    return {
      level: Math.round(
        (userAnswers.filter((a, i) => questions[i].correctAnswer === a).length /
          questions.length) *
        100
      ),
      feedback: "Unable to generate detailed feedback. Please try again.",
    };
  }
}

/**
 * Generates career path recommendations based on skills, interests, and background
 */
export async function generateCareerPathRecommendations(
  skills: Array<{ name: string; level: number }>,
  interests: string[],
  background: string
): Promise<any> {
  try {
    if (!GEMINI_API_KEY) {
      console.warn("Gemini API key not found, using mock recommendations");
      return getMockCareerRecommendations(skills, interests);
    }

    const skillsText = skills
      .map((s) => `${s.name} (Level: ${s.level}/100)`)
      .join(", ");
    const prompt = `
      Based on:
      Skills: ${skillsText}
      Interests: ${interests.join(", ")}
      Background: ${background}
      
      Suggest 3 career paths with:
      - title: string
      - suitabilityScore: number (0-100)
      - requiredSkills: string[]
      - currentMatchPercentage: number (0-100)
      - salaryCap: string
      - recommendations: string[] (3 specific patent pending: specific learning recommendations
      
      Return JSON with "careerPaths" array only.
    `;

    if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return JSON.parse(jsonMatch ? jsonMatch[0] : text);
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
      }),
    });

    const data: GeminiResponse = await response.json();
    const jsonText = data.candidates[0].content.parts[0].text.trim();
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : jsonText);
  } catch (error) {
    console.error("Error generating career recommendations:", error);
    return getMockCareerRecommendations(skills, interests);
  }
}

/**
 * Generates job recommendations based on skills, interests, and background
 */
export async function generateJobRecommendations(
  skills: Array<{ name: string; level: number }>,
  interests: string[],
  background: string,
  count: number = 6 // Number of job recommendations to fetch
): Promise<Array<{ id: number; companyName: string; jobRole: string; salary: string; location: string }>> {
  try {
    if (!GEMINI_API_KEY) {
      console.warn("Gemini API key not found, using mock job recommendations");
      return getMockJobRecommendations(count); // Use a mock function if needed
    }

    const skillsText = skills
      .map((s) => `${s.name} (Level: ${s.level}/100)`)
      .join(", ");
    const prompt = `
      Based on the following user profile:
      Skills: ${skillsText}
      Interests: ${interests.join(", ")}
      Background: ${background}

      Suggest ${count} specific job recommendations from top IT companies (like Google, Microsoft, Meta, Apple, Amazon, Netflix, etc.).
      For each job, provide:
      - companyName: string (The name of the company)
      - jobRole: string (The specific job title)
      - salary: string (Estimated salary range, e.g., "$150,000 - $180,000")
      - location: string (Primary location, e.g., "Mountain View, CA" or "Remote")

      Return the result as a JSON array of objects, where each object represents a job recommendation and includes the fields: "companyName", "jobRole", "salary", "location".
      Assign a unique "id" number to each recommendation starting from 1.
      Return *only* the JSON array, with no surrounding text or markdown formatting.
    `;

    let jsonText = "";

    if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      jsonText = response.text();
    } else {
      // Fallback to direct API call
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          // Adjust generationConfig as needed, maybe higher temperature for more varied jobs?
          generationConfig: { temperature: 0.4, maxOutputTokens: 1500 },
        }),
      });
      const data: GeminiResponse = await response.json();
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No candidates received from Gemini API");
      }
      jsonText = data.candidates[0].content.parts[0].text.trim();
    }

    // Extract the JSON array from the response text
    const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("Could not parse JSON array from Gemini response:", jsonText);
      throw new Error("Could not parse JSON array from Gemini response");
    }

    // Parse and return the job recommendations
    const jobs = JSON.parse(jsonMatch[0]);
    // Ensure IDs are added if Gemini didn't include them (though the prompt asks for it)
    return jobs.map((job: any, index: number) => ({ ...job, id: job.id || index + 1 })).slice(0, count);

  } catch (error) {
    console.error("Error generating job recommendations:", error);
    // Fallback to mock data in case of error
    return getMockJobRecommendations(count);
  }
}

// Mock function for job recommendations (can be used as fallback)
function getMockJobRecommendations(count: number) {
  const mockJobs = [
    { id: 1, companyName: "Google (Mock)", jobRole: "Software Engineer", salary: "$150,000", location: "Mountain View, CA" },
    { id: 2, companyName: "Microsoft (Mock)", jobRole: "Cloud Solutions Architect", salary: "$165,000", location: "Redmond, WA" },
    { id: 3, companyName: "Apple (Mock)", jobRole: "iOS Developer", salary: "$155,000", location: "Cupertino, CA" },
    { id: 4, companyName: "Amazon (Mock)", jobRole: "Data Scientist", salary: "$140,000", location: "Seattle, WA" },
    { id: 5, companyName: "Meta (Mock)", jobRole: "Machine Learning Engineer", salary: "$170,000", location: "Menlo Park, CA" },
    { id: 6, companyName: "Netflix (Mock)", jobRole: "Senior Backend Engineer", salary: "$180,000", location: "Los Gatos, CA" },
  ];
  return mockJobs.slice(0, count);
}

// Mock data functions remain unchanged
function getMockSkillQuestions(
  skillName: string,
  level: string
): SkillQuestion[] {
  return [
    {
      question: `What is a key feature of ${skillName}?`,
      options: [
        `${skillName} is primarily used for backend development`,
        `${skillName} excels at data manipulation and analysis`,
        `${skillName} is mainly focused on frontend UI design`,
        `${skillName} is used exclusively for mobile applications`,
      ],
      correctAnswer: 1,
      explanation: `${skillName} is widely known for its robust capabilities in data manipulation and analysis.`,
    },
    // ... (rest of the mock questions remain the same)
  ];
}

function getMockCareerRecommendations(skills: any[], interests: string[]): any {
  const recommendations = {
    careerPaths: [
      {
        title: "Machine Learning Engineer",
        suitabilityScore: 87,
        requiredSkills: [
          "Python",
          "Machine Learning",
          "Statistics",
          "TensorFlow",
        ],
        currentMatchPercentage: 75,
        salaryCap: "$130,000",
        recommendations: [
          "Take a specialized deep learning course",
          "Build a portfolio of ML projects",
          "Learn cloud-based ML deployment",
        ],
      },
      // ... (rest of the mock recommendations remain the same)
    ],
  };

  if (interests.some((i) => i.toLowerCase().includes("blockchain"))) {
    recommendations.careerPaths.push({
      title: "Blockchain Developer",
      suitabilityScore: 75,
      requiredSkills: [
        "Solidity",
        "Smart Contracts",
        "JavaScript",
        "Cryptography",
      ],
      currentMatchPercentage: 50,
      salaryCap: "$140,000",
      recommendations: [
        "Complete a Solidity certification",
        "Contribute to an open-source blockchain project",
        "Build a dApp portfolio project",
      ],
    });
  }

  return recommendations;
}
