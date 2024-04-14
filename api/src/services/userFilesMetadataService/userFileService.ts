import { fileMetadataRegistryContract, web3 } from "../../config/web3";
import { UserRepository } from "../../repositories/userRepository";

import { decrypt, encrypt, stringToUint8Array } from "../../utils/crypto";
import { hashHex } from "../../utils/hash";
import { RegisterFileMetadataInput } from "./types";

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
    const hashedUserId = await hashHex(userId, "SHA-256");

    // Encrypt key and filename before storing in the contract to protect user privacy and data

    const bytesKey = web3.utils.bytesToHex(
      await encrypt(stringToUint8Array(key), this.encryptionKey)
    );

    const bytesFilename = web3.utils.bytesToHex(
      await encrypt(stringToUint8Array(file.name), this.encryptionKey)
    );

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
}
