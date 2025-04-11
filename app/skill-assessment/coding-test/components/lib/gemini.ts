import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client with API key
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Generate a coding problem based on skill and difficulty level
export async function generateCodingProblem(skill: string, difficulty: string) {
  try {
    const prompt = `
Generate a comprehensive coding challenge for a technical assessment platform.
The challenge should be related to "${skill}" with a difficulty level of "${difficulty}".

Please include the following in JSON format:
1. title: A clear, concise title for the challenge
2. description: A detailed explanation of the problem with proper formatting (can include HTML)
3. difficulty: The challenge difficulty ("${difficulty}")
4. category: A specific subcategory within "${skill}"
5. constraints: An array of constraints or limitations
6. examples: An array of example cases with input, output, and explanation
7. testCases: An array of test cases (including both visible and hidden tests) with input, expectedOutput, and isHidden properties
8. hints: An array of progressive hints (from general to specific)
9. timeComplexity: Expected time complexity (e.g., "O(n)")
10. spaceComplexity: Expected space complexity (e.g., "O(1)")

Make sure test cases are comprehensive and cover edge cases. Provide at least 5 test cases, with 2-3 of them marked as hidden.
The problem should be clearly stated, challenging for the given difficulty level, and solvable.

Return only valid JSON (no additional text).
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response, handling potential formatting issues
    try {
      // Extract JSON if it's wrapped in markdown code blocks or has additional text
      const jsonContent = text.replace(/```json|```/g, "").trim();
      return JSON.parse(jsonContent);
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      console.log("Raw response:", text);
      throw new Error(
        "Failed to generate a valid coding problem. Please try again."
      );
    }
  } catch (error) {
    console.error("Error in generateCodingProblem:", error);
    throw error;
  }
}

// Verify code solution against test cases
export async function verifyCodeSolution({
  code,
  language,
  problem,
  testCases,
  mode,
}: {
  code: string;
  language: string;
  problem: any;
  testCases: any[];
  mode: "run" | "submit";
}) {
  try {
    // Prepare test cases data
    const testCasesData = JSON.stringify(testCases);

    const prompt = `
You are a code verification system that evaluates solutions against a set of test cases.

PROBLEM:
${problem.title}
${problem.description}

CODE (${language}):
\`\`\`${language}
${code}
\`\`\`

TEST CASES:
${testCasesData}

Your task:
1. Act as a language interpreter to run the provided code against each test case
2. For each test case, determine if the code produces the expected output
3. Capture any errors or exceptions that might occur
4. Provide helpful error messages where applicable

Return a JSON object with:
1. "output": a console-like output of running the code
2. "testResults": an array of results, one for each test case, where each result has:
   - "input": the input value
   - "expected": the expected output
   - "actual": the actual output produced by the code
   - "passed": boolean indicating if the test passed
   - "error": any error message if applicable (null if no error)
${
  mode === "submit"
    ? `3. "feedback": constructive feedback about the solution`
    : ""
}

IMPORTANT:
- Be precise in checking outputs, considering type and format
- Account for language-specific behaviors
- Focus on functionality matching the expected outputs
- Format your response as valid JSON only (no additional text)
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    try {
      // Extract JSON if it's wrapped in markdown code blocks
      const jsonContent = text.replace(/```json|```/g, "").trim();
      return JSON.parse(jsonContent);
    } catch (error) {
      console.error("Error parsing verification response:", error);
      console.log("Raw response:", text);
      throw new Error("Failed to verify solution. Please try again.");
    }
  } catch (error) {
    console.error("Error in verifyCodeSolution:", error);
    throw error;
  }
}

// Generate a personalized hint based on the current code
export async function generatePersonalizedHint({
  code,
  language,
  problem,
}: {
  code: string;
  language: string;
  problem: any;
}) {
  try {
    const prompt = `
You are an AI programming tutor helping a student with a coding challenge.

PROBLEM:
${problem.title}
${problem.description}

STUDENT'S CODE (${language}):
\`\`\`${language}
${code}
\`\`\`

Your task:
1. Analyze the student's code to identify issues or areas for improvement
2. Do NOT provide a complete solution
3. Give a helpful, personalized hint that guides them toward solving the problem
4. The hint should be specific to what they've written so far
5. Focus on one key insight or improvement they need to make

Guidelines:
- Be encouraging and supportive
- If their code is on the right track, acknowledge that
- If they're stuck or going in the wrong direction, gently redirect them
- Your hint should help them learn, not just solve the problem

Return ONLY the hint text without any additional context or explanation.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error in generatePersonalizedHint:", error);
    throw error;
  }
}

// Analyze submitted solution for code quality and optimization
export async function analyzeSolution({
  code,
  language,
  problem,
}: {
  code: string;
  language: string;
  problem: any;
}) {
  try {
    const prompt = `
You are a code review system analyzing a submitted solution to a coding challenge.

PROBLEM:
${problem.title}
${problem.description}

SOLUTION (${language}):
\`\`\`${language}
${code}
\`\`\`

Please provide a comprehensive analysis in JSON format with the following fields:
1. "timeComplexity": The actual time complexity of the solution
2. "spaceComplexity": The actual space complexity of the solution
3. "analysis": A brief summary of the approach used (1-2 sentences)
4. "optimizationSuggestions": HTML-formatted detailed suggestions for optimizing the code (if applicable)
5. "educationalInsights": HTML-formatted educational insights about the problem and solution
6. "relatedProblems": An array of 2-3 related problems that would help the user build on this knowledge, each with:
   - "title": The problem title
   - "description": A brief description of the problem
   - "difficulty": Estimated difficulty level

Format your response as valid JSON only.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    try {
      // Extract JSON if it's wrapped in markdown code blocks
      const jsonContent = text.replace(/```json|```/g, "").trim();
      return JSON.parse(jsonContent);
    } catch (error) {
      console.error("Error parsing analysis response:", error);
      console.log("Raw response:", text);
      throw new Error("Failed to analyze solution. Please try again.");
    }
  } catch (error) {
    console.error("Error in analyzeSolution:", error);
    throw error;
  }
}
