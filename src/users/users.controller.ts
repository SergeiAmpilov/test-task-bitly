import { BaseController } from '../common/base.controller';
import { IControllerRoute } from '../common/route.interface';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IUserController } from './users.controller.interface';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { UserLoginDto } from './dto/user-login.dto';
import { Request, Response, NextFunction } from 'express';
import { IUserService } from './users.service.interface';
import { ValidateMiddleware } from '../common/validate.middleware';
import { AuthGuard } from '../common/auth.guard';
import { UserRegisterDto } from './dto/user-register.dto';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { HTTPError } from '../errors/http-error.class';


@injectable()
export class UsersController extends BaseController implements IUserController {
		
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UsersService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService
	) {
		super(loggerService);

		const routesDate: IControllerRoute[] = [
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
			},
		];

		this.bindRoutes(routesDate);
	}
	async login({ body }: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
		const resLogin = await this.userService.validateUser(body);

		if (!resLogin) {
			return next(new HTTPError(401, 'error while login'));
		}

		const jwt = await this.signJwt(body.email, this.configService.get('SECRET') );

		this.ok(res, { jwt });
	};

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction): Promise<void> {
			const result = await this.userService.createUser(body);

			if (!result) {
				return next(new HTTPError(422, 'This user allready exists'));
			}		
		
			this.ok(res, { email: result.email, id: result.id });
	};

	async info (req: Request, res: Response, next: NextFunction): Promise<void> {
		//
		const userFound = await this.userService.findUserByEmail(req.user);

		if (userFound) {
			this.ok(res, {id: userFound.id, email: userFound.email});		
		} else {
			res.status(404).send('No user found ?!');
		}
	};

	private signJwt(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {

			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256'
				},
				(err, token) => {
					if (err) {
						reject(err);
					}

					resolve(token as string);
				});

		});

	}



		
}