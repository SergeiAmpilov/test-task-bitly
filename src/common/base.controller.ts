import { LoggerService } from '../logger/logger.service';
import { Response, Router } from 'express';
import { IControllerRoute, TResp } from './route.interface';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public created(res: Response): TResp {
		return res.sendStatus(201);
	}

	public send<T>(res: Response, code: number, message: T): TResp {
		return res.type('application/json').status(code).json(message);
	}

	public ok<T>(res: Response, message: T): TResp {
		return this.send<T>(res, 200, message);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${route.path}`);
			const middleware = route.middlewares?.map(m => m.execute.bind(m));
			const handler = route.func.bind(this);
			const pipeline = middleware ? [...middleware, handler] : handler;
			this.router[route.method](route.path, pipeline);
		}
	}
}
