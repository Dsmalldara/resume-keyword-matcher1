/**
 * @swagger
 * /auth/validate:
 *   get:
 *     summary: Validate authentication token
 *     description: Checks if the provided token is valid. This is a lightweight endpoint used to verify authentication without fetching data.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token is valid
 *                 userId:
 *                   type: string
 *                   example: 123e4567-e89b-12d3-a456-426614174000
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import { Router, Request, Response } from "express";
import { AuthMiddleware } from "../../../middleware/auth";

const router = Router();

router.get("/validate", AuthMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    return res.status(200).json({
      message: "Token is valid",
      userId: userId,
    });
  } catch (error: any) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
