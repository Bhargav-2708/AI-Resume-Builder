import type { ResumeData } from "./resume-types";

export interface ReviewIssue {
  type: "error" | "warning" | "tip";
  section: string;
  message: string;
  fix: string;
}

export interface ReviewResult {
  overallScore: number;
  atsScore: number;
  impactScore: number;
  completenessScore: number;
  issues: ReviewIssue[];
  strengths: string[];
  summary: string;
}

/**
 * Calls the backend API to get a Claude AI review of the resume.
 */
export async function reviewResume(data: ResumeData): Promise<ReviewResult> {
  try {
    const response = await fetch('/api/ai-review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`AI Review API failed with status ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('AI Review error:', error);
    // Fallback error message for the UI
    return {
      overallScore: 0,
      atsScore: 0,
      impactScore: 0,
      completenessScore: 0,
      issues: [{
        type: "error",
        section: "System",
        message: "The AI Review service is currently unavailable.",
        fix: "Check your backend server and ensure the GEMINI_API_KEY is correctly set in backend/.env"
      }],
      strengths: [],
      summary: "We couldn't connect to the AI Review engine. Please verify your API settings."
    };
  }
}
