/**
 * @swagger
 * /analysis/trend:
 *   get:
 *     summary: Get match score trend data
 *     description: Retrieves analysis history with match percentages sorted by date for trend visualization
 *     tags:
 *       - Analysis
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Maximum number of records to return
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID (optional, defaults to authenticated user)
 *     responses:
 *       200:
 *         description: Trend data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   matchPercentage:
 *                     type: number
 *                   jobTitle:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

import { Router, Request, Response } from "express";
import prisma from "../../../lib/prisma";
import { AuthMiddleware } from "../../../middleware/auth";
import logger from "../../../../utils/logger";

const router = Router();

router.get("/trend", AuthMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const limit = Math.min(parseInt(req.query.limit as string) || 30, 100);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get analysis records sorted by date (most recent first)
    const analysisRecords = await prisma.profile.findUnique({
      where: { userId: userId },
      select: {
        analyses: {
          select: {
            id: true,
            createdAt: true,
            matchScore: true,
            jobTitle: true,
          },
          orderBy: {
            createdAt: "asc", // Ascending for trend visualization
          },
          take: limit,
        },
      },
    });

    const analyses = (analysisRecords?.analyses || []).map((record) => ({
      id: record.id,
      createdAt: record.createdAt,
      matchPercentage: record.matchScore,
      jobTitle: record.jobTitle,
    }));

    logger.info("Trend data retrieved", {
      requestId: req.id,
      userId,
      recordCount: analyses.length,
    });

    return res.status(200).json(analyses);
  } catch (error: any) {
    logger.error("Error fetching trend data", {
      requestId: req.id,
      error: error.message,
    });
    return res.status(500).json({ error: "Failed to fetch trend data" });
  }
});

export default router;
