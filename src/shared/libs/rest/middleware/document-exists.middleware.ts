import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../exception-filter/http-error.js';
import { StatusCodes } from 'http-status-codes';

export interface DocumentExists {
  exists(documentId: string): Promise<boolean>;
}

export class DocumentExistsMiddleware implements Middleware {
  constructor(
    private service: DocumentExists,
    private entityName: string,
    private paramName: string,
  ) { }

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = req.params[this.paramName];

    if (!await this.service.exists(documentId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with ${documentId} not found.`,
        'DocumentExistsMiddleware'
      );
    }

    next();
  }
}
