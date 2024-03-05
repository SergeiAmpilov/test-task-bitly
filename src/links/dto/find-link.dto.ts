import { IsString, IsUrl } from 'class-validator';

export class FindByLinkDto {
	@IsString({
		message: 'short link is incorrect'
	})
	shortlink: string;
}