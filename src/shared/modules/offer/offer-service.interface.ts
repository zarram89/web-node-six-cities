import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto } from './create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';

export interface OfferService {
    create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
    find(): Promise<DocumentType<OfferEntity>[]>;
}
