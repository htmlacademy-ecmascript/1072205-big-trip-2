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
        ${((type === 'event') || (type === 'offers')) && 'disabled'}>
      <label class="trip-sort__btn" for="sort-${type}" data-sort-type="${type}">${type}</label>
    </div>`
  );
}

function createSortTemplate(sortItems, onSortChange) {
  const sortItemsTemplate = sortItems.map((sort) => createSortItemTemplate(sort, onSortChange)).join('');

  return (
    `<form class="trip-events__trip-sort trip-sort" action="#" method="get">
      ${sortItemsTemplate}
    </form>`
  );
}

export default class SortView extends AbstractView {
  #sorts = null;
  #onSortChange = null;

  constructor({ sorts, onSortChange }) {
    super();
    this.#sorts = sorts;
    this.#onSortChange = onSortChange;
  }

  get template() {
    return createSortTemplate(this.#sorts, this.#onSortChange);
  }

  setEventListeners() {
    this.element.querySelectorAll('.trip-sort__input').forEach((input) => {
      input.addEventListener('change', (evt) => {
        const sortType = evt.target.dataset.sortType;
        this.#onSortChange(sortType); // вызываем переданный callback
      });
    });
  }
}
