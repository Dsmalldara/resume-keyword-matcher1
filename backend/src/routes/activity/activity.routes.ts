import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma';
import { AuthMiddleware } from '../../middleware/auth';
import { ActivityType } from '@prisma/client';
import logger from '../../../utils/logger';


/**
 * @swagger
 * /activity/recent:
 *   get:
 *     summary: Get recent activity logs
 *     description: Retrieves the most recent activity logs for the authenticated user
 *     tags:
 *       - Activity
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Maximum number of activities to return
 *         example: 5
 *     responses:
 *       200:
 *         description: Activities retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 activities:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ActivityLog'
 *             example:
 *               activities:
 *                 - id: "clx123abc"
 *                   entityId: "resume-123"
 *                   entityType: "resume"
 *                   message: "Senior_Developer_Resume.pdf uploaded"
 *                   type: "RESUME_UPLOADED"
 *                   createdAt: "2024-10-31T10:30:00Z"
 *                   metadata:
 *                     filename: "Senior_Developer_Resume.pdf"
 *                     version: 1
 *                     fileSize: 245760
 *                 - id: "clx124def"
 *                   entityId: "job-456"
 *                   entityType: "job"
 *                   message: "92% match with Senior Developer at TechCorp"
 *                   type: "JOB_MATCHED"
 *                   createdAt: "2024-10-31T08:15:00Z"
 *                   metadata:
 *                     matchScore: 92
 *                     jobTitle: "Senior Developer at TechCorp"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Profile not found
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
 * /activity/by-type/{type}:
 *   get:
 *     summary: Get activities by type
 *     description: Retrieves activity logs filtered by activity type for the authenticated user
 *     tags:
 *       - Activity
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - RESUME_UPLOADED
 *             - RESUME_DELETED
 *             - JOB_MATCHED
 *             - JOB_APPLIED
 *             - PROFILE_UPDATED
 *         description: Type of activity to filter by
 *         example: RESUME_UPLOADED
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *           maximum: 100
 *         description: Maximum number of activities to return
 *         example: 10
 *     responses:
 *       200:
 *         description: Activities retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 activities:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ActivityLog'
 *             example:
 *               activities:
 *                 - id: "clx123abc"
 *                   entityId: "resume-123"
 *                   entityType: "resume"
 *                   message: "Senior_Developer_Resume.pdf uploaded"
 *                   type: "RESUME_UPLOADED"
 *                   createdAt: "2024-10-31T10:30:00Z"
 *                   metadata:
 *                     filename: "Senior_Developer_Resume.pdf"
 *                     version: 1
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Profile not found
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
 * components:
 *   schemas:
 *     ActivityLog:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the activity log
 *           example: clx123abc456
 *         entityId:
 *           type: string
 *           description: ID of the entity this activity relates to
 *           example: resume-123
 *         entityType:
 *           type: string
 *           description: Type of entity (resume, job, profile, etc.)
 *           example: resume
 *         message:
 *           type: string
 *           description: Human-readable activity message
 *           example: Senior_Developer_Resume.pdf uploaded
 *         type:
 *           type: string
 *           enum:
 *             - RESUME_UPLOADED
 *             - RESUME_DELETED
 *             - JOB_MATCHED
 *             - JOB_APPLIED
 *             - PROFILE_UPDATED
 *           description: Type of activity performed
 *           example: RESUME_UPLOADED
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when activity occurred
 *           example: 2024-10-31T10:30:00Z
 *         metadata:
 *           type: object
 *           nullable: true
 *           description: Additional structured data about the activity
 *           additionalProperties: true
 *           example:
 *             filename: Senior_Developer_Resume.pdf
 *             version: 1
 *             fileSize: 245760
 *         profileId:
 *           type: string
 *           format: uuid
 *           description: ID of the profile this activity belongs to
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *     ActivityType:
 *       type: string
 *       enum:
 *         - RESUME_UPLOADED
 *         - RESUME_DELETED
 *         - JOB_MATCHED
 *         - JOB_APPLIED
 *         - PROFILE_UPDATED
 *       description: Available activity types in the system
 */



const router = Router();

// routes/activity.routes.ts
router.get('/recent', AuthMiddleware, async (req: Request, res: Response) => {
    const userId = req.user?.id!;
    const limit = parseInt(req.query.limit as string) || 10;
    
    try {
        const profile = await prisma.profile.findUnique({ where: { userId } });
        
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        
        const activities = await prisma.activityLog.findMany({
            where: { profileId: profile.id },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
        
        res.json({ activities });
    } catch (error) {
       logger.error('Error fetching recent activity:', error);
        res.status(500).json({ error: 'Failed to fetch recent activity' });
    }
});

// Get activities by type
router.get('/activity/by-type/:type', AuthMiddleware, async (req: Request, res: Response) => {
    const userId = req.user?.id!;
    const { type } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;
    
    try {
        const profile = await prisma.profile.findUnique({ where: { userId } });
        
        const activities = await prisma.activityLog.findMany({
            where: { 
                profileId: profile!.id,
                type: type as ActivityType,
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
        
        res.json({ activities });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
});
export  default router