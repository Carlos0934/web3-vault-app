import { and, eq } from "drizzle-orm";
import database from "../config/db";
import { files, filesBlocks } from "../config/schema";

export type UserFile = {
  id: string;
  name: Uint8Array | string;
  size: number;
  userId: string;
  status: "pending" | "completed";
};

export class UserFileRepository {
  constructor(private readonly db: typeof database) {}

  async create(data: Omit<UserFile, "id">): Promise<{ id: string }> {
    const id = crypto.randomUUID();

    await this.db.insert(files).values({
      id,
      ...data,
      name: data.name,
    });

    return { id };
  }

  async getById(id: string): Promise<UserFile | null> {
    const file = await this.db
      .select()
      .from(files)
      .where(eq(files.id, id))
      .get();

    if (!file) {
      return null;
    }

    return {
      id: file.id,
      name: file.name as Uint8Array,
      size: file.size,
      userId: file.userId,
      status: file.status,
    };
  }

  async getByUserId(userId: string): Promise<Array<UserFile>> {
    const file = await this.db
      .select()
      .from(files)
      .where(eq(files.userId, userId))
      .all();

    return file.map((file) => ({
      id: file.id,
      name: file.name as Uint8Array,
      size: file.size,
      userId: file.userId,
      status: file.status,
    }));
  }

  async updateStatus(id: string, status: UserFile["status"]): Promise<void> {
    await this.db.update(files).set({ status }).where(eq(files.id, id)).run();
  }

  async addBlock(data: {
    fileId: string;
    blockHash: string;
    timestamp: number;
  }): Promise<void> {
    const id = crypto.randomUUID();
    await this.db.insert(filesBlocks).values({
      id,
      ...data,
    });
  }

  async getBlocks(fileId: string): Promise<Array<{ blockHash: string }>> {
    const blocks = await this.db
      .select()
      .from(filesBlocks)
      .where(eq(filesBlocks.fileId, fileId))
      .orderBy(filesBlocks.timestamp)
      .all();

    return blocks.map((block) => ({ blockHash: block.blockHash }));
  }

  async getByUserIdAndId({
    userId,
    fileId,
  }: {
    userId: string;
    fileId: string;
  }): Promise<UserFile | null> {
    const file = await this.db
      .select()
      .from(files)
      .where(and(eq(files.userId, userId), eq(files.id, fileId)))
      .get();

    if (!file) {
      return null;
    }

    return {
      id: file.id,
      name: file.name as Uint8Array,
      size: file.size,
      userId: file.userId,
      status: file.status,
    };
  }
}
