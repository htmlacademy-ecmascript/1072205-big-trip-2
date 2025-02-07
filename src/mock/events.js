import { EVENT_TYPES } from "../const.js";
import { getRandomArrayElement } from "../utils.js";

const mockEvents = [
  {
    day: new Date('2025-07-8'),
    type: getRandomArrayElement(EVENT_TYPES),
    destination: 'Barcelona',
    startTime: new Date('2025-07-8'),
    endTime: new Date('2025-08-9'),
    price: 200,
    offers: [
      {
        title: 'Rent a car',
        price: 20,
      },
    ],
    isFavourite: true,
  },
  {
    day: new Date('2025-09-30'),
    type: getRandomArrayElement(EVENT_TYPES),
    destination: 'Paris',
    startTime: new Date('2025-09-30'),
    endTime: new Date('2025-11-22'),
    price: 300,
    offers: [],
    isFavourite: false,
  },
  {
    day: new Date('2026-01-01'),
    type: getRandomArrayElement(EVENT_TYPES),
    destination: 'London',
    startTime: new Date('2026-01-01'),
    endTime: new Date('2026-03-15'),
    price: 400,
    offers: [
      {
        title: 'Rent a car',
        price: 20,
      },
      {
        title: 'Add breakfast',
        price: 5,
      },
      {
        title: 'Switch to comfort',
        price: 100,
      },
    ],
    isFavourite: false,
  },
  {
    day: new Date('2026-05-22'),
    type: getRandomArrayElement(EVENT_TYPES),
    destination: 'Rome',
    startTime: new Date('2026-05-22'),
    endTime: new Date('2026-06-14'),
    price: 5000,
    offers: [
      {
        title: 'Order Uber',
        price: 10,
      },
      {
        title: 'Add luggage',
        price: 2,
      },
    ],
    isFavourite: true,
  },
];

function geetRandomEvent() {
  return getRandomArrayElement(mockEvents);
}

export { geetRandomEvent };
