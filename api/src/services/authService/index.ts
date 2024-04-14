import { UserRepository } from "../../repositories/userRepository";
import {
  LoginUserInput,
  LoginUserOutput,
  UserProfile,
  RegisterUserInput,
  RegisterUserOutput,
} from "./types";
import * as jwt from "hono/jwt";
import { verifyPassword, hashPassword } from "../../utils/crypto";

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly secret: string
  ) {}

  async login(input: LoginUserInput): Promise<LoginUserOutput> {
    const user = await this.userRepository.getByEmail(input.email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!(await verifyPassword(input.password, user.password))) {
      throw new Error("Invalid email or password");
    }

    const token = await this.generateToken(user.id);

    return { token };
  }

  async register(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const user = await this.userRepository.getByEmail(input.email);

    if (user) {
      throw new Error("Email already exists");
    }

    const { id } = await this.userRepository.create({
      ...input,
      password: await hashPassword(input.password),
    });

    return { id };
  }

  async getProfile(input: { userId: string }): Promise<UserProfile> {
    const user = await this.userRepository.getById(input.userId);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
    };
  }

  private async generateToken(userId: string): Promise<string> {
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours
    const token = await jwt.sign({ userId, exp: exp }, this.secret);

    return token;
  }
}
