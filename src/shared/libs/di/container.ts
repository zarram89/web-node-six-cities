import { Container } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { RestApplication } from '../../../rest/rest.application.js';
import { Logger } from '../logger/logger.interface.js';
import { PinoLogger } from '../logger/pino.logger.js';
import { Config } from '../config/config.interface.js';
import { RestConfig } from '../config/rest.config.js';
import { RestSchema } from '../config/rest.schema.js';
import { DatabaseClient } from '../database-client/database-client.interface.js';
import { MongoDatabaseClient } from '../database-client/mongo.database-client.js';
import { ExceptionFilter } from '../../libs/rest/exception-filter/exception-filter.interface.js';
import { AppExceptionFilter } from '../../libs/rest/exception-filter/app-exception-filter.js';
import { createUserContainer } from '../../modules/user/user.container.js';
import { createOfferContainer } from '../../modules/offer/offer.container.js';
import { createCommentContainer } from '../../modules/comment/comment.container.js';

export function createRestApplicationContainer() {
  const restApplicationContainer = new Container();

  restApplicationContainer.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  restApplicationContainer.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  restApplicationContainer.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  restApplicationContainer.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  restApplicationContainer.bind<ExceptionFilter>(Component.ExceptionFilter).to(AppExceptionFilter).inSingletonScope();

  restApplicationContainer.load(createUserContainer());
  restApplicationContainer.load(createOfferContainer());
  restApplicationContainer.load(createCommentContainer());

  return restApplicationContainer;
}
