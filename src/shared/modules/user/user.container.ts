import { ContainerModule } from 'inversify';
import { UserService } from './user-service.interface.js';
import { Component } from '../../types/component.enum.js';
import { DefaultUserService } from './default-user.service.js';
import { UserEntity, UserModel } from './user.entity.js';
import { types } from '@typegoose/typegoose';
import { UserController } from './user.controller.js';
import { Controller } from '../../libs/rest/controller/controller.interface.js';

export const createUserContainer = () =>
  new ContainerModule((bind) => {
    bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
    bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
    bind<Controller>(Component.UserController).to(UserController).inSingletonScope();
  });
