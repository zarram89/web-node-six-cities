import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import { generateRandomValue, getRandomItem, getRandomItems, getRandomBoolean } from '../../helpers/common.js';
import { MockServerData, City, HousingType, UserType } from '../../types/index.js';

const MIN_PRICE = 500;
const MAX_PRICE = 2000;
const MIN_RATING = 1;
const MAX_RATING = 5;
const MIN_ROOMS = 1;
const MAX_ROOMS = 8;
const MIN_GUESTS = 1;
const MAX_GUESTS = 10;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) { }

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const city = getRandomItem<string>(this.mockData.cities) as City;
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const photos = getRandomItems<string>(this.mockData.photos).join(';');
    const isPremium = getRandomBoolean();
    const isFavorite = getRandomBoolean();
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1);
    const type = getRandomItem([HousingType.Apartment, HousingType.House, HousingType.Room, HousingType.Hotel]);
    const rooms = generateRandomValue(MIN_ROOMS, MAX_ROOMS);
    const guests = generateRandomValue(MIN_GUESTS, MAX_GUESTS);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const amenities = getRandomItems<string>(this.mockData.amenities).join(';');

    const authorName = getRandomItem<string>(this.mockData.users);
    const authorEmail = getRandomItem<string>(this.mockData.emails);
    const authorAvatar = getRandomItem<string>(this.mockData.avatars);
    const authorType = getRandomBoolean() ? UserType.Pro : UserType.Standard;

    const commentCount = generateRandomValue(0, 20);

    // Координаты (упрощенно, случайные в пределах города)
    const latitude = generateRandomValue(48, 54, 6);
    const longitude = generateRandomValue(2, 10, 6);

    const createdDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    return [
      title, description, createdDate, city, previewImage, photos,
      isPremium, isFavorite, rating, type, rooms, guests, price, amenities,
      authorName, authorEmail, authorType, authorAvatar, commentCount,
      latitude, longitude
    ].join('\t');
  }
}
