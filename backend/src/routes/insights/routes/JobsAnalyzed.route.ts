/**
 * @swagger
 * /insights/jobs-analyzed:
 *   get:
 *     summary: Get count of jobs analyzed by the authenticated user
 *     tags: [Analysis Insights]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched job analysis count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     jobsAnalyzed:
 *                       type: integer
 *                       example: 7
 *       404:
 *         description: User profile not found
 *       500:
 *         description: Failed to fetch jobs analyzed count
 */


import {Router, Request, Response} from "express";
import { AuthMiddleware } from "../../../middleware/auth";
import prisma from "../../../lib/prisma";
import logger from "../../../../utils/logger";


const router = Router();
router.get('/jobs-analyzed', AuthMiddleware, async (req: Request, res: Response) => {
    const userId = req.user?.id!;
    try{
        const Profile = await prisma.profile.findFirst({
            where:{userId:userId},
            select:{id:true,
               _count:{select:{jobDescriptions:true }}
            }
        })
        if(!Profile){
            return  res.status(404).json({error:"User profile not found"});
        }
          const jobsAnalyzedCount = Number(Profile._count.jobDescriptions) || 0;
    logger.info("Jobs Analyzed Count", { jobsAnalyzedCount });
        return res.status(200).json({jobsAnalyzed: jobsAnalyzedCount});
    }catch(error){
        logger.error("Error fetching jobs analyzed count", { error });
        return res.status(500).json({error:"Failed to fetch jobs analyzed count"});
    }
})

export default router;