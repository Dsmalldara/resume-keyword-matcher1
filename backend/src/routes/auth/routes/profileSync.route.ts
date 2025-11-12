/**
 * @swagger
 * /auth/sync:
 *   post:
 *     summary: Sync user profile from Supabase
 *     description: Retrieves the user from Supabase by ID (from the access token) and creates/updates the local profile record. this is  only needed when a user uses gogole oauth to login for the first time. it is a batch fix for a small flaw in profile 
 *     tags:
 *       - Authentication
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile synced successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile synced successfully
 *                 userId:
 *                   type: string
 *                   example: 123e4567-e89b-12d3-a456-426614174000
 *       400:
 *         description: Validation error or bad request
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationError'
 *                 - $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - user not allowed to perform this action
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import { Router, Request, Response } from "express";
import { createUserProfile } from "../../../../utils/createProfile";
import logger from "../../../../utils/logger";
import { supabase } from "../../../lib/supabase";
import { AuthMiddleware } from "../../../middleware/auth";

const router = Router();

router.post('/sync', AuthMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // From your JWT middleware

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user data from Supabase
    const { data: { user }, error } = await supabase.auth.admin.getUserById(userId);

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create/update profile
    await createUserProfile(user);

    logger.info('Profile synced successfully', { userId });
    
    return res.status(200).json({ 
      message: 'Profile synced successfully',
      userId: user.id 
    });
  } catch (error: any) {
    logger.error('Profile sync error', { error });
    return res.status(500).json({ error: 'Failed to sync profile' });
  }
});

export default router;