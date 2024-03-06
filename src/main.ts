import { Container, interfaces } from 'inversify';
import { ContainerModule } from 'inversify/lib/container/container_module';
import { ILogger } from './logger/logger.interface';
import { App } from './app';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { IUserController } from './users/users.controller.interface';
import { IUserService } from './users/users.service.interface';
import { ExeptionFilter } from './errors/exeption.filter';
import { UsersController } from './users/users.controller';
import { UserService } from './users/users.service';
import { IUsersRepository } from './users/users.repository.interface';
import { UsersRepository } from './users/users.repository';
import { ILinksController } from './links/links.controller.interface';
import { LinksController } from './links/links.controller';
import { ILinksService } from './links/links.service.interface';
import { LinksService } from './links/links.service';



export interface IBootstrapReturn {
	app: App;
	appContainer: Container;
}


export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.Application).to(App).inSingletonScope();
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter).inSingletonScope();
	bind<IUserController>(TYPES.UsersController).to(UsersController).inSingletonScope();
	bind<IUserService>(TYPES.UsersService).to(UserService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
	bind<ILinksController>(TYPES.LinksController).to(LinksController).inSingletonScope();
	bind<ILinksService>(TYPES.LinksService).to(LinksService).inSingletonScope();
});


async function bootstrap(): Promise<IBootstrapReturn> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();

	return { app, appContainer };
}


export const boot = bootstrap();