import { body } from "express-validator";

export const createAnalysisValidations = [
    body('resumeId')
        .isUUID()
        .withMessage('Invalid resume ID'),
    
    body('jobDescription')
        .isString()
        .isLength({ min: 50, max: 5000 })
        .withMessage('Job description must be between 50 and 5000 characters long'),
    
    body('jobTitle')
        .optional({ values: 'falsy' })
        .isLength({ min: 1, max: 100 })
        .withMessage('Job title must be between 1 and 100 characters long'),
    
    body('company')
        .optional({ values: 'falsy' }) // This will treat empty strings as optional too
        .isString()
        .isLength({ min: 1, max: 100 })
        .withMessage('Company name must be between 1 and 100 characters long'),
];