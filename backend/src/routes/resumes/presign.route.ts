
/**
 * @swagger
 * /resume/upload/presign:
 *   post:
 *     summary: Generate a presigned upload URL
 *     description: Creates a presigned URL for uploading a resume file to Supabase storage
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
 *               - filename
 *               - access_token
 *             properties:
 *               filename:
 *                 type: string
 *                 description: Name of the file to upload
 *                 example: my-resume.pdf
 *               access_token:
 *                 type: string
 *                 description: User's access token for authentication
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Presigned URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uploadUrl:
 *                   type: string
 *                   description: Presigned URL for uploading the file
 *                 filepath:
 *                   type: string
 *                   description: Storage path where file will be saved
 *       400:
 *         description: Validation error or user profile not configured
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
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import { createClient } from "@supabase/supabase-js";
import { Router, Request, Response } from "express";
import { validationResult } from "express-validator";
import { AuthMiddleware } from "../../middleware/auth";
import { resumeUploadAccessValidations } from "./validations/resumeValidator";
import { getStorageKey, sanitizeFilename } from "./resumeUtils";
import logger from "../../../utils/logger";




const router = Router();
router.post('/upload/presign', AuthMiddleware, resumeUploadAccessValidations, async (req:Request, res:Response) => {
    logger.debug("PRESIGN route hit", { user: req.user, authorizationHeader: req.headers.authorization });
    const validationErrors = validationResult(req);
    const resumeId = crypto.randomUUID();
    if(!validationErrors.isEmpty()){
        return res.status(400).json({errors: validationErrors.array()});
    }
    const userId = req.user?.id!;
    let { filename } = req.body;


    const storageKey = await getStorageKey(userId);
    if (!storageKey) {
        return res.status(400).json({ error: "User profile not configured for uploads" });
    }
    
    try{
        const token = req.cookies?.access_token || req.body?.access_token;
        
        if (!token) {
            return res.status(401).json({ error: "No access token found" });
        }
        
        // Create Supabase client WITH user's token
        const userSupabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            }
        );
        filename = sanitizeFilename(filename, resumeId);
        const { data: testUser, error: testError } = await userSupabase.auth.getUser();
    logger.debug("Test user from Supabase", { testUser, testError });
        const filepath = `${storageKey}/${resumeId}/${filename}`;
    logger.debug("Presign filepath and token presence", { filepath, tokenPresent: !!token });

        const { data, error: supabaseError } = await userSupabase.storage
            .from("resumes")
            .createSignedUploadUrl(filepath);
        
        if (supabaseError) {
            logger.error("Supabase error", { supabaseError });
            return res.status(500).json({ error: supabaseError?.message || supabaseError });
        }

        return res.status(200).json({ uploadUrl: data?.signedUrl, filepath });
    }
    catch(err){
        logger.error("Upload presign error", { err });
        return res.status(500).json({ error: 'Failed to generate upload URL' });
    }
});



export default router;