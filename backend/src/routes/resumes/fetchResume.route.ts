/**
 * @swagger
 * /resume/list/getResume:
 *   get:
 *     summary: Get user's resumes
 *     description: Retrieves all non-deleted resumes for the authenticated user
 *     tags:
 *       - Resume
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         description: Page number (1-indexed)
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           example: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Resumes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resumes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Resume'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     perPage:
 *                       type: integer
 *                       example: 10
 *                     totalItems:
 *                       type: integer
 *                       example: 42
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Validation error or bad request (e.g., invalid pagination params or profile not configured)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User profile not configured for uploads
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
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch resumes
 */


import {Router,Request,Response} from "express";
import { AuthMiddleware } from "../../middleware/auth";
import { getStorageKey } from "./resumeUtils";
import prisma from "../../lib/prisma";
import logger from "../../../utils/logger";


const router = Router();

router.get('/list/getResume', AuthMiddleware, async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
    }

    // Pagination params
    const page = parseInt((req.query.page as string) || "1", 10);
    const perPage = parseInt((req.query.perPage as string) || "10", 10);

    if (Number.isNaN(page) || Number.isNaN(perPage) || page < 1 || perPage < 1 || perPage > 100) {
        return res.status(400).json({ error: 'Invalid pagination parameters' });
    }

    try {
        const storageKey = await getStorageKey(userId);
        if (!storageKey) {
            return res.status(400).json({ error: "User profile not configured for uploads" });
        }

        const where = { storageKey, deletedAt: null };

        // total count for pagination
        const totalItems = await prisma.resume.count({ where });

        const resumes = await prisma.resume.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { ResumeContent: true },
            skip: (page - 1) * perPage,
            take: perPage,
        });

        const MIN_PROCESSING_TIME = 45 * 1000; // 45 seconds

        const safeResumes = resumes.map(resume => {
            const timeSinceCreation = Date.now() - resume.createdAt.getTime();
            let status = resume.status;

            // Only check status if enough time has passed
            if (timeSinceCreation > MIN_PROCESSING_TIME) {
                if (resume.ResumeContent.length > 0) {
                    status = 'processed';
                } else if (status === 'pending' || status === 'processing') {
                    status = 'failed';
                }
            }

            return {
                id: resume.id,
                name: resume.name,
                createdAt: resume.createdAt,
                updatedAt: resume.updatedAt,
                isActive: resume.isActive,
                version: resume.version,
                status: status, // Use computed status
                fileSize: Number(resume.fileSize),
            };
        });

        const totalPages = Math.ceil(totalItems / perPage) || 1;

        res.json({
            message: 'Resumes fetched successfully',
            resumes: safeResumes,
            pagination: {
                page,
                perPage,
                totalItems,
                totalPages,
            },
        });
    } catch (error) {
        logger.error('Failed to fetch resumes', { error });
        res.status(500).json({ error: 'Failed to fetch resumes' });
    }
});

export default router;

