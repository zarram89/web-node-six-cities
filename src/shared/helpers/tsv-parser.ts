import { Offer, City, HousingType, Amenity, UserType } from '../types/index.js';

export class TSVParser {
  /**
     * Парсит строку TSV в объект Offer
     * @param line - строка из TSV файла
     * @param delimiter - разделитель полей (по умолчанию табуляция)
     * @returns объект Offer или null при ошибке
     */
  public static parseOffer(line: string, delimiter = '\t'): Offer | null {
    const fields = line.split(delimiter);

    if (fields.length < 21) {
      console.error(`Invalid TSV line: expected 21 fields, got ${fields.length}`);
      return null;
    }

    try {
      const [
        title,
        description,
        publishDate,
        city,
        previewImage,
        photos,
        isPremium,
        isFavorite,
        rating,
        type,
        rooms,
        guests,
        price,
        amenities,
        authorName,
        authorEmail,
        authorType,
        authorAvatar,
        commentCount,
        latitude,
        longitude
      ] = fields;

      return {
        title,
        description,
        publishDate: new Date(publishDate),
        city: city as City,
        previewImage,
        photos: photos.split(';'),
        isPremium: isPremium === 'true',
        isFavorite: isFavorite === 'true',
        rating: parseFloat(rating),
        type: type as HousingType,
        rooms: parseInt(rooms, 10),
        guests: parseInt(guests, 10),
        price: parseInt(price, 10),
        amenities: amenities.split(';') as Amenity[],
        author: {
          name: authorName,
          email: authorEmail,
          type: authorType as UserType,
          avatarUrl: authorAvatar || undefined,
          password: '' // пароль не хранится в TSV
        },
        commentCount: parseInt(commentCount, 10),
        coordinates: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        }
      };
    } catch (error) {
      console.error('Error parsing TSV line:', error);
      return null;
    }
  }
}
