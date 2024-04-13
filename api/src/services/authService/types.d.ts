import type {
  LoginUserInputSchema,
  RegisterUserInputSchema,
  UserProfileSchema,
} from "./schemas";

export type RegisterUserInput = z.infer<typeof RegisterUserInputSchema>;

export type RegisterUserOutput = {
  id: string;
};

export type LoginUserInput = z.infer<typeof LoginUserInputSchema>;

export type LoginUserOutput = {
  token: string;
};

export type UserProfile = z.infer<typeof UserProfileSchema>;

export type JwtPayload = {
  userId: string;
  exp: number;
};
