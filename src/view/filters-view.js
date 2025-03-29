import AbstractView from '../framework/view/abstract-view';

function createFilterItemTemplate(filter, currentFilterType) {
  const { type, isDisabled } = filter;
  const isChecked = type === currentFilterType ? 'checked' : '';
  const disabledAttribute = isDisabled ? 'disabled' : '';

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input visually-hidden"
        type="radio" name="trip-filter" value="${type}"
        ${isChecked} ${disabledAttribute}>
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`
  );
}

function createFiltersTemplate(filterItems, currentFilterType) {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FiltersView extends AbstractView {
  #filters = null;
  #currentFilterType = null;
  #onFilterChange = null;

  constructor({ filters, currentFilterType, onFilterChange }) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#onFilterChange = onFilterChange;

    this.element.addEventListener('change', this.#handleFilterChange);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilterType);
  }

  setEventListeners() {
    this.element.querySelectorAll('.trip-filters__filter-input').forEach((input) => {
      input.addEventListener('change', (evt) => {
        const filterType = evt.target.dataset.filterType;
        this.#onFilterChange(filterType);
      });
    });
  }

  #handleFilterChange = (evt) => {
    const selectedFilter = evt.target.value;

    if (!selectedFilter || selectedFilter === this.#currentFilterType) {
      return;
    }

    this.#currentFilterType = selectedFilter;
    this.#onFilterChange(selectedFilter);
  };
}
