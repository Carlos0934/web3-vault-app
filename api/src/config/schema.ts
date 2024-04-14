import { integer, sqliteTable, text, blob } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  phone: text("phone", { length: 10 }).notNull(),
  createdAt: integer("created_at").notNull(),
});

export const schema = {
  users,
};
