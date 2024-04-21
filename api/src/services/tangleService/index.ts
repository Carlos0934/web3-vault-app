import {
  UserFile,
  UserFileRepository,
} from "../../repositories/userFileRepository";

import {
  Block,
  bytesToHex,
  Client,
  hexToBytes,
  TaggedDataPayload,
  Utils,
} from "@iota/sdk";

import { decrypt, encrypt, stringToUint8Array } from "../../utils/crypto";
import {
  bytesToHexStream,
  encryptBytesStream,
  splitBytesByChunkStream,
} from "../../utils/transformers";
import { Console } from "node:console";
export class IotaTangleService {
  private readonly client: Client;

  constructor(
    private readonly userFileRepository: UserFileRepository,
    nodes: string[],
    private readonly encryptionKey: string
  ) {
    this.client = new Client({
      nodes: nodes,
    });
  }
  async getUserFiles(userId: string): Promise<UserFile[]> {
    const textDecoder = new TextDecoder();
    return Promise.all(
      (await this.userFileRepository.getByUserId(userId)).map(async (file) => ({
        ...file,
        name: textDecoder.decode(
          await decrypt(file.name as Uint8Array, this.encryptionKey)
        ),
      }))
    );
  }
  async uploadFile(
    file: File,
    userId: string,
    onProgress: (progress: number) => void
  ) {
    const chunkSize = 1024 * 5; // 5KB

    const tag = await encrypt(
      stringToUint8Array(file.name),
      this.encryptionKey
    );

    const mnemonic = Utils.generateMnemonic();
    const secretManager = { mnemonic: mnemonic };

    const { id: fileId } = await this.userFileRepository.create({
      userId,
      name: tag,
      size: file.size,
      status: "pending",
    });

    const saveFileBlock = async (payload: string) => {
      const [blockHash] = await this.client.buildAndPostBlock(secretManager, {
        tag: bytesToHex(tag, true),
        data: payload,
      });

      await this.userFileRepository.addBlock({
        fileId,
        blockHash,
        timestamp: Date.now(),
      });
    };
    const completeFile = async () =>
      this.userFileRepository.updateStatus(fileId, "completed");

    const totalBlocks = Math.ceil(file.size / chunkSize);
    let currentBlock = 0;
    await file
      .stream()
      .pipeThrough(splitBytesByChunkStream(chunkSize))
      .pipeThrough(encryptBytesStream(this.encryptionKey))
      .pipeThrough(bytesToHexStream())
      .pipeTo(
        new WritableStream({
          write: async (chunk) => {
            await saveFileBlock(chunk);
            currentBlock++;
            onProgress(currentBlock / totalBlocks);
          },
          close: async () => {
            await completeFile();
          },
        })
      );
  }

  async downloadFile(fileId: string): Promise<ReadableStream<Uint8Array>> {
    const blocks = await this.userFileRepository.getBlocks(fileId);

    const decryptBlocks = async function* (
      getBlockData: (blockHash: string) => Promise<Block>,
      encryptionKey: string
    ): AsyncGenerator<Uint8Array> {
      for (const { blockHash } of blocks) {
        console.log("Getting block data of" + blockHash);

        const blockData = await getBlockData(blockHash);

        if (blockData.payload instanceof TaggedDataPayload) {
          const chunkBytes = hexToBytes(blockData.payload.data);
          const decryptedChunk = await decrypt(chunkBytes, encryptionKey);

          yield decryptedChunk;
        }
      }
      return;
    };
    const generator = decryptBlocks(
      (blockHash) => this.client.getBlock(blockHash),
      this.encryptionKey
    );

    return new ReadableStream<Uint8Array>({
      pull: async (controller) => {
        const { value, done } = await generator.next();

        if (done) {
          controller.close();
        } else {
          controller.enqueue(value);
        }
      },
    });
  }

  async getFile(input: { userId: string; fileId: string }) {
    const textDecoder = new TextDecoder();
    const file = await this.userFileRepository.getByUserIdAndId(input);
    if (!file) {
      return null;
    }

    return {
      ...file,
      name: textDecoder.decode(
        await decrypt(file.name as Uint8Array, this.encryptionKey)
      ),
    };
  }
}
