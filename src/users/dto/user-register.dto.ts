import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Incorrect email'})
	email: string;

	@IsString({ message: 'Set empty password' })
	password: string;

	@IsString({ message: 'Set empty name' })
	name: string;
}
