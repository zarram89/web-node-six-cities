import { ContainerModule } from 'inversify';
import { CommentService } from './comment-service.interface.js';
import { Component } from '../../types/component.enum.js';
import { DefaultCommentService } from './default-comment.service.js';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { types } from '@typegoose/typegoose';

export const createCommentContainer = () =>
  new ContainerModule((bind) => {
    bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
    bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
  });
