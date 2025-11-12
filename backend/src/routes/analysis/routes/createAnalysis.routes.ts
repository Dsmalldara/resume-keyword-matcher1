
/**
 * @swagger
 * /analysis/analyze:
 *   post:
 *     summary: Analyze a resume against a job description
 *     description: >
 *       Performs an AI-powered analysis comparing a user's resume to a provided job description.  
 *       Requires authentication and validates both the resume ownership and the job description content before analysis.
 *     tags:
 *       - Analysis
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resumeId
 *               - jobDescription
 *             properties:
 *               jobTitle:
 *                 type: string
 *                 description: Title of the job position
 *                 example: Senior Software Engineer
 *               company:
 *                 type: string
 *                 description: Company name for the job position
 *                 example: OpenAI
 *               jobDescription:
 *                 type: string
 *                 description: The full job description text used for resume analysis
 *                 example: >
 *                   We are seeking a Senior Software Engineer proficient in TypeScript, Node.js, and cloud technologies to join our backend team...
 *               resumeId:
 *                 type: string
 *                 format: uuid
 *                 description: The unique ID of the resume to analyze
 *                 example: 6b2a31d8-7812-4a12-9b1e-b6a01de379c9
 *     responses:
 *       201:
 *         description: Analysis completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Analysis completed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     analysisId:
 *                       type: string
 *                       format: uuid
 *                       example: 0de78c61-f3f2-4c23-85f7-9201a4c6ef5b
 *                     jobDescriptionId:
 *                       type: string
 *                       format: uuid
 *                       example: b43a23b2-c0e3-4f92-b8a3-ef202f2b7c6d
 *       400:
 *         description: Validation error or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationError'
 *                 - type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: The provided text does not appear to be a valid job description
 *                     details:
 *                       type: string
 *                       example: Please provide a proper job description with role details, requirements, and responsibilities.
 *       401:
 *         description: Unauthorized - Missing or invalid bearer token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Profile or resume not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Resume not found or does not belong to this user
 *       503:
 *         description: External service unavailable (validation or analysis failure)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unable to analyze resume at this time
 *                 details:
 *                   type: string
 *                   example: Please try again later
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */


import { Router, Request, Response } from "express";
import { createAnalysisValidations } from "../validations/createAnalysisValidation";
import { AuthMiddleware } from "../../../middleware/auth";
import { analysisLimiter } from "../ratelimit/rateLimiter";
import { validationResult } from "express-validator";
import prisma from "../../../lib/prisma";
import { validateJobDescription } from "../validations/validateJobDescription";
import { runAnalysis } from "../utils";
import { logActivity } from "../../../../utils/activityLogger";

const router = Router();
 
router.post('/analyze',createAnalysisValidations,AuthMiddleware,analysisLimiter, async (request: Request, response: Response) => {
        try {
            const error = validationResult(request);
            if (!error.isEmpty()) {
                return response.status(400).json({ errors: error.array() });
            }

            const userId = request.user?.id!;
            const jobDescriptionText = request.body.jobDescription;
            const resumeId = request.body.resumeId;

            // Find user profile
            const profile = await prisma.profile.findUnique({
                where: {
                    userId: userId
                },
                select: {
                    id: true
                }
            });

            if (!profile) {
                return response.status(404).json({ 
                    error: "Profile not found" 
                });
            }

            // Verify resume exists and belongs to user
            const resume = await prisma.resume.findFirst({
                where: {
                    id: resumeId,
                    profileId: profile.id // Security check: ensure user owns this resume
                }
            });

            if (!resume) {
                return response.status(404).json({
                    error: "Resume not found or does not belong to this user"
                });
            }

            // Validate job description with AI
            const validation = await validateJobDescription(jobDescriptionText);
            
            if (!validation.isJobDescription) {
                return response.status(400).json({ 
                    error: "The provided text does not appear to be a valid job description",
                    details: "Please provide a proper job description with role details, requirements, and responsibilities."
                });
            }

            // Create job description record
            const jobDescription = await prisma.jobDescription.create({
                data: {
                    title: request.body.jobTitle  || validation.jobTitle || 'Not provided',
                    company: request.body.company || 'NA',
                    description: jobDescriptionText,
                    confidenceScore: validation.confidenceScore || null,
                    profileId: profile.id
                }
            });

            // Run analysis
            const analysisData = await runAnalysis(jobDescriptionText, resumeId);

            // Save analysis to database with await
            const savedAnalysis = await prisma.analysis.create({
                data: {
                    resumeId: resumeId,
                    resumeName: resume.name,
                    jobId: jobDescription.id,
                    jobTitle: jobDescription.title,
                    jobCompany: jobDescription.company,
                    matchScore: analysisData.matchScore,
                    summary: analysisData.summary,
                    strengths: analysisData.strengths,
                    gaps: analysisData.gaps,
                    nextSteps: analysisData.nextSteps,
                    profileId: profile.id
                }
            });

              // Log activity
                    await logActivity({
                        profileId: profile.id,
                        type: "ANALYSIS_COMPLETE",
                        entityId: resume.id,
                        entityType: "resume",
                        message: `${resume.name} analyzed against job  ${jobDescription.title}`,
                        metadata: {
                            resumeId: resume.id,
                            filename: resume.name
                        }
                    });
            return response.status(201).json({
                success: true,
                message: "Analysis completed successfully",
                data: {
                    analysisId: savedAnalysis.id,
                    jobDescriptionId: jobDescription.id,
                   
                }
            });

        } catch (error) {
            console.error('Error in /analyze endpoint:', error);
            
            // Handle specific error types
            if (error instanceof Error) {
                // Job description validation errors
                if (error.message.includes('validate job description')) {
                    return response.status(503).json({
                        error: "Unable to validate job description at this time",
                        details: "Please try again later"
                    });
                }
                
                // Resume analysis errors
                if (error.message.includes('Resume content not found')) {
                    return response.status(404).json({
                        error: "Resume content not found",
                        details: "Please ensure the resume has been properly uploaded and processed"
                    });
                }
                
                if (error.message.includes('Failed to analyze resume')) {
                    return response.status(503).json({
                        error: "Unable to analyze resume at this time",
                        details: "Please try again later"
                    });
                }
            }

            // Generic error response
            return response.status(500).json({
                error: "An error occurred while processing your request"
            });
        }
    }
);

export default router;

