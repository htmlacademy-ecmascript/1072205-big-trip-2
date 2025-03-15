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
    render(new SortView({ sorts: generateSort() }), this.#tripEventElement);
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

