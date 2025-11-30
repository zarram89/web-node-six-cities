import { Logger as PinoInstance, pino } from 'pino';
import { injectable } from 'inversify';
import { Logger } from './logger.interface.js';

@injectable()
export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;

  constructor() {
    this.logger = pino();
    this.logger.info('Logger created...');
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(args, message);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn(args, message);
  }

  public error(message: string, ...args: unknown[]): void {
    this.logger.error(args, message);
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(args, message);
  }
}
