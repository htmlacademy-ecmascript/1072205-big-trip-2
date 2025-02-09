import { EVENT_TYPES } from "../const.js";
import { getRandomArrayElement } from "../utils.js";

const mockDestinations = [
  {
    id: 'id-destination1',
    description: 'description1',
    name: 'name1',
    pictures: [
      {
        src: 'picture1.jpg',
        description: 'picture1-description'
      },
      {
        src: 'picture2.jpg',
        description: 'picture2-description'
      }
    ]
  },
  {
    id: 'id-destination2',
    description: 'description2',
    name: 'name2',
    pictures: []
  },
  {
    id: 'id-destination3',
    description: 'description3',
    name: 'name3',
    pictures: [
      {
        src: 'picture3.jpg',
        description: 'picture3-description'
      },
      {
        src: 'picture4.jpg',
        description: 'picture4-description'
      },
      {
        src: 'picture5.jpg',
        description: 'picture5-description'
      }
    ]
  },
  {
    id: 'id-destination4',
    description: 'description4',
    name: 'name4',
    pictures: [
      {
        src: 'picture6.jpg',
        description: 'picture6-description'
      }
    ]
  },
]

const mockOffers = [
  {
    type: EVENT_TYPES[0],
    offers: [
      {
        id: 'offer1-id',
        title: 'Add luggage',
        price: 2,
      }
    ]
  },
  {
    type: EVENT_TYPES[1],
    offers: [],
  },
  {
    type: EVENT_TYPES[2],
    offers: [
      {
        id: 'offer2-id',
        title: 'Add breakfast',
        price: 5,
      },
      {
        id: 'offer1-id',
        title: 'Add luggage',
        price: 2,
      },
      {
        id: 'offer3-id',
        title: 'Switch to comfort',
        price: 100,
      }
    ]
  },
  {
    type: EVENT_TYPES[3],
    offers: [
      {
        id: 'offer3-id',
        title: 'Switch to comfort',
        price: 100,
      },
      {
        id: 'offer2-id',
        title: 'Add breakfast',
        price: 5,
      },
    ]
  },
  {
    type: EVENT_TYPES[4],
    offers: [
      {
        id: 'offer4-id',
        title: 'Order Uber',
        price: 10,
      }
    ]
  },
  {
    type: EVENT_TYPES[5],
    offers: []
  },
  {
    type: EVENT_TYPES[6],
    offers: [
      {
        id: 'offer1-id',
        title: 'Add luggage',
        price: 2,
      }
    ]
  },
  {
    type: EVENT_TYPES[7],
    offers: [
      {
        id: 'offer3-id',
        title: 'Switch to comfort',
        price: 100,
      },
      {
        id: 'offer2-id',
        title: 'Add breakfast',
        price: 5,
      },
    ]
  },
  {
    type: EVENT_TYPES[8],
    offers: [
      {
        id: 'offer4-id',
        title: 'Order Uber',
        price: 10,
      },
      {
        id: 'offer1-id',
        title: 'Add luggage',
        price: 2,
      },
      {
        id: 'offer5-id',
        title: 'Rent a car',
        price: 20,
      },
    ]
  },
]

const mockEvents = [
  {
    id: 'event1-id',
    base_price: 200,
    date_from: new Date('2025-07-8'),
    date_to: new Date('2025-08-9'),
    destination: mockDestinations[1],
    isFavourite: true,
    offers: mockOffers.find(offer => offer.type === getRandomArrayElement(EVENT_TYPES)),
    type: getRandomArrayElement(EVENT_TYPES),
  },
  {
    id: 'event2-id',
    base_price: 300,
    date_from: new Date('2025-09-30'),
    date_to: new Date('2025-11-22'),
    destination: mockDestinations[2],
    isFavourite: false,
    offers: mockOffers.find(offer => offer.type === getRandomArrayElement(EVENT_TYPES)),
    type: getRandomArrayElement(EVENT_TYPES),
  },
  {
    id: 'event3-id',
    base_price: 400,
    date_from: new Date('2026-01-01'),
    date_to: new Date('2026-03-15'),
    destination: mockDestinations[3],
    isFavourite: false,
    offers: mockOffers.find(offer => offer.type === getRandomArrayElement(EVENT_TYPES)),
    type: getRandomArrayElement(EVENT_TYPES),
  },
  {
    id: 'event4-id',
    base_price: 5000,
    date_from: new Date('2026-05-22'),
    date_to: new Date('2026-06-14'),
    destination: mockDestinations[4],
    isFavourite: true,
    offers: mockOffers.find(offer => offer.type === getRandomArrayElement(EVENT_TYPES)),
    type: getRandomArrayElement(EVENT_TYPES),
  },
];

function getRandomEvent() {
  return getRandomArrayElement(mockEvents);
}

export { getRandomEvent };
