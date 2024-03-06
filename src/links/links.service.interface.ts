import { LinkModel } from '@prisma/client';

export interface ILinksService {
	generate: (userId: number, link: string) => Promise<LinkModel | null>;
	findByLink: (shortlink: string) => Promise<LinkModel | null>;
	findByUser: (userId: number) => Promise<LinkModel[]>;
}