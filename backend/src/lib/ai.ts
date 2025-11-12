import { createGroq } from '@ai-sdk/groq';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not set in environment variables');
}

export const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
});


export const gemini = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
});
