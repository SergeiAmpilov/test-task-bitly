import { UserModel } from "@prisma/client";
import { compare } from "bcryptjs";
import { inject, injectable } from "inversify";
import { PrismaService } from "../database/prisma.service";
import { TYPES } from "../types";
import { User } from "./user.entity";
import { IUsersRepository } from "./users.repository.interface";


@injectable()
export class UsersRepository implements IUsersRepository {

  constructor(
		@inject(TYPES.PrismaService) private prismaService: PrismaService
  ) {}
  
  async create({ email, password, name }: User): Promise<UserModel> {
    return this.prismaService.client.userModel.create({
      data: {
        email,
        password,
        name
      }
    });
  }

  async login(user: UserModel, password: string): Promise<boolean | null> {
    const foundUser = await this.find(user.email);
    if (foundUser) {
      return compare(password, user.password);
    } else {
      return null;
    }    
  }

  async find(email: string): Promise<UserModel | null> {
    return this.prismaService.client.userModel.findFirst({
      where: {
        email,
      }
    });
  }
  
}