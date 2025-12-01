export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public city?: string;
  public previewImage?: string;
  public images?: string[];
  public isPremium?: boolean;
  public type?: string;
  public bedrooms?: number;
  public maxAdults?: number;
  public price?: number;
  public goods?: string[];
  public location?: {
    latitude: number;
    longitude: number;
  };
}
