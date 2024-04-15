import { describe, it, expect, afterAll, beforeEach } from "vitest";
import authRoutes from ".";
import { factoryCreateClass } from "../../utils/factory";

import { AuthService } from "../../services/authService";
import { resetDB } from "../../utils/resetDB";

describe("authRoutes", () => {
  afterAll(async () => {
    await resetDB();
  });

  beforeEach(async () => {
    await resetDB();
  });

  it("should register successfully", async () => {
    // Arrange

    const user = {
      email: "example@gmail.com",
      password: "password",
      fullName: "John Doe",
      phone: "1234567890",
    };
    // Act

    const result = await authRoutes.request("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    // Assert

    const body = await result.json();

    expect(result.status).toBe(200);

    expect(body).toHaveProperty("id");
  });

  it("should login successfully", async () => {
    // Arrange
    const authService = factoryCreateClass(AuthService);
    const user = {
      email: "example@gmail.com",
      fullName: "John Doe",
      password: "password",
      phone: "1234567890",
    };
    await authService.register(user);

    // Act
    const result = await authRoutes.request("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    // Assert
    const body = await result.json();
    expect(result.status).toBe(200);
    expect(body).toHaveProperty("token");
  });

  it("should get profile successfully", async () => {
    // Arrange
    const authService = factoryCreateClass(AuthService);

    const user = {
      email: "example@gmail.com",
      fullName: "John Doe",
      password: "password",
      phone: "1234567890",
    };

    const { id } = await authService.register(user);

    const { token } = await authService.login({
      email: user.email,
      password: user.password,
    });

    // Act
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
    const result = await authRoutes.request("/profile", {
      method: "GET",
      headers,
    });

    // Assert
    const body = await result.json();
    expect(result.status).toBe(200);
    expect(body).toStrictEqual({
      id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      createdAt: expect.any(Number),
    });
  });

  it("should not get profile without token", async () => {
    // Arrange
    const authService = factoryCreateClass(AuthService);

    const user = {
      email: "example@gmail.com",
      fullName: "John Doe",
      password: "password",
      phone: "1234567890",
    };

    await authService.register(user);

    // Act
    const result = await authRoutes.request("/profile", {
      method: "GET",
    });

    // Assert
    expect(result.status).toBe(401);
  });

  it("should fail to login with invalid credentials", async () => {
    // Arrange
    const authService = factoryCreateClass(AuthService);

    const user = {
      email: "example@gmail.com",
      fullName: "John Doe",
      password: "password",
      phone: "1234567890",
    };

    await authService.register(user);

    // Act
    const result = await authRoutes.request("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: user.email, password: "wrongpassword" }),
    });

    // Assert
    expect(result.status).toBe(401);

    const body = await result.json();

    expect(body).toStrictEqual({
      error: "Invalid email or password",
    });
  });
});
