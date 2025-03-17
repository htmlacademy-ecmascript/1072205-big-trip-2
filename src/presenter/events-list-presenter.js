import { render } from '../framework/render.js';
import { generateFilter } from '../utils/filter.js';
import { generateSort } from '../utils/sort.js';
import { updateItem } from '../utils/event.js';
import EventListView from '../view/event-list-view.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import EventPresenter from './event-presenter.js';

export default class EventsListPresenter {
  #eventsModel = null;
  #events = [];
  #destinations = [];
  #offers = [];
  #eventPresenters = new Map();

  #eventListComponent = new EventListView();

  #tripEventElement = null;
  #filtersElement = null;
  #currentSortType = 'day'; // Хранение текущего типа сортировки

  constructor(eventsModel) {
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#events = [...this.#eventsModel.events];
    this.#destinations = [...this.#eventsModel.destinations];
    this.#offers = [...this.#eventsModel.offers];

    this.#tripEventElement = document.querySelector('.page-main .trip-events');
    this.#filtersElement = document.querySelector('.trip-controls__filters');

    this.#renderFilters();
    this.#renderSort();
    this.#renderEventList();
  }


  #renderFilters() {
    render(new FiltersView({ filters: generateFilter(this.#events) }), this.#filtersElement);
  }

  #renderSort() {
    const sorts = generateSort();
    const sortView = new SortView({
      sorts,
      onSortChange: this.#handleSortChange.bind(this), // Привязываем контекст
    });
    render(sortView, this.#tripEventElement);
    sortView.setEventListeners();
  }

  #renderEventList() {
    render(this.#eventListComponent, this.#tripEventElement);
    this.#events.forEach((event) => {
      const eventPresenter = new EventPresenter(
        this.#tripEventElement.querySelector('.trip-events__list')
      );

      eventPresenter.init(event, this.#destinations, this.#offers, this.#onEventChange, this.#resetEventViews);
      this.#eventPresenters.set(event.id, eventPresenter);
    });
  }

  #handleSortChange = (sortType) => {
    // Сортировка в зависимости от типа
    switch (sortType) {
      case 'day':
        this.#events.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
        break;
      case 'event':
        this.#events.sort((a, b) => a.destination.localeCompare(b.destination));
        break;
      case 'time':
        this.#events.sort((a, b) =>
          (new Date(b.dateTo) - new Date(b.dateFrom)) - (new Date(a.dateTo) - new Date(a.dateFrom))
        );
        break;
      case 'price':
        this.#events.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'offers':
        this.#events.sort((a, b) => a.offers.length - b.offers.length);
        break;
      default:
        break;
    }

    // Очищаем текущий список
    this.#eventListComponent.clear();

    // Перерисовываем список с отсортированными событиями
    this.#renderEventList();
  };

  // Метод для обновления события
  #onEventChange = (updatedEvent) => {
    this.#events = updateItem(this.#events, updatedEvent);
    this.#eventPresenters.get(updatedEvent.id)?.update(updatedEvent);
  };

  // Метод для закрытия всех открытых форм
  #resetEventViews = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  getEventPresenters() {
    return this.#eventPresenters;
  }
}
