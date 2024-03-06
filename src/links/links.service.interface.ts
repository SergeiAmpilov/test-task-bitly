
export interface ILinksService {
	generate: (userId: string, link: string) => any;
	findByLink: (shortlink: string) => any;
	findByUser: (userid: string) => any;
}