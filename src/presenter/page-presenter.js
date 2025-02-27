import { render, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import NoEventView from '../view/no-event-view.js';
import { generateFilter } from '../utils/filters.js';

export default class PagePresenter {
  #eventsModel = null;
  #events = [];
  #destinations = [];

  #tripMainElement = null;
  #tripEventElement = null;
  #filtersElement = null;

  constructor(eventsModel) {
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#events = this.#eventsModel.events;
    this.#destinations = this.#eventsModel.destinations;

    this.#tripMainElement = document.querySelector('.trip-main');
    this.#tripEventElement = document.querySelector('.page-main .trip-events');
    this.#filtersElement = this.#tripMainElement.querySelector('.trip-controls__filters');

    this.#renderComponents();
  }

  #renderComponents() {
    render(new FiltersView({ filters: generateFilter(this.#events) }), this.#filtersElement);

    if (this.#events.length === 0) {
      render(new NoEventView(), this.#tripEventElement);
      return;
    }

    render(new TripInfoView({ events: this.#events, destinations: this.#destinations }), this.#tripMainElement, RenderPosition.AFTERBEGIN);
    render(new SortView(), this.#tripEventElement);
  }
}
