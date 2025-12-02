import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { OfferService } from './offer-service.interface.js';
import { HttpMethod } from '../../libs/rest/controller/http-method.enum.js';
import { fillDTO } from '../../helpers/common.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { CreateOfferDto } from './create-offer.dto.js';
import { OfferDetailRdo } from './rdo/offer-detail.rdo.js';
import { UpdateOfferDto } from './update-offer.dto.js';
import { ValidateDtoMiddleware } from '../../libs/rest/middleware/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../libs/rest/middleware/validate-objectid.middleware.js';
import { DocumentExistsMiddleware } from '../../libs/rest/middleware/document-exists.middleware.js';
import { AuthenticateMiddleware } from '../../libs/rest/middleware/authenticate.middleware.js';
import { ParseTokenMiddleware } from '../../libs/rest/middleware/parse-token.middleware.js';
import { TokenService } from '../../libs/auth/token.service.js';
import { HttpError } from '../../libs/rest/exception-filter/http-error.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.TokenService) private readonly tokenService: TokenService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController...');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [new ParseTokenMiddleware(this.tokenService)]
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new AuthenticateMiddleware(this.tokenService),
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [new AuthenticateMiddleware(this.tokenService)]
    });
    this.addRoute({
      path: '/premium/:city',
      method: HttpMethod.Get,
      handler: this.getPremium
    });
    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Post,
      handler: this.addToFavorites,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new AuthenticateMiddleware(this.tokenService)
      ]
    });
    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Delete,
      handler: this.removeFromFavorites,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new AuthenticateMiddleware(this.tokenService)
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ParseTokenMiddleware(this.tokenService),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new AuthenticateMiddleware(this.tokenService),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto)
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new AuthenticateMiddleware(this.tokenService),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
  }

  public async index(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    const offers = await this.offerService.find(userId);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create(
    req: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const { body, user } = req;
    const result = await this.offerService.create({ ...body, hostId: user!.userId });
    this.created(res, fillDTO(OfferDetailRdo, result));
  }

  public async show(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params as { offerId: string };
    const userId = req.user?.userId;
    const offer = await this.offerService.findById(offerId, userId);
    this.ok(res, fillDTO(OfferDetailRdo, offer));
  }

  public async update(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params as { offerId: string };
    const userId = req.user!.userId;
    const offer = await this.offerService.findById(offerId);

    if (offer?.hostId && (offer.hostId as unknown as { id: string }).id !== userId) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'You are not the owner of this offer',
        'OfferController'
      );
    }

    const body = req.body as UpdateOfferDto;
    const updatedOffer = await this.offerService.updateById(offerId, body);
    this.ok(res, fillDTO(OfferDetailRdo, updatedOffer));
  }

  public async delete(
    req: Request,
    res: Response
  ): Promise<void> {
    const { offerId } = req.params as { offerId: string };
    const userId = req.user!.userId;
    const offer = await this.offerService.findById(offerId);

    if (offer?.hostId && (offer.hostId as unknown as { id: string }).id !== userId) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'You are not the owner of this offer',
        'OfferController'
      );
    }

    await this.offerService.deleteById(offerId);
    this.noContent(res, null);
  }

  public async getFavorites(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const offers = await this.offerService.findFavorites(userId);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async addToFavorites(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params as { offerId: string };
    const userId = req.user!.userId;
    const result = await this.offerService.addToFavorites(offerId, userId);
    this.ok(res, fillDTO(OfferDetailRdo, result));
  }

  public async removeFromFavorites(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params as { offerId: string };
    const userId = req.user!.userId;
    const result = await this.offerService.removeFromFavorites(offerId, userId);
    this.ok(res, fillDTO(OfferDetailRdo, result));
  }

  public async getPremium(req: Request, res: Response): Promise<void> {
    const { city } = req.params as { city: string };
    const offers = await this.offerService.findPremiumByCity(city);
    this.ok(res, fillDTO(OfferRdo, offers));
  }
}
