
/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     description: Redirects user to Google OAuth consent page
 *     tags:
 *       - OAuth
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth page
 *       500:
 *         description: Error initiating OAuth
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import { OAuthResponse } from "@supabase/supabase-js";
import { supabase } from "../../../lib/supabase";
import { oauthLimiter } from "../../../middleware/rateLimiter";
import { Router, Request, Response } from "express";
import logger from "../../../../utils/logger";

// OAUTH ROUTES
const router = Router();




router.get('/google', oauthLimiter, async (req: Request, res: Response) => {
  try {
    const { data, error } : OAuthResponse = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.SERVER_URL || 'http://localhost:3000'}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });

    if (error) throw error;

    // Redirect user to Google OAuth page
    res.redirect(data.url);
  } catch (error: any) {
    logger.error('Error initiating Google OAuth', { error });
    res.status(500).json({ error: error.message });
  }
});



export default router