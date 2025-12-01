import { User } from './user.type.js';
import { City } from './city.type.js';
import { OfferType } from './offer-type.enum.js';
import { Location } from './location.type.js';

export type Amenity = 'Breakfast' | 'Air conditioning' | 'Laptop friendly workspace' | 'Baby seat' | 'Washer' | 'Towels' | 'Fridge';

export interface Offer {
    title: string;
    description: string;
    postDate: Date;
    city: City;
    previewImage: string;
    images: string[];
    isPremium: boolean;
    isFavorite: boolean;
    rating: number;
    type: OfferType;
    bedrooms: number;
    maxAdults: number;
    price: number;
    goods: Amenity[];
    author: User;
    commentCount: number;
    location: Location;
}
