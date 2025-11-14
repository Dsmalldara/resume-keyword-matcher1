/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with email and password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: SecurePass123!
 *     responses:
 *       200:
 *         description: User created but email confirmation required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Check your email to confirm your account
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     email:
 *                       type: string
 *                 requiresEmailConfirmation:
 *                   type: boolean
 *                   example: true
 *       201:
 *         description: User created and logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
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
 *                 session:
 *                   type: object
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationError'
 *                 - $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import { Router, Request, Response } from "express";
import { supabase } from "../../../lib/supabase";
import { type AuthResponse } from "@supabase/supabase-js";

import { body, validationResult } from "express-validator";
import { signupLimiter } from "../../../middleware/rateLimiter";
import { signupValidations } from "../../../validations/authValidation";
import { createUserProfile } from "../../../../utils/createProfile";
import logger from "../../../../utils/logger";
import prisma from "../../../lib/prisma";
const router = Router();
router.post(
  "/signup",
  signupValidations,
  signupLimiter,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const emailCheck = prisma.profile.findUnique({
      where: { email: email },
    });
    if (!emailCheck) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }
    try {
      const { data, error }: AuthResponse = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.EMAIL_REDIRECT_URL,
        },
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      logger.debug("Supabase signup user", { user: data.user });
      // Create profile if user was created
      if (data.user) {
        try {
          await createUserProfile(data.user);
        } catch (profileError) {
          logger.error("Profile creation failed", { profileError });
        }
      }
      // User created but email confirmation disabled
      if (data.user && !data.session) {
        return res.status(200).json({
          message: "Check your email to confirm your account",
          user: {
            id: data.user.id,
            email: data.user.email,
          },
          requiresEmailConfirmation: true,
        });
      }

      // User created and automatically logged in
      return res.status(201).json({
        message: "User created successfully",
        user: {
          id: data.user?.id,
          email: data.user?.email,
          name: data.user?.user_metadata?.name,
        },
        session: data.session,
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
      });
    } catch (error) {
      logger.error("Signup error", { error });
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
