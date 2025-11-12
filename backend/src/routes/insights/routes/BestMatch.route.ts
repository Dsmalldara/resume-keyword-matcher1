/**
 * @swagger
 * /insights/best-match:
 *   get:
 *     summary: Get user's best job match score
 *     description: Retrieves the highest match score from all analyzed job descriptions for the authenticated user.
 *     tags:
 *       - Analysis Insights
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched best match score
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bestMatch:
 *                   type: integer
 *                   example: 87
 *                 message:
 *                   type: string
 *                   example: Best match score retrieved successfully
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
 *         description: Failed to fetch best match score
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch best match score
 */


import {Router, Request, Response} from "express";
import { AuthMiddleware } from "../../../middleware/auth";
import prisma from "../../../lib/prisma";
import logger from "../../../../utils/logger";



const router = Router();

router.get('/best-match', AuthMiddleware, async (req: Request, res: Response) => {
    const userId = req.user?.id!;

    try{
        const profile = await prisma.profile.findFirst({
            where:{userId:userId},
            select:{id:true,
            analyses:{select:{matchScore:true,
            },
        
        orderBy:{matchScore:'desc'},
       take:1
        }
            
        }
        })
        if(!profile){
            return  res.status(404).json({error:"User profile not found"});
        }
            const bestMatch = profile.analyses[0]?.matchScore ?? 0;  
        if(bestMatch === 0){
            return res.status(200).json({bestMatch: 0, message:"No analyses found for the user"});
        }

        return res.status(200).json({bestMatch: Number(bestMatch.toFixed(0)), message:"Best match score retrieved successfully"});
    }

    catch(error){
        logger.error("Error fetching best match score", { error });
        return res.status(500).json({error:"Failed to fetch best match score"});
    }
})

export default router;