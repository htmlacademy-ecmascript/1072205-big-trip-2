import { FILTERS } from '../const';

function generateFilter(events) {
  return FILTERS.map(({ type, filter }) => {
    const filteredEvents = filter(events);

    return {
      type,
      filter,
      count: filteredEvents.length,
      isDisabled: filteredEvents.length === 0,
      isChecked: false,
    };
  });
}

export { generateFilter };

