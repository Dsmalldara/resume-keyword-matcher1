/**
 * @swagger
 * /resume/upload/finalize:
 *   post:
 *     summary: Finalize resume upload
 *     description: Creates database record after file has been successfully uploaded to storage
 *     tags:
 *       - Resume
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - filepath
 *               - filename
 *               - size
 *             properties:
 *               filepath:
 *                 type: string
 *                 description: Storage path of the uploaded file
 *                 example: user-key/uuid/resume.pdf
 *               filename:
 *                 type: string
 *                 description: Original filename
 *                 example: my-resume.pdf
 *               size:
 *                 type: integer
 *                 description: File size in bytes
 *                 example: 1048576
 *     responses:
 *       201:
 *         description: Upload finalized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Upload finalized successfully
 *       400:
 *         description: Validation error, invalid filepath, or file not found in storage
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationError'
 *                 - $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Resume record already exists in database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import {Router,Request,Response} from "express";
import { validationResult } from "express-validator";
import { logActivity } from "../../../utils/activityLogger";
import prisma from "../../lib/prisma";
import { AuthMiddleware } from "../../middleware/auth";
import { resumeUploadCompleteValidations } from "./validations/resumeValidator";
import { getStorageKey } from "./resumeUtils";
import logger from "../../../utils/logger";

const router = Router();
router.post('/upload/finalize', AuthMiddleware, resumeUploadCompleteValidations, async (req: Request, res: Response) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).json({ errors: validationErrors.array() });
    }
    
    const { filepath, filename, size } = req.body;
    const userId = req.user?.id!;
    const storageKey = await getStorageKey(userId);
    const resumeId = filepath.split('/')[1]; // Extract resumeId from filepath

    if (!storageKey) {
        return res.status(400).json({ error: "User profile not configured for uploads" });
    }

    if (!filepath.startsWith(storageKey)) {
        return res.status(400).json({ error: "Invalid filepath" });
    }

    try {
        const profileId = (await prisma.profile.findUnique({ where: { userId } }))!.id;
        
        // Get next version number
        const latestResume = await prisma.resume.findFirst({
            where: { storageKey, deletedAt: null },
            orderBy: { version: 'desc' },
        });
        const newVersion = (latestResume?.version || 0) + 1;

        // Create resume record
        const resume = await prisma.resume.create({
            data: {
                id: resumeId,
                storageKey,
                profileId,
                name: filename,
                fileUrl: filepath,
                fileSize: size,
                version: newVersion,
                isActive: true,
            },
        });

        // Log activity
        await logActivity({
            profileId,
            type: 'RESUME_UPLOAD',
            entityId: resume.id,
            entityType: 'resume',
            message: `${filename} uploaded`,
            metadata: {
                filename,
                version: newVersion,
                fileSize: size,
                filepath,
            }
        });

        // ✅ Convert BigInt to string before sending response
        res.status(201).json({ 
            message: 'Upload finalized successfully', 
        });
    } catch (err) {
        logger.error('Error finalizing upload', { err });
        res.status(500).json({ error: 'Failed to finalize upload' });
    }
});



export default router;