import { desc, eq } from "drizzle-orm";
import database from "../config/db";
import { userTransactionFiles } from "../config/schema";

export class UserTransactionFileRepository {
  constructor(private readonly db: typeof database) {}

  async findFirstByUserId(userId: string) {
    const transactionFile = this.db
      .select()
      .from(userTransactionFiles)
      .where(eq(userTransactionFiles.userId, userId))
      .orderBy(userTransactionFiles.createdAt)
      .get();

    return transactionFile;
  }

  async findLastByUserId(userId: string) {
    const transactionFile = this.db
      .select()
      .from(userTransactionFiles)
      .where(eq(userTransactionFiles.userId, userId))
      .orderBy(desc(userTransactionFiles.createdAt))
      .get();

    return transactionFile;
  }

  async create(data: {
    userId: string;
    transactionHash: string;
    blockHash: string;
    blockNumber: bigint;
  }): Promise<{ id: string }> {
    const id = crypto.randomUUID();

    await this.db.insert(userTransactionFiles).values({
      id,
      ...data,
      blockNumber: BigInt(data.blockNumber),
      createdAt: Date.now(),
    });

    return { id };
  }
}
