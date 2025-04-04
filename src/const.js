const EVENT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];

const NoEventMessages = {
  everything: 'Click New Event to create your first point',
  past: 'There are no past events now',
  present: 'There are no present events now',
  future: 'There are no future events now',
};

const FILTERS = [
  {
    type: 'everything',
    filter: (events) => events.filter((event) => event),
    isChecked: true,
  },
  {
    type: 'future',
    filter: (events) => events.filter((event) => event.dateTo > new Date()),
    isChecked: false,
  },
  {
    type: 'present',
    filter: (events) => events.filter((event) => event.dateTo > new Date() && event.dateFrom < new Date()),
    isChecked: false,
  },
  {
    type: 'past',
    filter: (events) => events.filter((event) => event.dateFrom < new Date()),
    isChecked: false,
  },
];

const SORTS = [
  {
    type: 'day',
    sort: (a, b) => a.dateFrom - b.dateFrom,
    isChecked: true,
  },
  {
    type: 'event',
    sort: (events) => events.sort((event1, event2) => event1.destination.localeCompare(event2.destination)),
    isChecked: false,
  },
  {
    type: 'time',
    sort: (a, b) => (b.dateTo - b.dateFrom) - (a.dateTo - a.dateFrom),
    isChecked: false,
  },
  {
    type: 'price',
    sort: (a, b) => b.basePrice - a.basePrice,
    isChecked: false,
  },
  {
    type: 'offers',
    sort: (events) => events.sort((event1, event2) => event2.offers.length - event1.offers.length),
    isChecked: false,
  },
];

const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export { EVENT_TYPES, NoEventMessages, FILTERS, SORTS, UserAction, UpdateType };
