import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";

export interface IUserService {
  createUser: (dto: UserRegisterDto) => any;
  validateUser: (dto: UserLoginDto) => any;
  findUserByEmail: (email: string) => any;
}