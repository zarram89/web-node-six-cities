import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../exception-filter/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { TokenService } from '../../auth/token.service.js';

export class AuthenticateMiddleware implements Middleware {
  constructor(private readonly tokenService: TokenService) { }

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Authorization header missing or invalid',
        'AuthenticateMiddleware'
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer '

    try {
      const payload = await this.tokenService.verify(token);
      req.user = payload;
      next();
    } catch (error) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid or expired token',
        'AuthenticateMiddleware'
      );
    }
  }
}
