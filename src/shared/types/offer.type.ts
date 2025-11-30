import { User } from './user.type.js';

export enum City {
    Paris = 'Paris',
    Cologne = 'Cologne',
    Brussels = 'Brussels',
    Amsterdam = 'Amsterdam',
    Hamburg = 'Hamburg',
    Dusseldorf = 'Dusseldorf'
}

export enum HousingType {
    Apartment = 'apartment',
    House = 'house',
    Room = 'room',
    Hotel = 'hotel'
}

export enum Amenity {
    Breakfast = 'Breakfast',
    AirConditioning = 'Air conditioning',
    LaptopFriendlyWorkspace = 'Laptop friendly workspace',
    BabySeat = 'Baby seat',
    Washer = 'Washer',
    Towels = 'Towels',
    Fridge = 'Fridge'
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface Offer {
    title: string;
    description: string;
    publishDate: Date;
    city: City;
    previewImage: string;
    photos: string[];
    isPremium: boolean;
    isFavorite: boolean;
    rating: number;
    type: HousingType;
    rooms: number;
    guests: number;
    price: number;
    amenities: Amenity[];
    author: User;
    commentCount: number;
    coordinates: Coordinates;
}
