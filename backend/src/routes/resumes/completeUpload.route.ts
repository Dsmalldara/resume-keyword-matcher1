/**
 * @swagger
 * /resume/upload/complete:
 *   post:
 *     summary: Complete resume upload
 *     description: Records a completed resume upload in the database after file has been uploaded to storage
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
 *         description: Upload recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Upload recorded successfully
 *       400:
 *         description: Validation error, invalid filepath, or file not found
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
 *         description: Resume already exists
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

import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";
import { AuthMiddleware } from "../../middleware/auth";
import { resumeUploadCompleteValidations } from "./validations/resumeValidator";
import { getStorageKey } from "./resumeUtils";
const router = Router()
router.post('/upload/complete', AuthMiddleware, resumeUploadCompleteValidations, async (req:Request, res:Response) => {
    const { filepath, filename, size } = req.body;
    const userId = req.user?.id!;
    const storageKey = await getStorageKey(userId);

    if (!storageKey) {
        return res.status(400).json({ error: "User profile not configured for uploads" });
    }

    if (!filepath.startsWith(storageKey)) {
        return res.status(400).json({ error: "Invalid filepath" });
    }

    // Check if a resume with the same NAME already exists for this user
    const existingByName = await prisma.resume.findFirst({ 
        where: { 
            storageKey: storageKey,
            name: filename,
            deletedAt: null 
        } 
    });
    
    if (existingByName) {
        return res.status(409).json({ 
            error: "A resume with this filename already exists",
            message: "Please rename your file or delete the existing resume first."
        });
    }

    // Check if this exact filepath already exists (shouldn't happen with unique uploadIds)
    const existingByPath = await prisma.resume.findFirst({ 
        where: { fileUrl: filepath } 
    });
    
    if (existingByPath) {
        return res.status(409).json({ error: "Resume already exists in database" });
    }

    return res.status(200).json({ 
        validated: true,
        message: 'Validation passed. Ready to upload to storage.',
        metadata: { filename, filepath, size }
    });
});


export default router;