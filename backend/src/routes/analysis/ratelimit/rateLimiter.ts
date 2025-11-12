import rateLimit from "express-rate-limit";

export const analysisLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many analysis requests, please try again later',
})