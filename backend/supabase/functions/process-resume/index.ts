import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from '@ai-sdk/groq';
import { extractDocxText } from '../../_shared/extractDocxText.ts';
import { extractTxtText } from '../../_shared/extractTxtText.ts';
import { extractPdfText } from '../../_shared/pdf-extractor.ts';
import { createId } from 'https://esm.sh/@paralleldrive/cuid2@2.2.2';


const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/rtf"
];

// Helper: retry fetching resume by storageKey



serve(async (req: Request) => {
  console.log("===== Function hit =====");
  console.log("SUPABASE_URL:", Deno.env.get('SUPABASE_URL'));
  console.log("SUPABASE_SERVICE_ROLE_KEY present:", !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const event = await req.json() as { type: string; table: string; record: { name: string } };
  console.log('Received event:', event);

  try {
    if (event.type === "INSERT" && event.table === "objects") {
      const filepath = event.record.name;
      console.log('Processing file:', filepath);

      // Extract storageKey and uploadId from filepath
      const pathParts = filepath.split('/');
      if (pathParts.length < 3) {
        console.error('Invalid file path structure:', filepath);
        return new Response("Invalid file path structure", { status: 400 });
      }

      const resumeId = pathParts[1];
      const filename = pathParts.slice(2).join('/'); 
      const storageKey = pathParts[0];

      console.log('Extracted values -> storageKey:', storageKey, 'resumeId:', resumeId, 'filename:', filename);

      // 1. Download file
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('resumes')
        .download(filepath);

      if (downloadError || !fileData) {
        console.error('Download error:', downloadError);
        return new Response("Error downloading file", { status: 500 });
      }

      console.log('File downloaded successfully, MIME type:', fileData.type);

      const contentType = fileData.type;
      if (!ALLOWED_MIME_TYPES.includes(contentType)) {
        console.error('File type not allowed:', contentType);
        return new Response("File type not allowed", { status: 400 });
      }

      // 2. Extract text
      let rawText: string;
      if (contentType === "application/pdf") {
        rawText = await extractPdfText(fileData);
      } else if (
        contentType === "application/msword" ||
        contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        rawText = await extractDocxText(fileData);
      } else if (contentType === "text/plain") {
        rawText = await extractTxtText(fileData);
      } else {
        return new Response("Unsupported file type", { status: 400 });
      }

      console.log('Extracted text length:', rawText.length);

      // 3. Parse with Gemini
      const parsedData = await processResume(rawText);
      console.log('Parsed resume data successfully:', {
        candidateName: parsedData.candidateName,
        email: parsedData.email,
        phone: parsedData.phone,
      });

      // 4. Check if ResumeContent already exists
      console.log('Checking if resume_contents record exists for resumeId:', resumeId);
      const { data: existingContent, error: selectError } = await supabase
        .from('resume_contents')
        .select('id')
        .eq('resumeId', resumeId)
        .single();

      if (selectError) console.warn('Select error (may be null if not found):', selectError);
      console.log('Existing content found:', !!existingContent);

      if (existingContent) {
        // Update existing
        console.log('Updating existing resume_contents record');
        const { error: updateError } = await supabase
          .from('resume_contents')
          .update({
            candidateName: parsedData.candidateName,
            email: parsedData.email,
            phone: parsedData.phone,
            skills: parsedData.skills,
            experiences: parsedData.experiences,
            education: parsedData.education,
            certifications: parsedData.certifications,
            projects: parsedData.projects,
            rawText: parsedData.rawText,
            updatedAt: new Date().toISOString()
          })
          .eq('resumeId', resumeId);

        if (updateError) {
          console.error('Database update error:', updateError);
          return new Response("Error updating database", { status: 500 });
        }
      } else {
        // Insert new
        const now = new Date().toISOString();
        console.log('Inserting new resume_contents record');
        const { error: insertError } = await supabase
          .from('resume_contents')
          .insert({
            id: createId(),                        
            resumeId: resumeId,
            candidateName: parsedData.candidateName,
            email: parsedData.email,
            phone: parsedData.phone,
            skills: parsedData.skills,
            experiences: parsedData.experiences,
            education: parsedData.education,
            certifications: parsedData.certifications,
            projects: parsedData.projects,
            rawText: parsedData.rawText,
            createdAt: now,                         
            updatedAt: now                          
          });
          const {error:changeStatusError} = await supabase.from('resumes')
          .update({status:'processed',
              updatedAt: new Date().toISOString() 
          })
          .eq('id',resumeId)
          if(changeStatusError){
            console.error('Error updating resume status:', changeStatusError);
            return new Response("Error updating resume status", { status: 500 });
          }

        if (insertError) {
          console.error('Database insert error:', insertError);
          await supabase.from('resumes')
          .update({status:'analysis failed',
              updatedAt: new Date().toISOString() 
          }
          )
          .eq('id',resumeId);
          return new Response("Error inserting into database", { status: 500 });
        }
      }

      console.log('Saved to resume_contents table successfully');

      return new Response(
        JSON.stringify({ 
          status: 'ok', 
          resumeId,
          message: 'Resume processed successfully' 
        }), 
        { status: 200 }
      );
    }

    console.log('Event ignored:', event.type, event.table);
    return new Response(JSON.stringify({ status: 'ignored' }), { status: 200 });

  } catch (err) {
    console.error('Unexpected error:', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: errorMessage }), 
      { status: 500 }
    );
  }
});


