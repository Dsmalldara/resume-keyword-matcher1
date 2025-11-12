/**
 * @swagger
 * /auth/callback:
 *   get:
 *     summary: OAuth callback handler
 *     description: Handles OAuth callback from Google and exchanges code for session
 *     tags:
 *       - OAuth
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Authorization code from OAuth provider
 *       - in: query
 *         name: error
 *         schema:
 *           type: string
 *         description: Error message if OAuth failed
 *     responses:
 *       302:
 *         description: Redirect to client application
 *         headers:
 *           Set-Cookie:
 *             description: Refresh token stored in httpOnly cookie
 *             schema:
 *               type: string
 *           Location:
 *             description: Redirect URL with access token
 *             schema:
 *               type: string
 *               example: http://localhost:3000/dashboard?access_token=xyz
 */




import { Router, Request, Response } from 'express';
import  { supabase } from '../../../lib/supabase';
import { type AuthResponse } from '@supabase/supabase-js';
import {   oauthLimiter } from '../../../middleware/rateLimiter';
import { createUserProfile } from '../../../../utils/createProfile';
import logger from "../../../../utils/logger";

const router = Router();


router.get('/callback', oauthLimiter, async (req: Request, res: Response) => {
  const { code, error: oauthError } = req.query;

  if (oauthError) {
    return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=${oauthError}`);
  }

  if (!code) {
    return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=no_code`);
  }

  try {
    // Exchange code for session
    const { data, error }: AuthResponse = await supabase.auth.exchangeCodeForSession(code as string);

    if (error) throw error;

    // Create profile for OAuth user
  if (data.user) {
    try {
      await createUserProfile(data.user);
    } catch (profileError) {
      logger.error('Profile creation failed', { profileError });
    }
  }
    // Set refresh token in httpOnly cookie
    res.cookie('refresh_token', data.session?.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect to client with access token as query param (or use a different method)
    const redirectUrl = new URL(`${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard`);
    redirectUrl.searchParams.set('access_token', data.session?.access_token || '');
    
    res.redirect(redirectUrl.toString());
  } catch (error: any) {
    logger.error('Error exchanging code for session', { error });
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=${error.message}`);
  }
});


export default router