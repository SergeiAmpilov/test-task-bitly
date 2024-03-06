import { User } from "./user.entity";

export interface IUsersRepository {
  create: (user: User) => any;
  find: (email: string) => any;
  login: (user: User, password: string) => any;
}