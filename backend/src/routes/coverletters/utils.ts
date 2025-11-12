import { JsonValue } from "@prisma/client/runtime/library";
import { gemini } from "../../lib/ai";
import { generateText } from "ai";
import logger from "../../../utils/logger";


export type coverLetterInfo = {
    jobTitle: string;
    jobDescription: string;
    customNotes: any;
    strengths: string[];
    resumeDetails: {
        candidateName:string,
        skills: JsonValue;
        experiences: JsonValue;
        rawText: string;
    };
}

// Retry mechanism for generation errors
const generateWithRetry = async (prompt: string, retries: number = 2): Promise<string> => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await generateText({
        model: gemini('gemini-2.5-pro'),
        prompt,
        temperature: 0.2,
        maxOutputTokens: 2500,
      });

      const text = result.text?.trim();
      if (!text) {
        throw new Error();
      }

      return text;    
    } catch (error) {
      if (i === retries - 1) throw new Error("Max retries reached", { cause: error });

      const delay = 1000 * Math.pow(2, i); // Exponential backoff: 1s, 2s, 4s, ...
      logger.warn(`Generation attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error("Unexpected error in generateWithRetry"); // fallback
};



export const generateCoverLetter = async (data: coverLetterInfo) => {
      if (!data.jobTitle || !data.jobDescription) {
        throw new Error("Missing required fields: jobTitle and jobDescription are mandatory");
    }
    const startTime = Date.now()


    // Build dynamic sections
    const sections = {
        candidateName: `CANDIDATE NAME: ${data.resumeDetails.candidateName}`,
        job: `JOB TITLE: ${data.jobTitle}\n\nJOB DESCRIPTION:\n${data.jobDescription}`,
        
        strengths: data.strengths?.length 
            ? `\n\nCANDIDATE STRENGTHS (analyzed match with job):\n${data.strengths.map(s => `- ${s}`).join('\n')}`
            : '',
        
        skills: `\n\nSKILLS:\n${Array.isArray(data.resumeDetails.skills) 
            ? data.resumeDetails.skills.join(', ') 
            : data.resumeDetails.skills}`,
        
        experience: `\n\nWORK EXPERIENCE:\n${data.resumeDetails.experiences}`,
        
        summary: data.resumeDetails.rawText 
            ? `\n\nPROFESSIONAL SUMMARY:\n${data.resumeDetails.rawText}`
            : '',
        
        notes: data.customNotes 
            ? `\n\nSPECIAL INSTRUCTIONS:\n${data.customNotes}`
            : ''
    };

const prompt = `You are an expert cover letter writer specializing in matching candidates to job opportunities.

TASK: Write a compelling, professional cover letter for this job application.

${sections.candidateName}
${sections.job}
${sections.strengths}
${sections.skills}
${sections.experience}
${sections.summary}
${sections.notes}

WRITING GUIDELINES:

Priority Hierarchy:
1. If Special Instructions are provided, these are MANDATORY - incorporate all requirements specified
2. Emphasize strengths that directly align with job requirements - these should form the core narrative
3. Highlight relevant work experiences that match the role - prioritize recent and impactful roles
4. Feature skills that appear in both the resume and job description - these are proof points
5. Include transferable skills and experiences only if they add genuine value to the narrative

CRITICAL CONTENT RULES:
- MANDATORY: The opening paragraph MUST include the candidate's full name from the CANDIDATE NAME field provided above. Start with "My name is [Full Name]" or "I am [Full Name]"
- If a strength, experience, or skill has NO clear connection to the job requirements, do NOT force it into the letter
- If a strength, experience, or skill has NO clear connection to the job requirements, do NOT force it into the letter
- Focus on quality over quantity - better to have 2-3 strong, relevant points than 5 weak ones
- Every claim must be backed by specific evidence from the candidate's background
- If the candidate lacks direct experience for key requirements, acknowledge fit through transferable skills or learning capability, but do NOT fabricate qualifications
- When work experience doesn't directly match, focus on the underlying competencies and achievements that transfer to the target role

Structure Requirements:
- Salutation: Begin with "Dear Hiring Manager," or "Dear [Company Name] Team,"
- Opening paragraph (2-3 sentences): Start with "I am writing to apply for the [Job Title] position" or similar professional opening. Briefly establish your relevant background and value proposition.
- Body paragraphs (2-3 paragraphs): 
  * First body: Most relevant experience or strength with concrete example
  * Second body: Additional qualifications, skills, or achievements that differentiate the candidate
  * Optional third: Address any unique aspects from Special Instructions or explain career pivot if relevant
- Closing paragraph (2-3 sentences): Express genuine enthusiasm for the specific opportunity, include clear call to action
- Sign-off: End with "Sincerely," or "Best regards," followed by a blank line
- Target length: 300-400 words total (body content)
- Use 3-4 body paragraphs total (never exceed 4)

Tone & Style:
- Professional but personable - write like a confident peer, not a desperate applicant
- Confident without arrogance - state qualifications clearly but humbly
- Specific over generic - use numbers, names, technologies, concrete examples
- Active voice over passive - "I led" not "I was responsible for leading"
- Show genuine interest in THIS role at THIS company - avoid language that could apply to any job
- Match the tone to the industry (tech: slightly casual; finance: more formal; startup: enthusiastic)

STRICTLY AVOID:
- Generic filler statements: "team player", "hard worker", "fast learner", "results-oriented", "detail-oriented", "thinking outside the box"
- Simply restating resume bullet points without adding context or impact
- Exaggeration or claims without evidence from the provided background
- Mentioning salary, benefits, work-life balance, or "what the company can do for me"
- Apologizing for lack of qualifications or explaining why you're NOT qualified
- Including any placeholders like [Your Name], [Company Name], [Hiring Manager], [Date]
- Using overly formal language ("henceforth", "aforementioned", "pursuant to")
- Making assumptions about company culture, values, or future plans not mentioned in the job description

QUALITY CHECKS (self-review before finalizing):
- Does every sentence add unique value, or is there fluff?
- Are there specific examples and metrics, or vague claims?
- Would this letter work for a different job/company? If yes, it's too generic
- Does it show WHY this candidate for THIS role, not just that they're qualified?
- Is there a clear narrative arc from opening to closing?

FORMAT REQUIREMENTS:
Write a complete, properly formatted cover letter including:
- Salutation: "Dear Hiring Manager," or similar
- Opening paragraph that introduces the candidate BY NAME and the position they're applying for
- Body paragraphs with proper spacing (blank line between paragraphs)
- Professional closing: "Sincerely," or "Best regards,"
- Candidate's full name on the line after the closing
- Write in first person ("I have...", "My experience...")

OUTPUT: Begin writing the complete cover letter now.`;


try{
   const result = await generateWithRetry(prompt, 2);
    const endTime = Date.now()
    logger.info(`Cover letter generated in ${(endTime - startTime)/1000} seconds`);
    logger.info(`name is ${sections.candidateName}`);
    return result;

}
catch(error){
    logger.error("Error generating cover letter:", error);
    throw error;
}

}