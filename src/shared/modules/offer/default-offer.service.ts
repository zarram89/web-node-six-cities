import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './create-offer.dto.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
        @inject(Component.Logger) private readonly logger: Logger,
        @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) { }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async find(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find();
  }
}
