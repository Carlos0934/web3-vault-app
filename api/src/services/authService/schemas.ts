import { z } from "zod";
import { RegisterUserInput } from "./types";

export const RegisterUserInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(10),
});

export const LoginUserInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  phone: z.string().min(10),
  createdAt: z.number(),
});
