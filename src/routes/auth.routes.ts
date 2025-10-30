
import { Router, Request, Response, NextFunction } from 'express';
import  { supabase,supabaseClient } from '../lib/supabase';
import { createClient, type AuthResponse, type OAuthResponse } from '@supabase/supabase-js';

import {  body, validationResult } from 'express-validator';
import {  callbackLimiter, loginLimiter, oauthLimiter, refreshTokenLimiter, signupLimiter } from '../middleware/rateLimiter';
import { signupValidations, loginValidations, refreshTokenValidations, forgetPasswordValidations, resetPasswordValidations } from '../validations/authValidation';
import { createUserProfile } from '../../utils/createProfile';

const router = Router();

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


router.post('/signup', signupValidations, signupLimiter, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const { data, error }: AuthResponse = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.EMAIL_REDIRECT_URL 
          
        }
      }
    );

      if (error) {
       return res.status(400).json({ error: error.message });
      }

      console.log(data.user)
      // Create profile if user was created
        if (data.user) {
          try {
            await createUserProfile(data.user);
          } catch (profileError) {
            console.error('Profile creation failed:', profileError);
          }
        }
      // User created but email confirmation disabled
      if (data.user && !data.session) {
        return res.status(200).json({
          message: 'Check your email to confirm your account',
          user: {
            id: data.user.id,
            email: data.user.email,
          },
          requiresEmailConfirmation: true,
        });
      }

      // User created and automatically logged in
      return res.status(201).json({
        message: 'User created successfully',
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
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});





/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     description: Authenticates a user and returns access token
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
 *                 example: SecurePass123!
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             description: Refresh token stored in httpOnly cookie
 *             schema:
 *               type: string
 *               example: refresh_token=xyz; HttpOnly; Secure; SameSite=Lax
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
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
 *                 access_token:
 *                   type: string
 *                   description: JWT access token for API authentication
 *       400:
 *         description: Invalid credentials or validation error
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



router.post('/login', loginLimiter, loginValidations, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const { data, error }: AuthResponse = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.cookie('refresh_token', data.session?.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.user_metadata?.name,
      },
      access_token: data.session?.access_token,
      
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});







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
    console.error('Error initiating Google OAuth:', error);
    res.status(500).json({ error: error.message });
  }
});




/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     description: Redirects user to Google OAuth consent page
 *     tags:
 *       - Authentication
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

// OAUTH ROUTES
router.get('/google', callbackLimiter, async (req: Request, res: Response) => {
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
    console.error('Error initiating Google OAuth:', error);
    res.status(500).json({ error: error.message });
  }
});


/**
 * @swagger
 * /auth/callback:
 *   get:
 *     summary: OAuth callback handler
 *     description: Handles OAuth callback from Google and exchanges code for session
 *     tags:
 *       - Authentication
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
      console.error('Profile creation failed:', profileError);
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
    console.error('Error exchanging code for session:', error);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=${error.message}`);
  }
});





/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     description: Sends a password reset email to the user
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
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset email sent. Check your inbox.
 *       400:
 *         description: Validation error or email not found
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationError'
 *                 - $ref: '#/components/schemas/Error'
 */
// Request password reset
router.post('/forgot-password', forgetPasswordValidations, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.CLIENT_URL}/auth/reset-password`,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({
    message: 'Password reset email sent. Check your inbox.',
  });
});







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

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password with token
 *     description: Updates the user password using the reset token sent via email.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - access_token
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: New user password (minimum 8 characters)
 *                 example: NewSecurePass123!
 *               access_token:
 *                 type: string
 *                 description: Access token from password reset link
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password updated successfully. Please login with your new password.
 *       400:
 *         description: Validation error or invalid token
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


/* --------------------------------------------
   1️⃣ VERIFY RESET TOKEN
--------------------------------------------- */
router.post(
  '/verify-reset-token',
  [body('access_token').notEmpty().withMessage('Access token is required')],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { access_token } = req.body;

    try {
      const { data: { user }, error } = await supabase.auth.getUser(access_token);

      if (error || !user) {
        return res.status(400).json({ error: 'Invalid or expired access token' });
      }

      return res.status(200).json({
        valid: true,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
);


/* --------------------------------------------
   2️⃣ RESET PASSWORD
--------------------------------------------- */
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
        console.error("Token validation error:", userError);
        return res.status(400).json({ error: "Invalid or expired access token" });
      }

      // ✅ Update password using service role admin API
      const { error } = await supabase.auth.admin.updateUserById(
        user.id,
        { password }
      );

      if (error) {
        console.error("Password update error:", error);
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json({
        message: "Password updated successfully. Please login with your new password.",
      });
    } catch (err: any) {
      console.error("Reset password error:", err);
      return res.status(500).json({ error: err.message });
    }
  }
);


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
    console.error('Error logging out:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
