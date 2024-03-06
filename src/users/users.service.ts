import { inject, injectable } from "inversify";
import { IConfigService } from "../config/config.service.interface";
import { TYPES } from "../types";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { User } from "./user.entity";
import { IUsersRepository } from "./users.repository.interface";
import { IUserService } from "./users.service.interface";

@injectable()
export class UserService implements IUserService {

  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
  ) {}
  
  async createUser ({ email, name, password }: UserRegisterDto) {
    
    const newUser = new User(email, name);
    const salt = this.configService.get<number>('SALT');
		await newUser.setPassword(password, Number(salt));

    // check user exists. if exists - return null. else - create new and return User
    const existedUser = await this.usersRepository.find(email);
    if (existedUser) {
      return null;
    } else {
      return this.usersRepository.create(newUser);
    }

  };

  async validateUser({ email, password }: UserLoginDto) {
    const existedUser = await this.usersRepository.find(email);

    if (!existedUser) {
      return false;
    }

    const newUser = new User(existedUser.email, existedUser.name, existedUser.password);
    return newUser.comparePassword(password);

  };

  async findUserByEmail( email: string ) {
    return this.usersRepository.find(email);
  }

}