import { fileMetadataRegistryContract, web3 } from "../../config/web3";

export class UserFilesMetadataService {
  constructor() {}

  async findFilesMetadataByUserId(userId: string) {
    const bytesUserIdHashed = web3.utils.asciiToHex(userId);
    const events = await fileMetadataRegistryContract.getPastEvents(
      "Register",
      {
        filter: { userId: bytesUserIdHashed },
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

  async registerFileMetadata(
    name: string,
    checksum: string,
    userId: string,
    timestamp: number
  ) {
    const bytesName = web3.utils.asciiToHex(name);
    const bytesChecksum = web3.utils.asciiToHex(checksum);
    const bytesUserId = web3.utils.asciiToHex(userId);
    const bytesTimestamp = web3.utils.numberToHex(timestamp);

    const receipt = await fileMetadataRegistryContract.methods
      .register(bytesName, bytesChecksum, bytesUserId, bytesTimestamp)
      .send({ from: web3.eth.defaultAccount });

    return receipt;
  }
}
