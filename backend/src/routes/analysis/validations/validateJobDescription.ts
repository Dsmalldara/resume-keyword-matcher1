
import { generateText } from 'ai';
import { groq } from '../../../lib/ai';



interface ValidationResult {
    isJobDescription: boolean;
    confidenceScore?: number;
    jobTitle?: string;
}

export const validateJobDescription = async (jobDescription: string): Promise<ValidationResult> => {


 const prompt = `You are a job description validator. Analyze the following text and determine if it's a valid job description.

Text to analyze:
"""
${jobDescription}
"""

A valid job description should include:
- Job title or role
- Company information (optional)
- Job responsibilities or duties
- Required qualifications or skills

Provide a confidence score (0-100):
- Below 40%: Not a job description
- 40% or above: Valid job description

Respond with ONLY this exact JSON format, nothing else:
{"isJobDescription": true, "confidenceScore": 85, "jobTitle": "Software Engineer"}  
or
{"isJobDescription": false}`;


    try {
       const result = await generateText({
        model: groq('qwen/qwen3-32b'),
        temperature: 0.1,
        prompt: prompt
    });

        // Parse the AI response
        const text = result.text.trim();
        
        // Extract JSON if wrapped in markdown code blocks
        const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || text.match(/(\{[\s\S]*\})/);
        const jsonString = jsonMatch ? jsonMatch[1] : text;
        
        const validationResult: ValidationResult = JSON.parse(jsonString);
        
        // Validate the response structure
        if (typeof validationResult.isJobDescription !== 'boolean') {
            throw new Error('Invalid validation response format');
        }
        
        return validationResult;
    } catch (error) {
        console.error('Error validating job description:', error);
        // Return a safe default or rethrow based on your needs
        throw new Error('Failed to validate job description');
    }
}