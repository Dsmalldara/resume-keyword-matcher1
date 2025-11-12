import rateLimit from "express-rate-limit";

export const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, 
  message: 'Too many signup attempts, please try again later'
});

export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10, 
  message: 'Too many login attempts, please try again later',
});

export const refreshTokenLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30, 
    message: 'Too many token refresh attempts, please try again later',
});

export const oauthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15, 
    message: 'Too many OAuth attempts, please try again later',
});

export const callbackLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: 'Too many callback attempts, please try again later',
});