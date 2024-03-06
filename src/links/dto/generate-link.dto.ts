import { IsString, IsUrl } from 'class-validator';

export class GenerateLinkDto {
	@IsUrl()
	link: string;
}