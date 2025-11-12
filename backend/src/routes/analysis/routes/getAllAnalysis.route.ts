/**
 * @swagger
 * /analysis/getAnalysis:
 *   get:
 *     summary: Retrieve all analyses for the authenticated user
 *     description: Fetches all resume analyses created by the currently authenticated user, ordered by creation date (most recent first).
 *     tags:
 *       - Analysis
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
 *         description: Analyses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Analyses retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: 0de78c61-f3f2-4c23-85f7-9201a4c6ef5b
 *                       resumeId:
 *                         type: string
 *                         format: uuid
 *                         example: 6b2a31d8-7812-4a12-9b1e-b6a01de379c9
 *                       resumeName:
 *                         type: string
 *                         example: John_Doe_Resume.pdf
 *                       jobId:
 *                         type: string
 *                         format: uuid
 *                         example: b43a23b2-c0e3-4f92-b8a3-ef202f2b7c6d
 *                       jobTitle:
 *                         type: string
 *                         example: Senior Software Engineer
 *                       jobCompany:
 *                         type: string
 *                         example: OpenAI
 *                       matchScore:
 *                         type: number
 *                         example: 87.5
 *                       summary:
 *                         type: string
 *                         example: The resume aligns strongly with the job requirements in backend development and cloud infrastructure.
 *                       strengths:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Strong backend experience", "Proficient in TypeScript", "Experience with cloud services"]
 *                       gaps:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Limited experience in machine learning", "No direct mention of Docker"]
 *                       nextSteps:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Add Docker experience to resume", "Highlight cloud certifications"]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-11-06T12:34:56Z
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
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No analyses found for this user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No analyses found for this user
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import { Router, Request, Response } from "express";
import { AuthMiddleware } from "../../../middleware/auth";
import prisma from "../../../lib/prisma";

const router = Router();

router.get('/getAnalysis', AuthMiddleware, async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const page = parseInt((req.query.page as string) || "1", 10);
    const perPage = parseInt((req.query.perPage as string) || "10", 10);

    if (Number.isNaN(page) || Number.isNaN(perPage) || page < 1 || perPage < 1 || perPage > 100) {
        return res.status(400).json({ message: 'Invalid pagination parameters' });
    }

    try {
        const profile = await prisma.profile.findFirst({
            where: {
                userId: req?.user?.id
            }
        });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        const where = { profileId: profile.id };

        const totalItems = await prisma.analysis.count({ where });

        const analyses = await prisma.analysis.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            },
            skip: (page - 1) * perPage,
            take: perPage,
        });

        const data = analyses.map(analysis => ({
            id: analysis.id,
            resumeId: analysis.resumeId,
            resumeName: analysis.resumeName,
            jobId: analysis.jobId,
            jobTitle: analysis.jobTitle,
            jobCompany: analysis.jobCompany,
            matchScore: analysis.matchScore,
            summary: analysis.summary,
            strengths: analysis.strengths,
            gaps: analysis.gaps,
            nextSteps: analysis.nextSteps,
            createdAt: analysis.createdAt,
        }));

        const totalPages = Math.ceil(totalItems / perPage) || 1;

        if (data.length === 0) {
            return res.status(200).json({ message: 'No analyses found', data: [], count: 0, pagination: { page, perPage, totalItems, totalPages } });
        }

        return res.status(200).json({
            message: 'Analyses retrieved successfully',
            count: data.length,
            data,
            pagination: {
                page,
                perPage,
                totalItems,
                totalPages,
            }
        });
    } catch (error) {
        console.error('Error fetching analyses:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;