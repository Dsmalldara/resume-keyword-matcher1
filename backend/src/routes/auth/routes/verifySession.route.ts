/**
 * @swagger
 * /auth/verify-session:
 *   post:
 *     summary: Verify session validity
 *     description: Validates JWT expiry from refresh token without creating new tokens
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: cookie
 *         name: refresh_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Refresh token stored in httpOnly cookie
 *     responses:
 *       200:
 *         description: Session validity check completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   description: Whether the session token is valid and not expired
 *       400:
 *         description: Missing refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */

import { Router, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import logger from "../../../../utils/logger";

const router = Router();

interface JWTPayload {
  exp?: number;
}

router.post("/verify-session", async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      logger.warn("Missing refresh token for session verification", {
        requestId: req.id,
      });
      return res.status(200).json({ valid: false });
    }

    try {
      const decoded = jwt.decode(refreshToken) as JWTPayload;

      if (!decoded) {
        logger.warn("Failed to decode refresh token", { requestId: req.id });
        return res.status(200).json({ valid: false });
      }

      // Check if token is expired
      if (decoded.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        const isExpired = decoded.exp < currentTime;

        logger.info("Session verified", {
          requestId: req.id,
          valid: !isExpired,
          expiresIn: decoded.exp - currentTime,
        });

        return res.status(200).json({ valid: !isExpired });
      }

      logger.warn("Token has no expiry claim", { requestId: req.id });
      return res.status(200).json({ valid: false });
    } catch (decodeError) {
      logger.warn("Failed to decode refresh token", {
        requestId: req.id,
        error: decodeError,
      });
      return res.status(200).json({ valid: false });
    }
  } catch (error: any) {
    logger.error("Error verifying session", {
      requestId: req.id,
      error: error.message,
    });
    res.status(200).json({ valid: false });
  }
});

export default router;