// STEP 1: Parse structured data with token optimization
async function parseResumeWithGemini(rawText: string) {
  const google = createGroq({
    apiKey: Deno.env.get("GROQ_API_KEY")!,
  });

  const model = google("openai/gpt-oss-120b");

  const prompt = `
You are a structured data parser. Extract accurate details from this resume and return ONLY valid JSON in this exact format:
{
  "candidateName": string,
  "email": string,
  "phone": string,
  "skills": string[],
  "experiences": [
    {
      "title": string,
      "company": string,
      "period": string,
      "description": string,
      "responsibilities": string[]
    }
  ],
  "education": [
    {
      "degree": string,
      "institution": string,
      "period": string,
      "gpa": string
    }
  ],
  "certifications": [
    {
      "name": string,
      "issuer": string,
      "date": string
    }
  ],
  "projects": [
    {
      "name": string,
      "description": string,
      "technologies": string[],
      "url": string
    }
  ]
}

CRITICAL OPTIMIZATION RULES:
- Keep each responsibility to MAX 15 words - focus only on action and outcome
- Remove filler phrases like "Actively participated", "Collaborated with", "Responsible for"
- Project descriptions must be MAX 50 words (2-3 sentences)
- Experience descriptions should be MAX 100 words
- State what was DONE and the IMPACT, nothing else
- Be direct: "Built X using Y, achieving Z" not "Successfully collaborated to build X"

Return *only* the JSON. Do not explain or format anything.

Resume text:
${rawText}
`;

  const { text } = await generateText({
    model,
    prompt,
    temperature: 0.2,
    maxOutputTokens: 2048,
  });

  // Clean + safe JSON parse
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("Gemini invalid JSON:", text);
    throw new Error("Gemini returned invalid JSON");
  }
}

// STEP 2: Create concise professional summary (200-250 words, ~40% token reduction)
async function summarizeResume(parsedResume: Record<string, any>) {
  const google = createGoogleGenerativeAI({
    apiKey: Deno.env.get("GEMINI_API_KEY")!,
  });

  const model = google("gemini-2.5-pro");

  const prompt = `
Create a concise professional summary (200-250 words MAX) focusing on:
1. Career level and primary specialization
2. Key technical strengths (themes, not exhaustive lists)
3. Most impactful achievements (quantify when possible)
4. Notable projects or domains

AVOID:
- Repeating company names, dates, or full tech stacks (already in structured data)
- Filler phrases like "highly motivated", "team player", "passionate about"
- Listing every skill or responsibility

BE DIRECT AND FACTUAL. Focus on what makes this candidate distinctive.

Data:
${JSON.stringify(parsedResume, null, 2)}
`;

  const { text } = await generateText({
    model,
    prompt,
    temperature: 0.3,
    maxOutputTokens: 400,  // Reduced from 700
  });

  return text.trim();
}

// STEP 3: Combine both
async function processResume(rawText: string) {
  const structuredData = await parseResumeWithGemini(rawText);
  const summary = await summarizeResume(structuredData);

  // ✅ Return summary as rawText field
  return {
    ...structuredData,
    rawText: summary,
  };
}