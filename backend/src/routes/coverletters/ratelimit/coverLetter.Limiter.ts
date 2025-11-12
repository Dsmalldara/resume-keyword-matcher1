import rateLimit from "express-rate-limit";

export const createLettersLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: 'Too many analysis requests, please try again later',
})