
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Signs out the user and clears refresh token cookie
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */


import { Router, Request, Response } from 'express';
import { supabase } from '../../../lib/supabase';
import logger from "../../../../utils/logger";

const router = Router();
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (token) {
      // Sign out from Supabase
      await supabase.auth.signOut();
    }

    // Clear refresh token cookie
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    logger.error('Error logging out', { error });
    res.status(500).json({ error: error.message });
  }
});

export default router;
