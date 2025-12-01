import { defaultClasses, getModelForClass, prop, modelOptions, Ref } from '@typegoose/typegoose';
import { Offer, Amenity } from '../../types/offer.type.js';
import { OfferType } from '../../types/offer-type.enum.js';
import { UserEntity } from '../user/user.entity.js';
import { Location } from '../../types/location.type.js';
import { City } from '../../types/city.type.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true })
  public title!: string;

  @prop({ trim: true, required: true })
  public description!: string;

  @prop({ required: true })
  public postDate!: Date;

  @prop({ required: true })
  public city!: City;

  @prop({ required: true })
  public previewImage!: string;

  @prop({ required: true, type: () => [String] })
  public images!: string[];

  @prop({ required: true })
  public isPremium!: boolean;

  @prop({ required: true })
  public isFavorite!: boolean;

  @prop({ required: true })
  public rating!: number;

  @prop({ required: true, type: () => String, enum: OfferType })
  public type!: OfferType;

  @prop({ required: true })
  public bedrooms!: number;

  @prop({ required: true })
  public maxAdults!: number;

  @prop({ required: true })
  public price!: number;

  @prop({ required: true, type: () => [String] })
  public goods!: Amenity[];

  @prop({
    ref: UserEntity,
    required: true
  })
  public hostId!: Ref<UserEntity>;

  @prop({ default: 0 })
  public commentCount!: number;

  @prop({ type: () => [String], default: [] })
  public favorites!: string[];

  @prop({ required: true })
  public location!: Location;

  constructor(offerData: Offer) {
    super();

    this.title = offerData.title;
    this.description = offerData.description;
    this.postDate = offerData.postDate;
    this.city = offerData.city;
    this.previewImage = offerData.previewImage;
    this.images = offerData.images;
    this.isPremium = offerData.isPremium;
    this.isFavorite = offerData.isFavorite;
    this.rating = offerData.rating;
    this.type = offerData.type;
    this.bedrooms = offerData.bedrooms;
    this.maxAdults = offerData.maxAdults;
    this.price = offerData.price;
    this.goods = offerData.goods;
    this.location = offerData.location;
    this.commentCount = offerData.commentCount;
  }
}

export const OfferModel = getModelForClass(OfferEntity);
