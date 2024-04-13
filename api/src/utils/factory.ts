import db from "../config/db";
import { secrets } from "../config/secrets";
import { UserRepository } from "../repositories/userRepository";
import { UserTransactionFileRepository } from "../repositories/userTransactionFilesRepository";
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
    return new FileService(secrets.encryptionKey, "files");
  },
  [UserFilesMetadataService.name]: () => {
    return new UserFilesMetadataService(
      new UserTransactionFileRepository(db),
      new UserRepository(db)
    );
  },
  [UserTransactionFileRepository.name]: () => {
    return new UserTransactionFileRepository(db);
  },
};
export function factoryCreateClass<T>(keyClass: new (...args: any) => T): T {
  const instance = config[keyClass.name]();
  if (!instance) {
    throw new Error("Class not found");
  }

  return instance as T;
}
