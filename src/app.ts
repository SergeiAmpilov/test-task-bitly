import 'reflect-metadata';
import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { TYPES } from './logger/types';
import { ILogger } from './logger/logger.interface';

@injectable()
export class App {
	app: Express;
	port: number;
	server: Server;


	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
	) {
		this.app = express();
		this.port = process.env.PORT ? Number(process.env.PORT) : 8000;
	}

	public async init(): Promise<void> {
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