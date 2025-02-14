import { DESTINATIONS, DESCRIPTIONS, PICTURE_URL } from '../const';
import { getRandomArrayElement, getRandomNumber } from '../utils';

const PICTURES_MAX_COUNT = 10;

function getMockPicture() {
  return {
    src: `${PICTURE_URL}${getRandomNumber(100)}`,
    description: getRandomArrayElement(DESCRIPTIONS)
  };
}

function getMockDestinations() {
  return DESTINATIONS.map((name, index) => ({
    id: `id-destination${index}`,
    description: getRandomArrayElement(DESCRIPTIONS),
    name,
    pictures: Array.from({ length: getRandomNumber(PICTURES_MAX_COUNT)}, getMockPicture)
  }));
}

export { getMockDestinations };
