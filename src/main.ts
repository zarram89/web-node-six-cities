import 'reflect-metadata';
import { Container } from 'inversify';
import { createRestApplicationContainer } from './shared/libs/di/container.js';
import { Component } from './shared/types/component.enum.js';
import { RestApplication } from './rest/rest.application.js';

async function bootstrap() {
  const appContainer: Container = createRestApplicationContainer();
  const application = appContainer.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
