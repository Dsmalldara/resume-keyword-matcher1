import { body, cookie } from "express-validator";

export const signupValidations = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
]

export const loginValidations = [
  body('email')
    .isEmail()
    .withMessage('Invalid email address'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const refreshTokenValidations = [
    cookie('refresh_token')  // Changed from body to cookie
        .notEmpty()
        .withMessage('Refresh token is required')
];

export const forgetPasswordValidations = [
  body('email').isEmail().withMessage('Invalid email address')
]

export const resetPasswordValidations =  [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
]