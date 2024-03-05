import { IConfigService } from "./config.service.interface";
import { config, parse, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { injectable, inject } from "inversify";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from '../types';

@injectable()
export class ConfigService implements IConfigService {

  private config: DotenvParseOutput;

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger
  ) {
    const result: DotenvConfigOutput = config();

    if (result.error) {
      this.logger.error(`Cannot read .env file: ${result.error.message}`);
    } else {
      this.logger.log('[ConfigService] config from .env uploaded successful');
      this.config = result.parsed as DotenvParseOutput;
    }

	}


  get<T extends string | number>(key: string): T {
    return this.config[key] as T;
  };

}