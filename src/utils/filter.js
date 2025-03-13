import { FILTERS } from '../const';

function generateFilter(events) {
  return FILTERS.map(({ type, filter, isChecked }) => ({
    type,
    count: filter(events).length,
    isChecked,
  }));
}

export { generateFilter };
