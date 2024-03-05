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

@injectable()
export class LinksController extends BaseController implements ILinksController {

	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
	) {
		super(loggerService);

		const routesDate: IControllerRoute[] = [
			{
				path: '/generate',
				method: 'post',
				func: this.generate,
				middlewares: [new AuthGuard()],
			},
			{
				path: '/findbylink',
				method: 'post',
				func: this.findByLink
			},
			{
				path: '/findbyuser',
				method: 'post',
				func: this.findByUser,
				middlewares: [new AuthGuard()],
			}
		];
	}


	async generate (req: Request<{}, {}, GenerateLinkDto>, res: Response, next: NextFunction): Promise<void> {
		// req.user - user email
		// req.body.link - link
		this.ok(res, {
			user: req.user,
			link: req.body.link
		});

	};


	async findByLink (req: Request<{}, {}, FindByLinkDto>, res: Response, next: NextFunction): Promise<void> {
		// req.body.shortlink - short link
		this.ok(res, {
			shortlink: req.body.shortlink
		});

	};

	async findByUser (req: Request, res: Response, next: NextFunction): Promise<void> {
		// req.user - user email
		this.ok(res, {
			user: req.user,
		});
	};
}
