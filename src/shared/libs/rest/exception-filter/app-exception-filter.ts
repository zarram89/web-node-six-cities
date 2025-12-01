import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { ExceptionFilter } from './exception-filter.interface.js';
import { Logger } from '../../logger/logger.interface.js';
import { Component } from '../../../types/component.enum.js';
import { HttpError } from './http-error.js';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.logger.info('Register AppExceptionFilter');
  }

  public catch(error: Error | HttpError, req: Request, res: Response, _next: NextFunction): void {
    if (error instanceof HttpError) {
      this.logger.error(`[${req.method}: ${req.url}] Error: ${error.message}`, error);
      res.status(error.httpStatusCode).json({
        error: error.message,
        detail: error.detail
      });
      return;
    }

    this.logger.error(`[${req.method}: ${req.url}] Error: ${error.message}`, error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
}
