import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { HttpError } from '../exception-filter/http-error.js';
import { StatusCodes } from 'http-status-codes';

export class ValidateDtoMiddleware implements Middleware {
  constructor(private dto: ClassConstructor<object>) { }

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, req.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const errorMessages = errors.map((error) => {
        const constraints = error.constraints;
        return constraints ? Object.values(constraints).join(', ') : 'Validation error';
      });

      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `Validation error: ${errorMessages.join('; ')}`,
        'ValidateDtoMiddleware'
      );
    }

    next();
  }
}
