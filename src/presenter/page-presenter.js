import { render, RenderPosition } from '../framework/render.js';
import { generateFilter } from '../utils/filters.js';
import { updateItem } from '../utils/common.js';
import EventListView from '../view/event-list-view.js';
import FiltersView from '../view/filters-view.js';
import NoEventView from '../view/no-event-view.js';
import SortView from '../view/sort-view.js';
import TripInfoView from '../view/trip-info-view.js';
import EventPresenter from './event-presenter.js';

export default class PagePresenter {
  #eventsModel = null;
  #events = [];
  #destinations = [];
  #offers = [];
  #eventPresenters = new Map();

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
      return;
    }

    this.#renderTripInfo();
    this.#renderSort();
    this.#renderEventList();
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
    this.#events.forEach((event) => {
      const eventPresenter = new EventPresenter(this.#tripEventElement.querySelector('.trip-events__list'));
      eventPresenter.init(event, this.#destinations, this.#offers, this.#onEventChange, this.#resetEventViews);
      this.#eventPresenters.set(event.id, eventPresenter);
    });
  }

  #onEventChange = (updatedEvent) => {
    this.#events = updateItem(this.#events, updatedEvent);
    this.#eventPresenters.get(updatedEvent.id).update(updatedEvent);
  };

  updateEvent(updatedEvent) {
    this.#events = this.#events.map((event) => event.id === updatedEvent.id ? updatedEvent : event);
    this.#eventPresenters.get(updatedEvent.id).update(updatedEvent);
  }

  #resetEventViews = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };
}
