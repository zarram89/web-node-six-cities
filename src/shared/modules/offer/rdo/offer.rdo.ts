import { Expose } from 'class-transformer';
import { City } from '../../../types/city.enum.js';
import { OfferType } from '../../../types/offer-type.enum.js';

export class OfferRdo {
    @Expose()
    public id!: string;

    @Expose()
    public title!: string;

    @Expose()
    public postDate!: string;

    @Expose()
    public city!: City;

    @Expose()
    public previewImage!: string;

    @Expose()
    public isPremium!: boolean;

    @Expose()
    public isFavorite!: boolean;

    @Expose()
    public rating!: number;

    @Expose()
    public type!: OfferType;

    @Expose()
    public price!: number;

    @Expose()
    public commentCount!: number;
}
