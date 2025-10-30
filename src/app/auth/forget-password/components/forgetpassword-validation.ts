import z, { email } from "zod";

export const forgetPasswordValidation = z.object({
  email: z.email("Invalid email address"),
});

export type forgetPasswordValidation = z.infer<typeof forgetPasswordValidation>;
