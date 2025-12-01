import { ContainerModule } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { Component } from '../../types/component.enum.js';
import { DefaultOfferService } from './default-offer.service.js';
import { OfferEntity, OfferModel } from './offer.entity.js';
import { types } from '@typegoose/typegoose';
import { OfferController } from './offer.controller.js';
import { Controller } from '../../libs/rest/controller/controller.interface.js';

export const createOfferContainer = () =>
  new ContainerModule((bind) => {
    bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
    bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
    bind<Controller>(Component.OfferController).to(OfferController).inSingletonScope();
  });
