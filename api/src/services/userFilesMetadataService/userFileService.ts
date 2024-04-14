import { fileMetadataRegistryContract, web3 } from "../../config/web3";
import { UserRepository } from "../../repositories/userRepository";

import { decrypt, encrypt, stringToUint8Array } from "../../utils/crypto";
import { hashHex } from "../../utils/hash";
import { RegisterFileMetadataInput } from "./types";

export class UserFilesMetadataService {
  private readonly textDecoder = new TextDecoder();
  constructor(
    private readonly userRepo: UserRepository,
    private readonly encryptionKey: string
  ) {}

  async findFilesMetadataByUserId(userId: string) {
    const bytesUserIdHashed = await this.hashUserId(userId);

    const files = await fileMetadataRegistryContract.methods
      .getFilesByUser(bytesUserIdHashed)
      .call();

    const filesMetadata = await Promise.all(
      files.map(this.parseFileMetadata.bind(this))
    );

    return filesMetadata;
  }

  async findFileMetadataByUserIdAndKey(userId: string, key: string) {
    const bytesUserIdHashed = await this.hashUserId(userId);
    const encryptedKey = web3.utils.bytesToHex(
      await encrypt(stringToUint8Array(key), this.encryptionKey)
    );

    const file = await fileMetadataRegistryContract.methods
      .getFileByKey(bytesUserIdHashed, encryptedKey)
      .call();

    const fileMetadata = await this.parseFileMetadata(file);

    return fileMetadata;
  }

  async registerFileMetadata({
    userId,
    file,
    key,
    checksum,
  }: RegisterFileMetadataInput) {
    const user = await this.userRepo.getById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const size = file.size;
    const hashedUserId = await this.hashUserId(userId);

    // Encrypt key and filename before storing in the contract to protect user privacy and data

    const bytesKey = await this.createEncryptedHex(key);

    const bytesFilename = await this.createEncryptedHex(file.name);

    const hexChecksum = web3.utils.bytesToHex(checksum);

    const receipt = await fileMetadataRegistryContract.methods
      .registerFile(bytesKey, hexChecksum, bytesFilename, size, hashedUserId)
      .send({
        from: web3.eth.defaultAccount,
        gas: "1000000",
        gasPrice: "1000000000000",
      });

    console.log("receipt", receipt);
  }

  async deleteFileMetadata(userId: string, key: string) {
    const bytesUserIdHashed = await this.hashUserId(userId);
    const encryptedKeyHex = await this.createEncryptedHex(key);

    const receipt = await fileMetadataRegistryContract.methods
      .deleteUserFileByKey(bytesUserIdHashed, encryptedKeyHex)
      .send({
        from: web3.eth.defaultAccount,
        gas: "1000000",
        gasPrice: "1000000000000",
      });

    console.log("receipt", receipt);
  }
  private async parseFileMetadata(file: any) {
    return {
      key: this.textDecoder.decode(
        await decrypt(web3.utils.hexToBytes(file.key), this.encryptionKey)
      ),
      checksum: file.checksum,
      name: this.textDecoder.decode(
        await decrypt(web3.utils.hexToBytes(file.name), this.encryptionKey)
      ),
      size: new Number(file.size),
      timestamp: new Number(file.timestamp),
    };
  }

  private async hashUserId(userId: string) {
    return await hashHex(userId, "SHA-256");
  }
  private async createEncryptedHex(value: string) {
    return web3.utils.bytesToHex(
      await encrypt(stringToUint8Array(value), this.encryptionKey)
    );
  }
}
