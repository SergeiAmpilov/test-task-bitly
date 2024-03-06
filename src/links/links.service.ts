import { injectable } from 'inversify';
import { ILinksService } from './links.service.interface';
import { LinksModel } from './links.model';

@injectable()
export class LinksService implements ILinksService {

	constructor() {}

	async generate(userId: string, link: string) {
		const shortlink = this.generateShortLink(); /* need to add checkup - if already exists */
		return LinksModel.create({
			link,
			shortlink,
			userid: userId,
		});
	};

	async findByLink(shortlink: string) {
		return LinksModel.findOne({ shortlink }).exec();
	};
	async findByUser(userid: string) {				
		return LinksModel.find({ userid }).exec();
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