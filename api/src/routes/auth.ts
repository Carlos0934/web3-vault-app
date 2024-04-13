import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { zValidator } from "@hono/zod-validator";
import { factoryCreateClass } from "../utils/factory";
import { AuthService } from "../services/authService";
import {
  LoginUserInputSchema,
  RegisterUserInputSchema,
} from "../services/authService/schemas";
import { secrets } from "../config/secrets";
import { JwtPayload } from "../services/authService/types";

const authService = factoryCreateClass(AuthService);

const authRoutes = new Hono();

authRoutes.post(
  "/login",
  zValidator("json", LoginUserInputSchema),
  async (ctx) => {
    const input = ctx.req.valid("json");

    try {
      const result = await authService.login(input);
      return ctx.json(result);
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json({ error: error.message }, 400);
      }
    }
  }
);

authRoutes.post(
  "/register",
  zValidator("json", RegisterUserInputSchema),
  async (ctx) => {
    const input = ctx.req.valid("json");

    try {
      const result = await authService.register(input);
      return ctx.json(result);
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json({ error: error.message }, 400);
      }
    }
  }
);

authRoutes.get(
  "/profile",
  jwt({
    secret: secrets.jwtSecret,
  }),
  async (ctx) => {
    const { userId } = ctx.get("jwtPayload") as JwtPayload;

    try {
      const result = await authService.getProfile({ userId });
      return ctx.json(result);
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json({ error: error.message }, 400);
      }
    }
  }
);

export default authRoutes;
