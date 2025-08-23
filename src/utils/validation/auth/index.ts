import { z } from "zod";

export const authSchema = z.object({
  email: z.email({
    message: "Please enter a valid email",
  }),
  otp: z
    .string({ required_error: "Password is required" })
    .min(5, { message: "Min 5 Required" })
    .max(5, { message: "Max 5 Required" }),
});
