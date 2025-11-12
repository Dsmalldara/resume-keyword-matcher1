/**
 * @swagger
 * /insights/improvement-insights:
 *   get:
 *     summary: Get user's overall job improvement insights
 *     description: >
 *       Retrieves insights based on the user's job analyses, including overall average match score and improvement over previous analyses.
 *       If only one analysis exists, improvement is returned as 0.
 *     tags:
 *       - Analysis Insights
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched analysis insights
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 overallScore:
 *                   type: integer
 *                   example: 82
 *                   description: The average match score across all analyses
 *                 Improvement:
 *                   type: integer
 *                   example: 15
 *                   description: Percentage improvement compared to previous analyses
 *       404:
 *         description: User profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User profile not found
 *       500:
 *         description: Failed to fetch analysis insights
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch analysis insights
 */


import {Router, Request, Response} from "express";
import { AuthMiddleware } from "../../../middleware/auth";
import prisma from "../../../lib/prisma";
import logger from "../../../../utils/logger";


const router = Router();
router.get('/improvement-insights', AuthMiddleware, async (req: Request, res: Response) => {
    const userId = req.user?.id!;   
    const profile = await prisma.profile.findFirst({
        where:{userId:userId},
        select:{
            id:true,
            analyses:{
                select:{matchScore:true},
                orderBy:{createdAt:'desc'}
            }
        }
    })
    try{
        
        if(!profile){
            return  res.status(404).json({error:"User profile not found"});
        }
        const insights = await prisma.analysis.findMany({
            where:{profileId:profile.id},
            orderBy:{createdAt:'desc'}
        });

        const matchScores = insights.map(insight => Number(insight.matchScore));

       // Only one insight - no improvement to calculate
if (insights.length === 1) {
    return res.status(200).json({
        overallScore: Number(matchScores[0].toFixed(0)),
        avgImprovement: 0
    });
}

// Current average (all analyses) - TRUE PREPAREDNESS
const currentAvg = matchScores.reduce((a, b) => a + b, 0) / matchScores.length;

// Previous average (all except latest)
const previousScores = matchScores.slice(1);
const previousAvg = previousScores.reduce((a, b) => a + b, 0) / previousScores.length;

// Shows how latest analysis affected overall average
const avgImprovement = ((currentAvg - previousAvg) / previousAvg) * 100;

return res.status(200).json({
    overallScore: Number(currentAvg.toFixed(0)),
    AvgImprovement: Number(avgImprovement.toFixed(0))
});


       
    }catch(error){
        logger.error("Error fetching analysis insights", { error });
        return res.status(500).json({error:"Failed to fetch analysis insights"});
    }
})


export default router;