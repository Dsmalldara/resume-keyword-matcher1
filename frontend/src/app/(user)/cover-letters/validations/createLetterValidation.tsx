import { z } from "zod";

export const createLetterValidation = z.object({
    analysisId: z.string().min(1, "Please select an analysis"),
    resumeId: z.string().min(1, "Please select a resume"),
    customNotes: z.string().max(100, "Custom notes must be at most 100 characters long").optional(),
})

export type CreateLetterValidationType = z.infer<typeof createLetterValidation>;