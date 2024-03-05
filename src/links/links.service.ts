import { GetResult } from '@prisma/client/runtime';
import { ILinksService } from './links.service.interface';


export class LinksService implements ILinksService {
	generate: (userId: string, link: string) => Promise<(GetResult<{ id: number; link: string; shortlink: string; userid: number; }, unknown> & {}) | null>;
	findByLink: (shortlink: string) => Promise<(GetResult<{ id: number; link: string; shortlink: string; userid: number; }, unknown> & {}) | null>;
	findByUser: (userId: string) => Promise<(GetResult<{ id: number; link: string; shortlink: string; userid: number; }, unknown> & {})[] | null>;
}