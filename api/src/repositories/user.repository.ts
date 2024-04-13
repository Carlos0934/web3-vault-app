import { eq } from "drizzle-orm";
import database from "../config/db";
import { users } from "../config/schema";

export class UserRepository {
  constructor(private readonly db: typeof database) {}
  async create(data: {
    email: string;
    password: string;
    phone: string;
  }): Promise<{ id: string }> {
    const id = crypto.randomUUID();

    await this.db.insert(users).values({
      id,
      ...data,
      createdAt: Date.now(),
    });

    return { id };
  }

  async getByEmail(email: string): Promise<{
    id: string;
    email: string;
    password: string;
    phone: string;
    createdAt: number;
  } | null> {
    const user = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      password: user.password,
    };
  }

  async getById(id: string): Promise<{
    id: string;
    email: string;
    password: string;
    phone: string;
    createdAt: number;
  } | null> {
    const user = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .get();

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      password: user.password,
    };
  }
}
