import { render, RenderPosition } from '../framework/render.js';
import { generateFilter } from '../utils/filters.js';
import TripInfoView from '../view/trip-info-view.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import NoEventView from '../view/no-event-view.js';
import EventListView from '../view/event-list-view.js';
import EventPresenter from './event-presenter.js';

export default class PagePresenter {
  #eventsModel = null;
  #events = [];
  #destinations = [];
  #offers = [];

  #eventComponent = new EventPresenter();
  #eventListComponent = new EventListView();

  #tripMainElement = null;
  #tripEventElement = null;
  #filtersElement = null;

  constructor(eventsModel) {
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#events = [...this.#eventsModel.events];
    this.#destinations = [...this.#eventsModel.destinations];
    this.#offers = [...this.#eventsModel.offers];

    this.#tripMainElement = document.querySelector('.trip-main');
    this.#tripEventElement = document.querySelector('.page-main .trip-events');
    this.#filtersElement = this.#tripMainElement.querySelector('.trip-controls__filters');

    this.#renderFilters();
    if (this.#events.length === 0) {
      this.#renderNoEvent();
    } else {
      this.#renderTripInfo();
      this.#renderSort();
      this.#renderEventList();
    }
  }

  #renderFilters() {
    render(new FiltersView({ filters: generateFilter(this.#events) }), this.#filtersElement);
  }

  #renderNoEvent() {
    if (this.#events.length === 0) {
      render(new NoEventView(), this.#tripEventElement);
    }
  }

  #renderTripInfo() {
    render(new TripInfoView({ events: this.#events, destinations: this.#destinations }), this.#tripMainElement, RenderPosition.AFTERBEGIN);
  }

  #renderSort() {
    render(new SortView(), this.#tripEventElement);
  }

  #renderEventList() {
    render(this.#eventListComponent, this.#tripEventElement);
    this.#events.forEach((event) => this.#eventComponent.renderEvent(event, this.#destinations, this.#offers));
  }
}
