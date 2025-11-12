/**
 * @swagger
 * /auth/verify-reset-token:
 *   post:
 *     summary: Verify password reset token
 *     description: Validates the access token received from the password reset link and returns the associated user if valid.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - access_token
 *             properties:
 *               access_token:
 *                 type: string
 *                 description: Access token from password reset link
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Token is valid, user details returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 94c21c7a-7322-4b2d-91b1-0e25b8e6a71b
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */




import { Router, Request, Response } from 'express';
import  { supabase } from '../../../lib/supabase';
import {  body, validationResult } from 'express-validator';
import logger from "../../../../utils/logger";


const router = Router()
router.post(
  "/reset-password",
  [
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("access_token")
      .notEmpty()
      .withMessage("Access token is required"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { password, access_token } = req.body;

    try {
      // ✅ Use service role client to verify the token
      const { data: { user }, error: userError } = 
        await supabase.auth.getUser(access_token); // Using service role client

      if (userError || !user) {
        logger.error('Token validation error', { userError });
        return res.status(400).json({ error: "Invalid or expired access token" });
      }

      // ✅ Update password using service role admin API
      const { error } = await supabase.auth.admin.updateUserById(
        user.id,
        { password }
      );

      if (error) {
        logger.error('Password update error', { error });
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json({
        message: "Password updated successfully. Please login with your new password.",
      });
    } catch (err: any) {
      logger.error('Reset password error', { err });
      return res.status(500).json({ error: err.message });
    }
  }
);



export default router
