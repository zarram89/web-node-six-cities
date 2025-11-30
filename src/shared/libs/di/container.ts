import { Container } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { RestApplication } from '../../../rest/rest.application.js';
import { Logger } from '../logger/logger.interface.js';
import { PinoLogger } from '../logger/pino.logger.js';
import { Config } from '../config/config.interface.js';
import { RestConfig } from '../config/rest.config.js';
import { RestSchema } from '../config/rest.schema.js';

export function createRestApplicationContainer() {
  const restApplicationContainer = new Container();

  restApplicationContainer.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  restApplicationContainer.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  restApplicationContainer.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();

  return restApplicationContainer;
}
