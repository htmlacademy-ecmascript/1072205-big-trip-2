const EVENT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
const DESTINATIONS = ['London', 'Manchester', 'Edinburgh', 'Birmingham', 'Liverpool', 'Paris', 'Tokyo', 'New York', 'Berlin'];

const OFFERS = [
  'Add luggage',
  'Switch to comfort class',
  'Add meal',
  'Choose seats',
  'Travel by train',
  'Order Uber',
  'Rent a car',
  'Add breakfast',
  'Book tickets',
  'Lunch in city'];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

const PICTURE_URL = 'https://loremflickr.com/248/152?random=';

const FILTERS = [
  {
    type: 'everything',
    filter: (events) => events.filter((event) => event),
    isChecked: true,
  },
  {
    type: 'future',
    filter: (events) => events.filter((event) => event.dateTo < new Date()),
    isChecked: false,
  },
  {
    type: 'present',
    filter: (events) => events.filter((event) => event.dateTo > new Date() && event.dateFrom < new Date()),
    isChecked: false,
  },
  {
    type: 'past',
    filter: (events) => events.filter((event) => event.dateFrom > new Date()),
    isChecked: false,
  },
];

const SORTS = [
  {
    type: 'day',
    sort: (events) => events.sort((event1, event2) => event1.dateFrom - event2.dateFrom),
    isChecked: true,
  },
  {
    type: 'event',
    sort: (events) => events.sort((event1, event2) => event1.destination.localeCompare(event2.destination)),
    isChecked: false,
  },
  {
    type: 'time',
    sort: (events) => events.sort((event1, event2) => (event2.dateTo - event2.dateFrom) - (event1.dateTo - event1.dateFrom)),
    isChecked: false,
  },
  {
    type: 'price',
    sort: (events) => events.sort((event1, event2) => event2.price - event1.price),
    isChecked: false,
  },
  {
    type: 'offers',
    sort: (events) => events.sort((event1, event2) => event2.offers.length - event1.offers.length),
    isChecked: false,
  },
];


export { EVENT_TYPES, OFFERS, DESTINATIONS, DESCRIPTIONS, PICTURE_URL, FILTERS, SORTS };
