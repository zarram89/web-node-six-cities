import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../exception-filter/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';

export class ValidateObjectIdMiddleware implements Middleware {
  constructor(private param: string) { }

  public execute(req: Request, _res: Response, next: NextFunction): void {
    const objectId = req.params[this.param];

    if (!Types.ObjectId.isValid(objectId)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `${this.param} field is not a valid ObjectID`,
        'ValidateObjectIdMiddleware'
      );
    }

    next();
  }
}
