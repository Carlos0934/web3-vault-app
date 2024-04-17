import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, blob } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  phone: text("phone", { length: 10 }).notNull(),
  createdAt: integer("created_at").notNull(),
});

export const files = sqliteTable("files", {
  id: text("id").primaryKey().notNull(),
  name: blob("name").notNull(),
  size: integer("size").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  status: text("status", {
    enum: ["pending", "completed"],
  }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const filesBlocks = sqliteTable("files_blocks", {
  id: text("id").primaryKey().notNull(),
  fileId: text("file_id")
    .notNull()
    .references(() => files.id),

  blockHash: text("block_hash").notNull(),
  timestamp: integer("timestamp").notNull(),
});

export const schema = {
  users,
  files,
  filesBlocks,
};
