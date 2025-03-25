import AbstractView from '../framework/view/abstract-view';

// function createFilterItemTemplate(filter, currentFilterType) {
//   const { type, count } = filter;
//   // const isDisabled = count === 0 ? 'disabled' : '';
//   const isDisabled = count === 0 ? 'disabled' : '';

//   const isChecked = type === currentFilterType ? 'checked' : '';

//   return (
//     `<div class="trip-filters__filter">
//       <input id="filter-${type}" class="trip-filters__filter-input visually-hidden"
//         type="radio" name="trip-filter" value="${type}"
//         ${isChecked} ${isDisabled}>
//       <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
//     </div>`
//   );
// }


// function createFiltersTemplate(filterItems, currentFilterType) {
//   const filterItemsTemplate = filterItems
//     .map((filter) => createFilterItemTemplate(filter, currentFilterType))
//     .join('');

//   return (
//     `<form class="trip-filters" action="#" method="get">
//       ${filterItemsTemplate}
//       <button class="visually-hidden" type="submit">Accept filter</button>
//     </form>`
//   );
// }

// export default class FiltersView extends AbstractView {
//   #filters = null;
//   #currentFilterType = null;
//   #onFilterChange = null;

//   constructor({ filters, currentFilterType, onFilterChange }) {
//     super();
//     this.#filters = filters;
//     this.#currentFilterType = currentFilterType;
//     this.#onFilterChange = onFilterChange;

//     this.element.addEventListener('change', this.#onFilterChange);
//   }

//   get template() {
//     return createFiltersTemplate(this.#filters, this.#currentFilterType);
//   }
// }




function createFilterItemTemplate(filter, currentFilterType) {
  const { type, count, isDisabled } = filter;
  const isChecked = type === currentFilterType ? 'checked' : '';
  const disabledAttribute = isDisabled ? 'disabled' : ''; // Если нет событий, ставим атрибут disabled

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input visually-hidden"
        type="radio" name="trip-filter" value="${type}"
        ${isChecked} ${disabledAttribute}>
      <label class="trip-filters__filter-label" for="filter-${type}">${type} (${count})</label>
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

    this.element.addEventListener('change', this.#onFilterChange);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilterType);
  }

  #handleFilterChange = (evt) => {
    const selectedFilter = evt.target.value;  // Получаем значение выбранного фильтра
    this.#onFilterChange(selectedFilter);  // Вызываем переданный обработчик фильтрации
  }
}
