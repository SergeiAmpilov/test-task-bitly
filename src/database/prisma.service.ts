import { PrismaClient, UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class PrismaService {
  client: PrismaClient;

  constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
  ) {
    this.client = new PrismaClient();
  }

  async connect(): Promise<void> {
    try {
      await this.client.$connect();
      this.logger.log('[Prisma service] Success connected to DB');
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('[Prisma service] error connecting DB.', error.message);
      }
    }
  }

  async disconnect(): Promise<void> {
    await this.client.$disconnect();
  }
}