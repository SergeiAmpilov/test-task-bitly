import 'reflect-metadata';
import express, { Express } from 'express';
import { json } from 'body-parser';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import { UsersController } from './users/users.controller';
import { ExeptionFilter } from './errors/exeption.filter';
import { IConfigService } from './config/config.service.interface';
import { AuthMiddleware } from './common/auth.middleware';
import { LinksController } from './links/links.controller';
import mongoose from 'mongoose';

@injectable()
export class App {
	app: Express;
	port: number;
	server: Server;
  dbName: string;


	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UsersController) private usersController: UsersController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: ExeptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.LinksController) private linksController: LinksController,
		
	) {
		this.app = express();
		this.port = process.env.PORT ? Number(process.env.PORT) : 8000;
    this.dbName = process.env?.DB_NAME ? process.env.DB_NAME : 'bitly';
		this.logger = logger;
		this.usersController = usersController;
		this.exeptionFilter = exeptionFilter;
	}

	useMiddleware(): void {
		this.app.use(json()); // body-parser
		const authMiddleware = new AuthMiddleware( this.configService.get('SECRET')	);
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoutes(): void {
		this.app.use('/users', this.usersController.router);
		this.app.use(this.linksController.router);
	}

	useExeptionFilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {

		try {
	    await mongoose.connect(`mongodb://0.0.0.0:27017/${this.dbName}`);
			this.logger.log('[mongodb] connected to database');
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error(`[mongodb] ${e.message}`)
			}
		}

		this.useMiddleware();
		this.useRoutes();
		this.useExeptionFilters();

		this.server = this.app.listen(this.port, () => {
			this.logger.log(
				`Server has been started on http://localhost:${this.port}`,
			);
		});
	}

	public close(): void {
		this.server.close();
	}

}