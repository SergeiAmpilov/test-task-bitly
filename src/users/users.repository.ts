import { compare } from "bcryptjs";
import { injectable } from "inversify";
import { User } from "./user.entity";
import { IUsersRepository } from "./users.repository.interface";
import { UsersModel } from './users.model';


@injectable()
export class UsersRepository implements IUsersRepository {

  constructor() {}
  
  async create({ email, password, name }: User) {
    const newUser = await UsersModel.create({
      name,
      email,
      password
    });

    return newUser;
  }

  async login(user: User, password: string): Promise<boolean | null> {
    const userFound = await UsersModel.findOne({ email: user.email }).exec();
    if (userFound) {
      return compare(password, user.password);
    } else {
      return null;
    }    
  }

  async find(email: string) {
    const userFound = await UsersModel.findOne({ email }).exec();
    return userFound;
  }
  
}