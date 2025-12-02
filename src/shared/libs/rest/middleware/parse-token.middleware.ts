import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import { TokenService } from '../../auth/token.service.js';

export class ParseTokenMiddleware implements Middleware {
  constructor(private readonly tokenService: TokenService) { }

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);

    try {
      const payload = await this.tokenService.verify(token);
      req.user = payload;
      next();
    } catch {
      next();
    }
  }
}
