import { SORTS } from '../const';

function generateSort() {
  return SORTS.map(({ type, sort, isChecked }) => ({
    type,
    sort,
    isChecked,
  }));
}

export { generateSort };
