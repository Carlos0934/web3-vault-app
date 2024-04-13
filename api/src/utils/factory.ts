import db from "../config/db";
import { secrets } from "../config/secrets";
import { UserRepository } from "../repositories/user.repository";
import { AuthService } from "../services/authService";

const config = {
  [AuthService.name]: () => {
    return new AuthService(new UserRepository(db), secrets.jwtSecret);
  },

  [UserRepository.name]: () => {
    return new UserRepository(db);
  },
};
export function factoryCreateClass<T>(keyClass: new (...args: any) => T): T {
  const instance = config[keyClass.name]();
  if (!instance) {
    throw new Error("Class not found");
  }

  return instance as T;
}
