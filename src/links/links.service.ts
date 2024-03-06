import { inject, injectable } from 'inversify';
import { ILinksService } from './links.service.interface';
import { LinkModel } from '@prisma/client';
import { TYPES } from '../types';
import { PrismaService } from '../database/prisma.service';

@injectable()
export class LinksService implements ILinksService {

	constructor(
    @inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {}

	async generate(userId: number, link: string): Promise<LinkModel | null> {
		const shortlink = this.generateShortLink(); /* need to add checkup - if already exists */
		return this.prismaService.client.linkModel.create({
			data: {
				link,
				shortlink,
				userid: userId,
			}
		});
	};

	async findByLink(shortlink: string): Promise<LinkModel | null> {
		return this.prismaService.client.linkModel.findFirst({
			where: {
				shortlink
			}
		});
	};
	async findByUser(userId: number): Promise<LinkModel[]> {
		return this.prismaService.client.linkModel.findMany({
			where: {
				userid: userId
			}
		});
	};

	protected generateShortLink() {
		const letters = ['a', 'b', 'c', 'd', 'e', 'f'];
		const numbers = ['1', '2', '3', '4', '5', '6'];

		let result = '';

		for (let index = 0; index < 6; index++) {
			const rIndex = Math.floor(Math.random() * 6);
			result += index % 2 === 0 ? letters[rIndex] : numbers[rIndex];
		}

		return result;

	}
}