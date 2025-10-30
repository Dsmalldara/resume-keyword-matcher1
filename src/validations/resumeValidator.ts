
import { body } from "express-validator";

// Define the allowed MIME types for common documents
const ALLOWED_MIME_TYPES = [
    "application/pdf",                                                 // PDF
    "application/msword",                                              // DOC (Older Word)
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX (Modern Word)
                                        // RTF
];

export const resumeUploadAccessValidations = [
    // 1. Filename must exist and not be empty
    body("filename").notEmpty().withMessage("Filename required"),

    // 2. File Type Validation: Allow PDF, DOC, and DOCX
    body("type")
        .isIn(ALLOWED_MIME_TYPES)
        .withMessage("Only PDF and Microsoft Word files (.doc, .docx) are allowed."),

    // 3. File Size Validation: Max 10MB
    body("size")
        .isInt({ max: 5 * 1024 * 1024 })
        .withMessage("File too large (max 5MB)"),
];

export const resumeUploadCompleteValidations = [
    // 1. Filename must exist and not be empty
    body("filename").notEmpty().withMessage("Filename required"),

    // 2. Filepath must exist and not be empty
    body("filepath").notEmpty().withMessage("Filepath required"),
    // 3. File Size Validation: Max 10MB
    body("size")
        .isInt({ max: 5 * 1024 * 1024 })
        .withMessage("File too large (max 5MB)"),
];