import { z } from "zod";

export const jobDescriptionValidation = z.object({
  jobDescription: z
    .string()
    .trim()
    .min(50, "Job description must be at least 50 characters long")
    .max(5000, "Job description must be at most 5000 characters long")
    .regex(/[a-zA-Z]/, "Job description must contain valid text"),
    
  jobTitle: z.string().trim().min(1).max(100, "Job title must be at most 100 characters long").or(z.literal("")).optional(),
  company: z.string().trim().min(1).max(100, "Company name must be at most 100 characters long").or(z.literal("")).optional(),
});

export type JobDescriptionDataType = z.infer<typeof jobDescriptionValidation>;
