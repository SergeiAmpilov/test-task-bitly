import { NextFunction, Request, Response } from 'express';

export interface ILinksController {
	generate: (req: Request, res: Response, next: NextFunction) => void;
	findByLink: (req: Request, res: Response, next: NextFunction) => void;
	findByUser: (req: Request, res: Response, next: NextFunction) => void;
}