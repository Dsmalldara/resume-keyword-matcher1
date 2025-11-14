import { generateText } from "ai";
import prisma from "../../lib/prisma";
import { groq } from "../../lib/ai";
import logger from "../../../utils/logger";

interface AnalysisResult {
  matchScore: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  nextSteps: string;
}

export const runAnalysis = async (
  jobDescription: string,
  resumeId: string,
): Promise<AnalysisResult> => {
  const startTime = Date.now();

  // Fetch resume content
  const resumeContent = await prisma.resumeContent.findFirst({
    where: {
      resumeId: resumeId,
    },
  });

  if (!resumeContent) {
    throw new Error("Resume content not found");
  }

  // Build structured resume text for analysis
  const structuredResume = `
Candidate Name: ${resumeContent.candidateName || "Not provided"}
Email: ${resumeContent.email || "Not provided"}
Phone: ${resumeContent.phone || "Not provided"}

Skills:
${JSON.stringify(resumeContent.skills, null, 2)}

Work Experience:
${resumeContent.experiences ? JSON.stringify(resumeContent.experiences, null, 2) : "Not provided"}

Education:
${resumeContent.education ? JSON.stringify(resumeContent.education, null, 2) : "Not provided"}

Projects:
${resumeContent.projects ? JSON.stringify(resumeContent.projects, null, 2) : "Not provided"}

Certifications:
${resumeContent.certifications ? JSON.stringify(resumeContent.certifications, null, 2) : "Not provided"}
`.trim();

  const currentDate = new Date();
  const currentDateString = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const prompt = `You are an expert technical recruiter and resume analyst. Your task is to perform a rigorous, honest assessment of how well this candidate matches this specific role.

CURRENT DATE: ${currentDateString}


JOB DESCRIPTION:
"""
${jobDescription}
"""

CANDIDATE RESUME:
"""
${structuredResume}
"""
IMPORTANT: When calculating experience, use the current date above. If a role lists "Present" as the end date, calculate from the start date to ${currentDateString}.

ANALYSIS REQUIREMENTS:

1. MATCH SCORE (0-100):
   - 90-100: Exceptional fit. Candidate exceeds requirements with proven track record
   - 70-89: Strong fit. Meets all core requirements, minor gaps in nice-to-haves
   - 50-69: Moderate fit. Meets some requirements but has notable gaps in core areas
   - 30-49: Weak fit. Significant gaps in required skills/experience
   - 0-29: Poor fit. Fundamental misalignment with role requirements
   
   Calculate based on:
   - Required skills match (40% weight)
   - Experience level and relevance (30% weight)
   - Education/certifications alignment (15% weight)
   - Domain knowledge and project experience (15% weight)

   2. EXPERIENCE CALCULATION RULES:
   - Parse all date ranges carefully (e.g., "March 2024 – June 2024")
   - Convert "Present" to the current date provided above (November 2025)
   - Calculate the duration of each role in months:
     * Count from start month to end month inclusively
     * Example: "March 2024 – June 2024" = March, April, May, June = 4 months
     * Example: "June 2024 – November 2025" = Count from June 2024 to November 2025 = 18 months
   - If roles share the same month (e.g., Role A ends June 2024, Role B starts June 2024), count June only once
   - Sum all professional experience to get total months
   - Convert to years: divide total months by 12 (e.g., 21 months = 1.75 years)
   - When stating experience in gaps/strengths, use precise decimals (e.g., "1.75 years" not "1.5 years")
   - Consider project experience (personal/freelance) as supplementary but note it separately
   - When the job requires "X years of experience", calculate if total years ≥ X
   - SHOW YOUR WORK: Explicitly state "Role 1: X months, Role 2: Y months, Total: Z months = A years"

    EXPERIENCE CALCULATION EXAMPLE:
    If a resume shows:
    - "Company A: March 2024 – June 2024"
    - "Company B: June 2024 – Present" (and current date is November 2025)

    Calculate as:
    - Company A: March 2024 to June 2024 = 4 months
    - Company B: June 2024 to November 2025 = 18 months (June 2024 through November 2025)
    - Handle overlap: Both include June 2024, so deduct 1 month
    - Total: 4 + 18 - 1 = 21 months = 1.75 years

    When stating experience: "1.75 years of professional experience (21 months total)"

3. SUMMARY:
   - State the match level directly (e.g., "Strong fit", "Moderate fit", "Weak fit")
   - Identify the ONE-THREE most critical strengths and the ONE-THREE most critical gaps
   - No generic statements. Be specific and quantifiable where possible
   - If the candidate is underqualified or overqualified, state it clearly

4. STRENGTHS:
   - List ONLY genuine, relevant strengths that directly apply to this job
   - Be specific: mention exact technologies, years of experience, or concrete achievements
   - If there are fewer than 3 real strengths, list only what exists
   - Do NOT manufacture strengths. If the candidate has only 1-2 relevant strengths, list only those
   - Format: "<Specific skill/experience> - <How it applies to the role>"

. GAPS:
   - Identify ACTUAL gaps in required qualifications, not preferences
   - Be honest about dealbreakers vs. learnable skills
   - Prioritize by severity: critical gaps first
   - If there are no significant gaps, return an empty array
   - Do NOT list gaps that don't exist just to fill the array
   - Format: "<Missing requirement> - <Impact on role performance>"

6. NEXT STEPS:
   - ONE actionable recommendation based on the match score:
     * High match (70+): Focus on interview prep for specific technical areas or behavioral scenarios
     * Medium match (40-69): Specific skills/certifications to acquire before applying
     * Low match (<40): Suggest more suitable role types or experience to gain first
   - Be direct and practical. No motivational fluff
   - If the candidate should not apply, say so clearly

CRITICAL RULES:
- Be brutally honest. A bad match score with accurate analysis is infinitely more valuable than an inflated score
- Never use phrases like "demonstrates potential", "shows promise", or other vague positivity
- If the candidate lacks required experience, say "lacks X years of required experience", not "opportunity to grow"
- Match scores should follow a normal distribution in practice - most candidates are 40-70, not 80+
- Compare against the ACTUAL job requirements, not generic industry standards
- If you cannot determine something from the resume, explicitly state "not evident in resume"

Respond with ONLY valid JSON in this exact format:
{
    "matchScore": <number between 0-100>,
    "summary": "<Direct assessment in 2-3 sentences>",
    "strengths": ["<specific strength with context>", "<another specific strength>"],
    "gaps": ["<specific gap with impact>", "<another specific gap>"],
    "nextSteps": "<single actionable recommendation based on match level>"
}`;

  try {
    const result = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      temperature: 0.1,
      prompt: prompt,
    });

    // Parse the AI response
    const text = result.text.trim();

    // Extract JSON if wrapped in markdown code blocks
    const jsonMatch =
      text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) ||
      text.match(/(\{[\s\S]*\})/);
    const jsonString = jsonMatch ? jsonMatch[1] : text;

    const analysisResult: AnalysisResult = JSON.parse(jsonString);

    // Validate the response structure
    if (
      typeof analysisResult.matchScore !== "number" ||
      typeof analysisResult.summary !== "string" ||
      !Array.isArray(analysisResult.strengths) ||
      !Array.isArray(analysisResult.gaps) ||
      typeof analysisResult.nextSteps !== "string"
    ) {
      throw new Error("Invalid analysis response format");
    }

    // Validate matchScore range
    if (analysisResult.matchScore < 0 || analysisResult.matchScore > 100) {
      throw new Error("Match score must be between 0 and 100");
    }

    const duration = Date.now() - startTime;
    logger.info({
      action: "resume_analysis",
      resumeId,
      candidateName: resumeContent.candidateName,
      duration: `${duration}ms`,
      matchScore: analysisResult.matchScore,
      success: true,
    });

    return analysisResult;
  } catch (parseError) {
    const duration = Date.now() - startTime;
    logger.error({
      action: "resume_analysis",
      resumeId,
      duration: `${duration}ms`,
      success: false,
      error: parseError instanceof Error ? parseError.message : "Unknown error",
    });

    throw new Error("Failed to analyze resume");
  }
};
