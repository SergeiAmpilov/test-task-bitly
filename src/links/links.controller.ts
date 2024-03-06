import { BaseController } from '../common/base.controller';
import { ILinksController } from './links.controller.interface';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { GenerateLinkDto } from './dto/generate-link.dto';
import { IControllerRoute } from '../common/route.interface';
import { AuthGuard } from '../common/auth.guard';
import { FindByLinkDto } from './dto/find-link.dto';
import { ILinksService } from './links.service.interface';
import { IUserService } from '../users/users.service.interface';
import { ValidateMiddleware } from '../common/validate.middleware';

@injectable()
export class LinksController extends BaseController implements ILinksController {

	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.LinksService) private linksService: ILinksService,
		@inject(TYPES.UsersService) private usersService: IUserService,
	) {
		super(loggerService);

		const routesDate: IControllerRoute[] = [
			{
				path: '/generate',
				method: 'post',
				func: this.generate,
				middlewares: [new AuthGuard(), new ValidateMiddleware(GenerateLinkDto)],
			},
			{
				path: '/findbylink',
				method: 'post',
				func: this.findByLink,
				middlewares: [ new ValidateMiddleware(FindByLinkDto) ]
			},
			{
				path: '/findbyuser',
				method: 'post',
				func: this.findByUser,
				middlewares: [new AuthGuard()],
			}
		];

		this.bindRoutes(routesDate);
	}


	async generate (req: Request<{}, {}, GenerateLinkDto>, res: Response, next: NextFunction): Promise<void> {

		const userFound = await this.usersService.findUserByEmail(req.user);

		if (!userFound) {
			res.status(404).send('No user found ?!');
		} else {
			const newLink = await this.linksService.generate(userFound.id, req.body.link);

			if (newLink) {
				this.ok(res, {
					link: newLink.link,
					shortlink: newLink.shortlink,
				});
			} else {
				res.status(500).send('Cannot create link');
			}
		}

	};


	async findByLink (req: Request<{}, {}, FindByLinkDto>, res: Response, next: NextFunction): Promise<void> {

		const linkFound = await this.linksService.findByLink(req.body.shortlink);

		if (linkFound) {
			this.ok(res, {
				link: linkFound.link,
				shortlink: linkFound.shortlink
			});
		} else {
			res.status(404).send('Link not found');
		}

	};

	async findByUser (req: Request, res: Response, next: NextFunction): Promise<void> {

		const userFound = await this.usersService.findUserByEmail(req.user);

		if (!userFound) {
			res.status(404).send('No user found ?!');
		} else {
			const linkList = await this.linksService.findByUser(userFound.id);

			this.ok(res, {
				links: linkList,
			});
			
		}



	};
}
