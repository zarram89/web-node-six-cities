import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './create-offer.dto.js';
import { UpdateOfferDto } from './update-offer.dto.js';
import { Types } from 'mongoose';
import { CommentModel } from '../comment/comment.entity.js';

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

  public async find(userId?: string, limit = 60): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.offerModel
      .find()
      .limit(limit)
      .populate('hostId')
      .exec();

    return offers.map((offer) => {
      offer.isFavorite = userId ? offer.favorites.includes(userId) : false;
      return offer;
    });
  }

  public async findById(offerId: string, userId?: string): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel
      .findById(offerId)
      .populate('hostId')
      .exec();

    if (!offer) {
      return null;
    }

    offer.isFavorite = userId ? offer.favorites.includes(userId) : false;
    return offer;
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate('hostId')
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async findPremiumByCity(city: string, limit = 3): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ 'city.name': city, isPremium: true })
      .sort({ postDate: -1 })
      .limit(limit)
      .populate('hostId')
      .exec();
  }

  public async findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ favorites: userId })
      .populate('hostId')
      .exec();
  }

  public async addToFavorites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(
        offerId,
        { $addToSet: { favorites: userId } },
        { new: true }
      )
      .populate('hostId')
      .exec();
  }

  public async removeFromFavorites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(
        offerId,
        { $pull: { favorites: userId } },
        { new: true }
      )
      .populate('hostId')
      .exec();
  }

  public async incCommentCount(offerId: string): Promise<void> {
    await this.offerModel
      .findByIdAndUpdate(offerId, { $inc: { commentCount: 1 } })
      .exec();
  }

  public async updateRating(offerId: string): Promise<void> {
    const result = await CommentModel.aggregate([
      { $match: { offerId: new Types.ObjectId(offerId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' }
        }
      }
    ]) as Array<{ avgRating: number }>;

    const newRating = result[0]?.avgRating || 0;

    await this.offerModel
      .findByIdAndUpdate(
        offerId,
        { rating: Math.round(newRating * 10) / 10 }
      )
      .exec();

    this.logger.info(`Updated rating for offer ${offerId}: ${newRating}`);
  }

  public async exists(offerId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: offerId })) !== null;
  }
}
