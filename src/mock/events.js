import { EVENT_TYPES, DESTINATIONS, OFFERS } from '../const.js';
import { getRandomArrayElement, getRandomNumber, getRandomBoolean, getRandomDate } from '../utils/common.js';
import { getMockOffer } from './offers.js';

function getMockEvent() {
  return {
    id: `event${getRandomNumber(10) + 1}-id`,
    basePrice: getRandomNumber(1000),
    dateFrom: getRandomDate(new Date(2023, 6, 1), new Date(2025, 6, 1)),
    dateTo: getRandomDate(new Date(2025, 6, 1), new Date(2027, 6, 2)),
    destination: `id-destination${getRandomNumber(DESTINATIONS.length)}`,
    isFavorite: getRandomBoolean(),
    offers: Array.from({ length: getRandomNumber(OFFERS.length)}, getMockOffer),
    type: getRandomArrayElement(EVENT_TYPES)
  };
}

export { getMockEvent };
