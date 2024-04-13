import { fileMetadataRegistryContract, web3 } from "../../config/web3";
import { UserTransactionFileRepository } from "../../repositories/userTransactionFilesRepository";

export class UserFilesMetadataService {
  constructor(
    private readonly userTransactionFilesRepository: UserTransactionFileRepository
  ) {}

  async findFilesMetadataByUserId(userId: string) {
    const firstTransaction =
      await this.userTransactionFilesRepository.findFirstByUserId(userId);
    const lastTransaction =
      await this.userTransactionFilesRepository.findLastByUserId(userId);

    if (!firstTransaction || !lastTransaction) {
      return [];
    }

    const bytesUserIdHashed = web3.utils.asciiToHex(userId);
    const events = await fileMetadataRegistryContract.getPastEvents(
      "Register",
      {
        filter: {
          userId: bytesUserIdHashed,
          fromBlock: firstTransaction.blockNumber,
          toBlock: lastTransaction.blockNumber,
        },
      }
    );
    const filesMetadata = events.map((event) => {
      if (typeof event === "string") throw new Error("Event is a string");
      if (typeof !event.returnValues === "object")
        throw new Error("Event is not an object");

      const { name, checksum, userId, timestamp } =
        event.returnValues as Record<string, string>;
      return {
        name: web3.utils.hexToAscii(name),
        checksum: web3.utils.hexToAscii(checksum),
        userId: web3.utils.hexToAscii(userId),
        timestamp: Number(timestamp),
      };
    });

    return filesMetadata;
  }

  async registerFileMetadata(file: File, userId: string) {
    const { blockHash, transactionHash, blockNumber } =
      await this.saveFileMetadata(file.name, userId, file);
    await this.saveTransactionFile({
      userId,
      transactionHash,
      blockHash,
      blockNumber,
    });
  }

  private async getChecksum(file: Blob) {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const checksum = await crypto.subtle.digest("SHA-512", bytes);
    return web3.utils.bytesToHex(new Uint8Array(checksum));
  }

  private async saveTransactionFile(data: {
    userId: string;
    transactionHash: string;
    blockHash: string;
    blockNumber: bigint;
  }) {
    await this.userTransactionFilesRepository.create(data);
  }

  private async saveFileMetadata(fileName: string, userId: string, file: Blob) {
    const checksum = await this.getChecksum(file);
    const bytesName = web3.utils.asciiToHex(await this.sha256(fileName));
    const bytesUserId = web3.utils.asciiToHex(await this.sha256(userId));
    console.log("bytesName", bytesName);
    console.log("bytesUserId", bytesUserId);
    console.log("checksum", checksum);
    const receipt = await fileMetadataRegistryContract.methods
      .register(bytesName, checksum, bytesUserId)
      .send({ from: web3.eth.defaultAccount });

    return {
      transactionHash: receipt.transactionHash,
      blockHash: receipt.blockHash,
      blockNumber: receipt.blockNumber,
    };
  }

  private sha256(string: string) {
    const buffer = new TextEncoder().encode(string);
    return crypto.subtle.digest("SHA-256", buffer).then((hash) => {
      return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    });
  }
}
