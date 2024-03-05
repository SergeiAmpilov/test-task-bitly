import { Container, interfaces } from 'inversify';
import { ContainerModule } from 'inversify/lib/container/container_module';
import { ILogger } from './logger/logger.interface';
import { App } from './app';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './logger/types';



export interface IBootstrapReturn {
	app: App;
	appContainer: Container;
}


export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.Application).to(App).inSingletonScope();
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	// bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter).inSingletonScope();
	// bind<IUserController>(TYPES.UsersController).to(UsersController).inSingletonScope();
	// bind<IUserService>(TYPES.UsersService).to(UserService).inSingletonScope();
	// bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	// bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	// bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
});


async function bootstrap(): Promise<IBootstrapReturn> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();

	return { app, appContainer };
}


export const boot = bootstrap();