import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const DATABASE_URL = process.env.DATABASE_URL!;
const DATABASE_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN!;

if (!DATABASE_URL || !DATABASE_AUTH_TOKEN) {
  throw new Error("Database URL and Auth Token must be provided");
}

const client = createClient({
  url: DATABASE_URL,
  authToken: DATABASE_AUTH_TOKEN,
});

const db = drizzle(client);

export default db;
