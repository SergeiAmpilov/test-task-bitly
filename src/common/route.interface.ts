import { Request, Response, NextFunction, Router } from 'express';
import { IMiddleWare } from './middleware.interface';

export interface IControllerRoute {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
	middlewares?: IMiddleWare[];
}

export type TResp = Response<any, Record<string, any>>;
