
export interface ILinksService {
	generate: (userId: number, link: string) => any;
	findByLink: (shortlink: string) => any;
	findByUser: (userId: number) => any;
}