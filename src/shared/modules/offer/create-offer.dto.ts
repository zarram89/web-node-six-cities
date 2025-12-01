import { OfferType } from '../../types/offer-type.enum.js';
import { City } from '../../types/city.type.js';
import { Location } from '../../types/location.type.js';
import { Amenity } from '../../types/offer.type.js';

export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public postDate!: Date;
  public city!: City;
  public previewImage!: string;
  public images!: string[];
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public rating!: number;
  public type!: OfferType;
  public bedrooms!: number;
  public maxAdults!: number;
  public price!: number;
  public goods!: Amenity[];
  public hostId!: string;
  public location!: Location;
}
