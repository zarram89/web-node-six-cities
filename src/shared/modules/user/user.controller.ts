import { inject, injectable } from 'inversify';
import { Response, Request } from 'express';
import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { UserService } from './user-service.interface.js';
import { Config } from '../../libs/config/config.interface.js';
import { RestSchema } from '../../libs/config/rest.schema.js';
import { HttpMethod } from '../../libs/rest/controller/http-method.enum.js';
import { CreateUserDto } from './create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { UserRdo } from './rdo/user.rdo.js';
import { fillDTO } from '../../helpers/common.js';
import { HttpError } from '../../libs/rest/exception-filter/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { ValidateDtoMiddleware } from '../../libs/rest/middleware/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../libs/rest/middleware/validate-objectid.middleware.js';
import { DocumentExistsMiddleware } from '../../libs/rest/middleware/document-exists.middleware.js';
import { UploadFileMiddleware } from '../../libs/rest/middleware/upload-file.middleware.js';
import { AuthenticateMiddleware } from '../../libs/rest/middleware/authenticate.middleware.js';
import { TokenService } from '../../libs/auth/token.service.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
    @inject(Component.TokenService) private readonly tokenService: TokenService,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController...');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkStatus,
      middlewares: [new AuthenticateMiddleware(this.tokenService)]
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Post,
      handler: this.logout,
      middlewares: [new AuthenticateMiddleware(this.tokenService)]
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new DocumentExistsMiddleware(this.userService, 'User', 'userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar')
      ]
    });
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    res: Response,
  ): Promise<void> {
    const user = await this.userService.findByEmail(body.email);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid email or password',
        'UserController',
      );
    }

    const passwordValid = user.verifyPassword(body.password, this.configService.get('SALT'));

    if (!passwordValid) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid email or password',
        'UserController',
      );
    }

    const token = await this.tokenService.sign({
      userId: user.id,
      email: user.email
    });

    this.ok(res, {
      ...fillDTO(UserRdo, user),
      token
    });
  }

  public async checkStatus(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'User not found',
        'UserController'
      );
    }

    this.ok(res, fillDTO(UserRdo, user));
  }

  public async logout(_req: Request, res: Response): Promise<void> {
    // For JWT, logout happens on client side by removing the token
    // Token will expire based on JWT_EXPIRES_IN configuration
    this.noContent(res, { message: 'Logged out successfully' });
  }

  public async uploadAvatar(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const avatarPath = req.file?.filename;

    if (!avatarPath) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Avatar file is required',
        'UserController'
      );
    }

    await this.userService.updateById(userId, { avatarUrl: avatarPath });

    this.created(res, { avatarUrl: avatarPath });
  }
}
