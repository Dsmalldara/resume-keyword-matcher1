import { body, param } from "express-validator";

export const coverLetterValidation = [
    body('resumeId').isString().notEmpty().withMessage('Invalid resume ID'),
    body('analysisId').isString().notEmpty().withMessage('Invalid analysis ID'),
    body('customNotes').optional().isString().withMessage('Custom notes must be a string')
]

export const getIndividualLetterValidation = [
    param('id').notEmpty()
    .withMessage('Cover letter id is required')
    .isString()
    .withMessage('Invalid cover letter id'),
]
