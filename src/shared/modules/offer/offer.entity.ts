import { defaultClasses, getModelForClass, prop, modelOptions, Ref } from '@typegoose/typegoose';
import { Offer, Amenity } from '../../types/offer.type.js';
import { OfferType } from '../../types/offer-type.enum.js';
import { UserEntity } from '../user/user.entity.js';
import { Location } from '../../types/location.type.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base { }

export class CityEntity {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public location!: Location;
}

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

  @prop({ required: true, type: () => CityEntity, _id: false })
  public city!: CityEntity;

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

  constructor(offerData: Partial<Offer>) {
    super();

    if (offerData.title) {
      this.title = offerData.title;
    }
    if (offerData.description) {
      this.description = offerData.description;
    }
    if (offerData.postDate) {
      this.postDate = offerData.postDate;
    }
    if (offerData.previewImage) {
      this.previewImage = offerData.previewImage;
    }
    if (offerData.images) {
      this.images = offerData.images;
    }
    if (offerData.isPremium !== undefined) {
      this.isPremium = offerData.isPremium;
    }
    if (offerData.isFavorite !== undefined) {
      this.isFavorite = offerData.isFavorite;
    }
    if (offerData.rating !== undefined) {
      this.rating = offerData.rating;
    }
    if (offerData.type) {
      this.type = offerData.type;
    }
    if (offerData.bedrooms !== undefined) {
      this.bedrooms = offerData.bedrooms;
    }
    if (offerData.maxAdults !== undefined) {
      this.maxAdults = offerData.maxAdults;
    }
    if (offerData.price !== undefined) {
      this.price = offerData.price;
    }
    if (offerData.goods) {
      this.goods = offerData.goods;
    }
    if (offerData.location) {
      this.location = offerData.location;
    }
    if (offerData.commentCount !== undefined) {
      this.commentCount = offerData.commentCount;
    }
  }
}

export const OfferModel = getModelForClass(OfferEntity);
