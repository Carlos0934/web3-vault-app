import { fileMetadataRegistryContract, web3 } from "../../config/web3";
import { UserRepository } from "../../repositories/userRepository";

import { decrypt, encrypt, stringToArrayBuffer } from "../../utils/crypto";
import { hashHex } from "../../utils/hash";

export class UserFilesMetadataService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly encryptionKey: string
  ) {}

  async findFilesMetadataByUserId(userId: string) {
    const bytesUserIdHashed = await hashHex(userId, "SHA-256");

    const files = await fileMetadataRegistryContract.methods
      .getFilesByUser(bytesUserIdHashed)
      .call();

    const textDecoder = new TextDecoder();
    const filesMetadata = await Promise.all(
      files.map(async (file: any) => ({
        key: textDecoder.decode(
          await decrypt(web3.utils.hexToBytes(file.key), this.encryptionKey)
        ),
        checksum: file.checksum,
        name: textDecoder.decode(
          await decrypt(web3.utils.hexToBytes(file.name), this.encryptionKey)
        ),
        size: new Number(file.size),
        timestamp: new Number(file.timestamp),
      }))
    );

    return filesMetadata;
  }

  async registerFileMetadata(file: File, userId: string) {
    const user = await this.userRepo.getById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const { blockHash, transactionHash, blockNumber } =
      await this.saveFileMetadata({ file, userId, key: file.name });
  }

  private async getChecksum(file: File) {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const checksum = await crypto.subtle.digest("SHA-256", bytes);
    return web3.utils.bytesToHex(new Uint8Array(checksum));
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

    // Encrypt key and filename before storing in the contract to protect user privacy and data

    const bytesKey = web3.utils.bytesToHex(
      await encrypt(stringToArrayBuffer(key), this.encryptionKey)
    );

    const bytesFilename = web3.utils.bytesToHex(
      await encrypt(stringToArrayBuffer(file.name), this.encryptionKey)
    );

    const receipt = await fileMetadataRegistryContract.methods
      .registerFile(bytesKey, checksum, bytesFilename, size, hashedUserId)
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
