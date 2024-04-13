import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  phone: text("phone", { length: 10 }).notNull(),
  createdAt: integer("created_at").notNull(),
});

export const userTransactionFiles = sqliteTable("user_transactions", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  transactionHash: text("transaction_hash").notNull(),
  blockHash: text("block_hash").notNull(),
  createdAt: integer("created_at").notNull(),
});
