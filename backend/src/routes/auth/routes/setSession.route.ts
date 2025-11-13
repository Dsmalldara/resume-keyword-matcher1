/**
 * @swagger
 * /auth/set-session:
 *   post:
 *     summary: Set session from OAuth callback
 *     description: Stores refresh token in httpOnly cookie after OAuth authentication
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 description: Refresh token from OAuth provider
 *               access_token:
 *                 type: string
 *                 description: Access token from OAuth provider
 *             required:
 *               - refresh_token
 *               - access_token
 *     responses:
 *       200:
 *         description: Session set successfully
 *         headers:
 *           Set-Cookie:
 *             description: Refresh token stored in httpOnly cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session established successfully
 *       400:
 *         description: Missing required tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import { Router, Request, Response } from "express";
import logger from "../../../../utils/logger";

const router = Router();

router.post("/set-session", async (req: Request, res: Response) => {
  try {
    const { refresh_token, access_token } = req.body;

    if (!refresh_token || !access_token) {
      return res.status(400).json({
        error: "Missing required tokens: refresh_token and access_token",
      });
    }

    // Set refresh token in httpOnly cookie
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // ~7 days
    });

    logger.info("Session established", {
      requestId: req.id,
      method: "POST",
      path: "/auth/set-session",
    });

    return res.status(200).json({
      message: "Session established successfully",
    });
  } catch (error: any) {
    logger.error("Error setting session", {
      error: error.message,
      requestId: req.id,
    });
    res.status(500).json({ error: error.message });
  }
});

export default router;
