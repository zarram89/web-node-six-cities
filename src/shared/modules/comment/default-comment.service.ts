import { inject, injectable } from 'inversify';
import { CommentService } from './comment-service.interface.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { OfferService } from '../offer/offer-service.interface.js';
import { Types } from 'mongoose';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) { }

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create({
      ...dto,
      postDate: new Date()
    });

    this.logger.info(`New comment created for offer: ${dto.offerId}`);

    // Обновляем счетчик комментариев у предложения
    await this.offerService.incCommentCount(dto.offerId);

    // Пересчитываем рейтинг предложения
    await this.offerService.updateRating(dto.offerId);

    return comment.populate('authorId');
  }

  public async findByOfferId(offerId: string, limit = 50): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({ offerId: new Types.ObjectId(offerId) } as Record<string, unknown>)
      .sort({ postDate: -1 })
      .limit(limit)
      .populate('authorId')
      .exec() as unknown as DocumentType<CommentEntity>[];
  }
}
