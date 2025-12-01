import { IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsMongoId, IsNumber, IsObject, IsString, Max, MaxLength, Min, MinLength, ArrayMinSize, ArrayMaxSize, IsIn } from 'class-validator';
import { OfferType } from '../../types/offer-type.enum.js';
import { City } from '../../types/city.type.js';
import { Location } from '../../types/location.type.js';
import { Amenity } from '../../types/offer.type.js';

const VALID_AMENITIES = ['Breakfast', 'Air conditioning', 'Laptop friendly workspace', 'Baby seat', 'Washer', 'Towels', 'Fridge'] as const;

export class CreateOfferDto {
  @IsString({ message: 'title is required' })
  @MinLength(10, { message: 'Min length for title is 10' })
  @MaxLength(100, { message: 'Max length for title is 100' })
  public title!: string;

  @IsString({ message: 'description is required' })
  @MinLength(20, { message: 'Min length for description is 20' })
  @MaxLength(1024, { message: 'Max length for description is 1024' })
  public description!: string;

  @IsDateString({}, { message: 'postDate must be valid ISO date' })
  public postDate!: Date;

  @IsEnum(City, { message: 'city must be one of valid cities' })
  public city!: City;

  @IsString({ message: 'previewImage is required' })
  public previewImage!: string;

  @IsArray({ message: 'images must be an array' })
  @IsString({ each: true, message: 'each image must be string' })
  @ArrayMinSize(6, { message: 'images must contain exactly 6 images' })
  @ArrayMaxSize(6, { message: 'images must contain exactly 6 images' })
  public images!: string[];

  @IsBoolean({ message: 'isPremium must be boolean' })
  public isPremium!: boolean;

  @IsBoolean({ message: 'isFavorite must be boolean' })
  public isFavorite!: boolean;

  @IsNumber({}, { message: 'rating must be a number' })
  @Min(1, { message: 'Min rating is 1' })
  @Max(5, { message: 'Max rating is 5' })
  public rating!: number;

  @IsEnum(OfferType, { message: 'type must be a valid offer type' })
  public type!: OfferType;

  @IsInt({ message: 'bedrooms must be an integer' })
  @Min(1, { message: 'Min bedrooms is 1' })
  @Max(8, { message: 'Max bedrooms is 8' })
  public bedrooms!: number;

  @IsInt({ message: 'maxAdults must be an integer' })
  @Min(1, { message: 'Min maxAdults is 1' })
  @Max(10, { message: 'Max maxAdults is 10' })
  public maxAdults!: number;

  @IsInt({ message: 'price must be an integer' })
  @Min(100, { message: 'Min price is 100' })
  @Max(100000, { message: 'Max price is 100000' })
  public price!: number;

  @IsArray({ message: 'goods must be an array' })
  @IsIn(VALID_AMENITIES, { each: true, message: 'each amenity must be valid' })
  public goods!: Amenity[];

  @IsMongoId({ message: 'hostId must be valid MongoDB ID' })
  public hostId!: string;

  @IsObject({ message: 'location must be an object' })
  public location!: Location;
}
