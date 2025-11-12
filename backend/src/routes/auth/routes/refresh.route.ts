/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Generates a new access token using the refresh token from cookies
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
 *         description: Token refreshed successfully
 *         headers:
 *           Set-Cookie:
 *             description: New refresh token stored in httpOnly cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token refreshed, Login successful
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     bio:
 *                       type: string
 *                       nullable: true
 *                     avatarUrl:
 *                       type: string
 *                       nullable: true
 *                     username:
 *                       type: string
 *                       nullable: true
 *                 access_token:
 *                   type: string
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */




import { Router, Request, Response, NextFunction } from 'express';
import  { supabase} from '../../../lib/supabase';
import { type AuthResponse } from '@supabase/supabase-js';
import logger from "../../../../utils/logger";

import {  body, validationResult } from 'express-validator';
import {   refreshTokenLimiter} from '../../../middleware/rateLimiter';
import { refreshTokenValidations } from '../../../validations/authValidation';

const router = Router();


router.post('/refresh', refreshTokenLimiter, refreshTokenValidations, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const refreshToken = req.cookies.refresh_token;
  try{
  const { data, error }: AuthResponse = await supabase.auth.refreshSession({ refresh_token: refreshToken });

   if (error) return res.status(401).json({ error: error.message });

  res.cookie('refresh_token', data.session?.refresh_token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // ~7 days
});

   return res.status(200).json({
      message: 'Token refreshed, Login successful',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.user_metadata?.name,
        bio: data.user?.user_metadata?.bio || null,
        avatarUrl: data.user?.user_metadata?.avatar_url || null,
        username: data.user?.user_metadata?.username || null,
      },
      access_token: data.session?.access_token,
      
    });
  }
    catch (error: any) {
    logger.error('Error refreshing token', { error });
    res.status(500).json({ error: error.message });
  }
});


export default router