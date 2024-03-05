import { LinkModel } from '@prisma/client';

export interface ILinksService {
	generate: (userId: string, link: string) => Promise<LinkModel | null>;
	findByLink: (shortlink: string) => Promise<LinkModel | null>;
	findByUser: (userId: string) => Promise<LinkModel[] | null>;
}