import { EVENT_TYPES, OFFERS } from '../const.js';
import { getRandomNumber } from '../utils/common.js';

function getMockOffer() {
  const randomIndex = getRandomNumber(OFFERS.length);

  return {
    id: `offer${randomIndex}-id`,
    title: OFFERS[randomIndex],
    price: getRandomNumber(100)
  };
}

function getMockTypeOffers() {
  return EVENT_TYPES.map((type) => ({
    type,
    offers: Array.from({ length: getRandomNumber(OFFERS.length)}, getMockOffer)
  }));
}

export { getMockTypeOffers, getMockOffer };
