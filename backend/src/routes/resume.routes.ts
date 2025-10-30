

import { Router, Request, Response } from "express";
import { AuthMiddleware } from "../middleware/auth";
import { resumeUploadAccessValidations, resumeUploadCompleteValidations } from "../validations/resumeValidator";
import { validationResult } from "express-validator";
import {supabase} from "../lib/supabase";
import crypto from 'crypto';
import prisma from "../lib/prisma";
import { createClient } from "@supabase/supabase-js";
import sanitize from 'sanitize-filename';
import path from 'path';

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
 *                 resume:
 *                   $ref: '#/components/schemas/Resume'
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
 *                 resume:
 *                   $ref: '#/components/schemas/Resume'
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

const sanitizeFilename = (filename: string, uploadId: string): string => {
    const ext = path.extname(filename).toLowerCase();
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
    
    if (!allowedExtensions.includes(ext)) {
        throw new Error(`File type ${ext} not allowed`);
    }
    
    return `${uploadId}${ext}`;
};



async function getStorageKey(userId: string) {
  try {
    console.log("Fetching storage key for userId:", userId);
    
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { storageKey: true },
    });
    
    console.log("Profile retrieved:", profile);
    
    if (!profile) {
      console.error("No profile found for userId:", userId);
      return null;
    }
    
    if (!profile.storageKey) {
      console.error("Profile exists but storageKey is null/undefined for userId:", userId);
      return null;
    }
    
    console.log("Storage key found:", profile.storageKey);
    return profile.storageKey;
    
  } catch (err) {
    console.error("Error fetching storage key:", err);
    throw err;
  }
}


const router = Router();
router.post('/upload/presign', AuthMiddleware, resumeUploadAccessValidations, async (req:Request, res:Response) => {
    console.log("===== PRESIGN ROUTE HIT =====");
    console.log("User from middleware:", req.user);
    console.log("Authorization header:", req.headers.authorization);
    const validationErrors = validationResult(req);
    const uploadId = crypto.randomUUID();
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
        filename = sanitizeFilename(filename, uploadId);
        const { data: testUser, error: testError } = await userSupabase.auth.getUser();
    console.log("Test user from Supabase:", testUser);
    console.log("Test error:", testError);
        const filepath = `${storageKey}/${uploadId}/${filename}`;
        console.log("Filepath:", filepath);
        console.log("Token present:", !!token);

        const { data, error: supabaseError } = await userSupabase.storage
            .from("resumes")
            .createSignedUploadUrl(filepath);
        
        if (supabaseError) {
            console.error("Supabase error:", supabaseError);
            return res.status(500).json({ error: supabaseError?.message || supabaseError });
        }

        return res.status(200).json({ uploadUrl: data?.signedUrl, filepath });
    }
    catch(err){
        console.error("Upload presign error:", err);
        return res.status(500).json({ error: 'Failed to generate upload URL' });
    }
});


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

router.post('/upload/finalize', AuthMiddleware, resumeUploadCompleteValidations, async (req:Request, res:Response) =>  {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()){
        return res.status(400).json({errors: validationErrors.array()});
    }
    
    const { filepath, filename, size } = req.body;
    const userId = req.user?.id!;
    const storageKey = await getStorageKey(userId);

    if (!storageKey) {
        return res.status(400).json({ error: "User profile not configured for uploads" });
    }

    if (!filepath.startsWith(storageKey)) {
        return res.status(400).json({ error: "Invalid filepath" });
    }

    const uploadId = filepath.split('/')[1];

    // Verify file NOW exists in Supabase Storage
    const { data: exists, error } = await supabase.storage
        .from('resumes')
        .list(`${storageKey}/${uploadId}`, { limit: 1 });

    if (!exists || exists.length === 0) {
        return res.status(400).json({ error: 'File not found in storage. Upload may have failed.' });
    }

    // Check if DB record already exists
    const existing = await prisma.resume.findFirst({ where: { fileUrl: filepath } });
    if (existing) {
        return res.status(409).json({ error: "Resume record already exists" });
    }

    try {
        // Find the current highest version number
        const latestResume = await prisma.resume.findFirst({
            where: { storageKey: storageKey, deletedAt: null },
            orderBy: { version: 'desc' },
        });

        const newVersion = (latestResume?.version || 0) + 1;

        const resume = await prisma.resume.create({
            data: {
                id: crypto.randomUUID(),
                storageKey: storageKey,
                profileId: (await prisma.profile.findUnique({ where: { userId } }))!.id,
                name: filename,
                fileUrl: filepath,
                fileSize: BigInt(size),
                version: newVersion,
                isActive: true,
            },
        })
        
        res.status(201).json({ 
            message: 'Upload finalized successfully', 
            resume 
        });
    }
    catch(err){
        console.error('Error finalizing upload:', err)
        res.status(500).json({ error: 'Failed to finalize upload' });
    }
})
 

export default router;

