import { fileMetadataRegistryContract, web3 } from "../../config/web3";
import { UserRepository } from "../../repositories/userRepository";
import { UserTransactionFileRepository } from "../../repositories/userTransactionFilesRepository";
import { hashHex } from "../../utils/hash";

export class UserFilesMetadataService {
  constructor(
    private readonly userTransactionFilesRepository: UserTransactionFileRepository,
    private readonly userRepo: UserRepository
  ) {}

  async findFilesMetadataByUserId(userId: string) {
    const bytesUserIdHashed = await hashHex(userId, "SHA-256");

    const files = await fileMetadataRegistryContract.methods
      .getFilesByUser(bytesUserIdHashed)
      .call();

    const filesMetadata = files.map((file: any) => ({
      key: web3.utils.hexToAscii(file.key),
      checksum: file.checksum,
      name: file.name,
      size: new Number(file.size),
      userId: web3.utils.hexToAscii(file.userId),
      timestamp: new Number(file.timestamp),
    }));
    console.log(filesMetadata);
    return filesMetadata;
  }

  async registerFileMetadata(file: File, userId: string) {
    const user = await this.userRepo.getById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const { blockHash, transactionHash, blockNumber } =
      await this.saveFileMetadata({ file, userId, key: file.name });
    await this.saveTransactionFile({
      userId,
      transactionHash,
      blockHash,
      blockNumber,
    });
  }

  private async getChecksum(file: File) {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const checksum = await crypto.subtle.digest("SHA-256", bytes);
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

  private async saveFileMetadata({
    file,
    userId,
    key,
  }: {
    key: string;
    userId: string;
    file: File;
  }) {
    const checksum = await this.getChecksum(file);

    const size = file.size;
    const hashedUserId = await hashHex(userId, "SHA-256");
    const bytesKey = web3.utils.asciiToHex(key);

    const receipt = await fileMetadataRegistryContract.methods
      .registerFile(bytesKey, checksum, file.name, size, hashedUserId)
      .send({
        from: web3.eth.defaultAccount,
        gas: "1000000",
        gasPrice: "1000000000000",
      });

    return {
      transactionHash: receipt.transactionHash,
      blockHash: receipt.blockHash,
      blockNumber: receipt.blockNumber,
    };
  }
}
