import db from "../config/db";
import { secrets } from "../config/secrets";
import { UserRepository } from "../repositories/userRepository";

import { AuthService } from "../services/authService";
import { FileService } from "../services/fileService";
import { UserFilesMetadataService } from "../services/userFilesMetadataService/userFileService";

const config = {
  [AuthService.name]: () => {
    return new AuthService(new UserRepository(db), secrets.jwtSecret);
  },

  [UserRepository.name]: () => {
    return new UserRepository(db);
  },

  [FileService.name]: () => {
    return new FileService({
      bucketName: "web3_vault",
      credentials: {
        accessKeyId: secrets.awsAccessKeyId,
        secretAccessKey: secrets.awsSecretAccessKey,
      },
      encryptionKey: secrets.encryptionKey,
      region: "us-east-1",
    });
  },
  [UserFilesMetadataService.name]: () => {
    return new UserFilesMetadataService(
      new UserRepository(db),
      secrets.encryptionKey
    );
  },
};
export function factoryCreateClass<T>(keyClass: new (...args: any) => T): T {
  const instance = config[keyClass.name]();
  if (!instance) {
    throw new Error("Class not found");
  }

  return instance as T;
}
