import { Expose, Type } from 'class-transformer';
import { OfferType } from '../../../types/offer-type.enum.js';
import { UserRdo } from '../../user/rdo/user.rdo.js';
import { Location } from '../../../types/location.type.js';
import { CityRdo } from './city.rdo.js';

export class OfferDetailRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public postDate!: string;

  @Expose()
  @Type(() => CityRdo)
  public city!: CityRdo;

  @Expose()
  public previewImage!: string;

  @Expose()
  public images!: string[];

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public type!: OfferType;

  @Expose()
  public bedrooms!: number;

  @Expose()
  public maxAdults!: number;

  @Expose()
  public price!: number;

  @Expose()
  public goods!: string[];

  @Expose({ name: 'hostId' })
  @Type(() => UserRdo)
  public host!: UserRdo;

  @Expose()
  public commentCount!: number;

  @Expose()
  public location!: Location;
}
