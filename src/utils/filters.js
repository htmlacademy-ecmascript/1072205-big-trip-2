import { FilterType } from '../const';

const filter = {
  [FilterType.EVERYTHING]: (events) => events.filter((event) => event),
  [FilterType.PAST]: (events) => events.filter((event) => event.dateTo < new Date()),
  [FilterType.PRESENT]: (events) => events.filter(
    (event) => event.dateTo > new Date() && event.dateFrom < new Date()
  ),
  [FilterType.FUTURE]: (events) => events.filter((event) => event.dateFrom > new Date()),
};

function generateFilter(events) {
  return Object.entries(filter).map(([filterType, filterEvents]) => ({
    type: filterType,
    count: filterEvents(events).length,
  }));
}

export { generateFilter };
