/**
 * @swagger
 * /coverletters/create-letters:
 *   post:
 *     summary: Generate a tailored cover letter
 *     description: >
 *       Generates a cover letter using the user's resume content, the selected job description and optional custom notes.
 *       The generated cover letter is saved to the database and a success message is returned.
 *     tags:
 *       - Cover Letters
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
 *               - analysisId
 *             properties:
 *               resumeId:
 *                 type: string
 *                 description: ID of the resume to use
 *                 example: clx1234567890abcdef
 *               analysisId:
 *                 type: string
 *                 description: ID of the analysis to target
 *                 example: jd_9876543210abcdef
 *               customNotes:
 *                 type: string
 *                 description: Optional custom notes to include in the letter
 *                 example: I have 5 years of experience in TypeScript and Node.js.
 *     responses:
 *       200:
 *         description: Cover letter generated and saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cover Letter generated successfully
 *       400:
 *         description: Validation error - missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Profile, job description or resume content not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Profile not found
 *       500:
 *         description: Server error while generating or saving the cover letter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
import {Router, Request, Response} from "express";
import { body, validationResult } from "express-validator";

import { AuthMiddleware } from "../../../middleware/auth";
import { coverLetterValidation } from "../validations/coverLetterValidation";
import prisma from "../../../lib/prisma";
import { createLettersLimiter } from "../ratelimit/coverLetter.Limiter";
import { coverLetterInfo, generateCoverLetter } from "../utils";
import logger from "../../../../utils/logger";
import { logActivity } from "../../../../utils/activityLogger";


const router = Router();

router.post('/create-letters',AuthMiddleware, coverLetterValidation, createLettersLimiter, async (req: Request, res: Response) => {
     const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    const { resumeId, analysisId, customNotes } = req.body;
     const userId = req.user?.id!;
      try{
        
      const [data, resumeContent] = await Promise.all([prisma.profile.findUnique({
            where:{userId: userId},
            select:{id:true,
            analyses:{
                where:{resumeId:resumeId},
                select:{
                    id:true,
                    strengths:true
                },
            },
             jobDescriptions:{
                    where:{analyses:{some:{id:analysisId}}},
                    select:{id:true,
                        description:true,
                        title:true,
                    }}
            }
        }),
            prisma.resumeContent.findFirst({
        where:{resumeId:resumeId},
        select:{
            id:true,
             skills:true,  
             candidateName:true, 
            experiences:true,
            rawText:true          
        }
    })
])

        if(!data){
            return res.status(404).json({error:'Profile not found'});
        }
       if (data.jobDescriptions.length === 0) {
    return res.status(404).json({error:'Job Description not found'});
}

    const jobDescription = data.jobDescriptions[0]; 
        if(!resumeContent){
            return res.status(404).json({error:'Resume Content not found'});
        }
        const coverLetterInfo:coverLetterInfo = {
            jobTitle: jobDescription.title,
            jobDescription: jobDescription.description,
            customNotes: customNotes || null,
            strengths: data.analyses[0]?.strengths || null,
            resumeDetails: {
                candidateName: resumeContent.candidateName || '',
                skills: resumeContent.skills,
                experiences: resumeContent.experiences,
                rawText: resumeContent.rawText
            }
        }
        const generatedCoverLetter = await generateCoverLetter(coverLetterInfo);
        
        if (!generatedCoverLetter) {
            return res.status(500).json({ error: 'Failed to generate cover letter' });
        }

        res.status(200).json({message:'Cover Letter generated successfully'} );

        const savedCoverLetter = await prisma.coverLetter.create({
            data:{
                profileId: data.id,
                resumeId: resumeId,
                jobId: jobDescription.id,
                fullText: generatedCoverLetter,
                customNotes: customNotes || null,
                analysisId: data.analyses[0]?.id,
                preview: generatedCoverLetter.substring(0, 200)
            }
        });
       logger.info(`Cover letter ${savedCoverLetter.id} created for profile ${data.id}`);
           await logActivity({
                    profileId: data.id,
                    type: "COVER_LETTER_GENERATE",
                    entityId: savedCoverLetter.id,
                    entityType: "cover_letter",
                    message: `Cover letter created for job ${jobDescription.title}`,
                    metadata: {
                        resumeId: resumeId,
                        filename: resumeContent.candidateName || 'Unknown'
                    }
                });
        logger.info(`activity logged for cover letter ${savedCoverLetter.id}`);
        
      }
      catch(error){
          logger.error('Error generating cover letter', { error });
          res.status(500).json({ error: 'Internal server error' });
      }
} );

export default router;
