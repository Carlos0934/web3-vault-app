import {
  UserFile,
  UserFileRepository,
} from "../../repositories/userFileRepository";

import {
  Block,
  bytesToHex,
  Client,
  hexToBytes,
  initLogger,
  Payload,
  PayloadType,
  SecretManager,
  TaggedDataPayload,
  Utils,
} from "@iota/sdk";

import { decrypt, encrypt, stringToUint8Array } from "../../utils/crypto";
import {
  bytesToHexStream,
  encryptBytesStream,
  splitBytesStream,
} from "../../utils/transformers";
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
  async uploadFile(file: File, userId: string): Promise<void> {
    const chunkSize = 1024 * 30; // 30kb

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
      console.log("Saving block");
      const [blockHash] = await this.client.buildAndPostBlock(secretManager, {
        tag: bytesToHex(tag, true),
        data: payload,
      });

      console.log("Block saved");

      await this.userFileRepository.addBlock({
        fileId,
        blockHash,
        timestamp: Date.now(),
      });
    };
    const completeFile = async () => {
      console.log("Completing file");
      await this.userFileRepository.updateStatus(fileId, "completed");
    };
    file
      .stream()
      .pipeThrough(splitBytesStream(chunkSize))
      .pipeThrough(encryptBytesStream(this.encryptionKey))
      .pipeThrough(bytesToHexStream())
      .pipeTo(
        new WritableStream({
          async write(chunk) {
            await saveFileBlock(chunk);
          },
          async close() {
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
        const blockData = await getBlockData(blockHash);
        if (blockData.payload instanceof TaggedDataPayload) {
          const chunkBytes = hexToBytes(blockData.payload.data);
          const decryptedChunk = await decrypt(chunkBytes, encryptionKey);

          yield decryptedChunk;
        }
      }
    };

    return new ReadableStream<Uint8Array>({
      pull: async (controller) => {
        const generator = decryptBlocks(
          (blockHash) => this.client.getBlock(blockHash),
          this.encryptionKey
        );
        const { value, done } = await generator.next();
        if (done) {
          controller.close();
        } else {
          controller.enqueue(value);
        }
      },

      cancel() {
        console.log("Stream cancelled");
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
