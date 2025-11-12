/**
 * @swagger
 * /resume/delete/{resumeId}:
 *   delete:
 *     summary: Delete resume
 *     description: Deletes a resume file from storage and removes the database record
 *     tags:
 *       - Resume
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resumeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the resume to delete
 *         example: clx1234567890abcdef
 *     responses:
 *       200:
 *         description: Resume deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Resume deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - User does not own this resume
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized to delete this resume
 *       404:
 *         description: Resume not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Resume not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to delete resume
 */


import { Router, Request, Response } from "express";
import { logActivity } from "../../../utils/activityLogger";
import prisma from "../../lib/prisma";
import { supabase } from "../../lib/supabase";
import { AuthMiddleware } from "../../middleware/auth";
import { param, ParamSchema, validationResult } from "express-validator";
import logger from "../../../utils/logger";


const router = Router();
router.delete('/delete/:resumeId', AuthMiddleware, async (req: Request, res: Response) => {
    param('resumeId').isUUID().withMessage('Invalid resume ID');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
   const {resumeId} = req.params;
    const userId = req.user?.id!;
    
    try {
       
        const resume = await prisma.resume.findUnique({
            where: { id: resumeId },
            select: {
                id: true,
                name: true,
                version: true,
                fileUrl: true,
                profileId: true,
                profile: {
                    select: {
                        userId: true
                    }
                }
            }   
        });

        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        // 2. Verify ownership (security check)
        if (resume.profile.userId!== userId) {
            return res.status(403).json({ error: 'Unauthorized to delete this resume' });
        }

        // 3. Delete from Supabase Storage
        const { error: storageError } = await supabase.storage
            .from('resumes')
            .remove([ resume.fileUrl]);

        if (storageError) {
            logger.error('Storage deletion error', { storageError });
            // file might already be deleted
        }

        // 4. Delete from database 
        await prisma.resume.delete({
            where: { id: resumeId }
        });

       

        // 5. Log activity
        await logActivity({
            profileId: resume.profileId,
            type: 'RESUME_DELETE',
            entityId: resumeId,
            entityType: 'resume',
            message: `${resume.name} deleted`,
            metadata: {
                filename: resume.name,
                version: resume.version,
                filepath: resume.fileUrl,
            }
        });

        return res.status(200).json({ 
            message: 'Resume deleted successfully',
        });
    } catch (err) {
        logger.error('Error deleting resume', { err });
        return res.status(500).json({ error: 'Failed to delete resume' });
    }
});

export default router;