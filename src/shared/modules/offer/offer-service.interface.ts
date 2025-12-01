import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto } from './create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { UpdateOfferDto } from './update-offer.dto.js';

export interface OfferService {
    create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
    find(limit?: number): Promise<DocumentType<OfferEntity>[]>;
    findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
    updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
    deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
    findPremiumByCity(city: string, limit?: number): Promise<DocumentType<OfferEntity>[]>;
    findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>;
    addToFavorites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null>;
    removeFromFavorites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null>;
    incCommentCount(offerId: string): Promise<void>;
    updateRating(offerId: string): Promise<void>;
    exists(offerId: string): Promise<boolean>;
}
