import { NextFunction, Request, Response } from 'express';
import { IExeptionFilter } from './exeption.filter.interface';
import { HTTPError } from './http-error.class';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class ExeptionFilter implements IExeptionFilter {
	constructor(@inject(TYPES.ILogger) protected logger: ILogger) {
		this.logger = logger;
	}

	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		let errMsg = err.message;
		let errCode = 500;

		if (err instanceof HTTPError) {
			errCode = err.statusCode;
			errMsg = `[${err.context}] Ошибка: ${errCode} ${err.message}`;
		}

		this.logger.error(errMsg);
		res.status(errCode).send({ err: errMsg });
	}
}
