import AbstractView from '../framework/view/abstract-view';

function createSortItemTemplate(sort) {
  const { type, isChecked } = sort;

  return (
    `<div class="trip-sort__item trip-sort__item--${type}">
      <input
        id="sort-${type}"
        class="trip-sort__input visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${type}"
        ${isChecked ? 'checked' : ''}
        data-sort-type="${type}"
        ${((type === 'event') || (type === 'offers')) ? 'disabled' : ''}>
      <label class="trip-sort__btn" for="sort-${type}" data-sort-type="${type}">${type}</label>
    </div>`
  );
}

function createSortTemplate(sortItems) {
  const sortItemsTemplate = sortItems.map((sort) => createSortItemTemplate(sort)).join('');

  return (
    `<form class="trip-events__trip-sort trip-sort" action="#" method="get">
      ${sortItemsTemplate}
    </form>`
  );
}

export default class SortView extends AbstractView {
  #sorts = null;
  #currentSortType = null;
  #onSortChange = null;

  constructor({ sorts, onSortChange }) {
    super();
    this.#sorts = sorts;
    this.#onSortChange = onSortChange;

    this.element.addEventListener('click', this.#handleSortClick);
  }

  get template() {
    return createSortTemplate(this.#sorts);
  }

  #handleSortClick = (evt) => {
    const sortType = evt.target.dataset.sortType;

    if (!sortType || sortType === this.#currentSortType || sortType === 'event' || sortType === 'offers') {
      return;
    }

    this.#currentSortType = sortType;
    this.#onSortChange(sortType);
  };
}
