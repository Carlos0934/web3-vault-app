import db from "../config/db";
import { users } from "../config/schema";

export async function resetDB() {
  await db.delete(users).run();
}
