import db from "../config/db";
import { secrets } from "../config/secrets";
import { UserFileRepository } from "../repositories/userFileRepository";
import { UserRepository } from "../repositories/userRepository";

import { AuthService } from "../services/authService";
import { IotaTangleService } from "../services/tangleService";

const config = {
  [AuthService.name]: () => {
    return new AuthService(new UserRepository(db), secrets.jwtSecret);
  },

  [UserRepository.name]: () => {
    return new UserRepository(db);
  },

  [IotaTangleService.name]: () => {
    return new IotaTangleService(
      new UserFileRepository(db),
      secrets.iotaNodes,
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
