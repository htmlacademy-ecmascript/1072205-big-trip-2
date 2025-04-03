import { render, RenderPosition } from '../framework/render.js';
import { FILTERS, SORTS } from '../const.js';
import TripInfoView from '../view/trip-info-view.js';
import NoEventView from '../view/no-event-view.js';
import EventsListPresenter from './events-list-presenter.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';

export default class PagePresenter {
  #events = [];
  #destinations = [];
  #offers = [];
  #eventPresenters = new Map();
  #tripInfoComponent = null;
  #tripMainElement = null;
  #eventListPresenter = null;
  #tripEventElement = null;

  #currentFilterType = FILTERS[0].type;
  #currentSortType = SORTS[0].type;

  constructor(eventsModel, destinationsModel, offersModel) {
    this.eventsModel = eventsModel;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;

    this.#tripMainElement = document.querySelector('.trip-main');
    this.#tripEventElement = document.querySelector('.trip-events');

    this.eventsModel.addObserver(this.#handleModelUpdate);
  }

  init() {
    this.#updateData();

    if (!this.#isDataLoaded()) {
      return;
    }

    if (this.#events.length === 0) {
      this.#renderNoEvent();
      return;
    }

    this.#renderTripInfo();
    this.#renderFilters();
    this.#renderEventList();
    this.#renderSort();
  }

  updateEvent(updatedEvent) {
    this.eventsModel.updateEvent(updatedEvent);
  }

  #handleModelUpdate = () => {
    this.#updateData();

    if (!this.#isDataLoaded()) {
      return;
    }

    if (this.#events.length === 0) {
      this.#tripEventElement.innerHTML = '';
      this.#renderNoEvent();
    } else {
      this.#renderTripInfo();
      this.#renderEventList();
    }
  };

  #updateData() {
    this.#events = [...this.eventsModel.events];
    this.#destinations = [...this.destinationsModel.destinations];
    this.#offers = [...this.offersModel.offers];
  }

  #isDataLoaded() {
    return this.#events.length > 0 && this.#destinations.length > 0 && this.#offers.length > 0;
  }

  #renderNoEvent() {
    render(new NoEventView(), this.#tripEventElement);
  }

  #renderTripInfo() {
    if (this.#tripInfoComponent) {
      this.#tripInfoComponent.element.remove();
      this.#tripInfoComponent = null;
    }

    this.#tripInfoComponent = new TripInfoView(this.#events, this.#destinations, this.#offers);
    render(this.#tripInfoComponent, this.#tripMainElement, RenderPosition.AFTERBEGIN);
  }

  #renderFilters() {
    const filters = FILTERS.map((filter) => ({
      ...filter,
      isDisabled: this.#applyFilter(this.#events, filter.type).length === 0,
    }));

    render(new FiltersView({
      filters,
      currentFilterType: this.#currentFilterType,
      onFilterChange: this.#handleFilterChange,
    }), document.querySelector('.trip-controls__filters'));
  }

  #applyFilter(events, filterType) {
    if (!Array.isArray(events)) return [];

    const now = new Date();
    return events.filter((event) => {
      return {
        future: event.dateFrom > now,
        present: event.dateFrom <= now && event.dateTo >= now,
        past: event.dateTo < now,
      }[filterType] ?? true;
    });
  }

  #handleFilterChange = (filterType) => {
    this.#currentFilterType = filterType;
    this.#updateData();
    this.#clearEventList();
    this.#renderEventList();
    this.#renderSort();
  };

  #renderSort() {
    render(new SortView({
      sorts: SORTS,
      currentSortType: this.#currentSortType,
      onSortChange: this.#handleSortChange,
    }), this.#tripEventElement, RenderPosition.AFTERBEGIN);
  }

  #applySort(events, sortType) {
    if (sortType === 'price') {
      return [...events].sort((a, b) => b.basePrice - a.basePrice);
    }
    if (sortType === 'time') {
      return [...events].sort((a, b) => (b.dateTo - b.dateFrom) - (a.dateTo - a.dateFrom));
    }
    return [...events];
  }

  #handleSortChange = (sortType) => {
    this.#currentSortType = sortType;
    this.#updateData();
    this.#clearEventList();
    this.#renderEventList();
    this.#renderSort();
  };

  #getFilteredAndSortedEvents() {
    const filteredEvents = this.#events.filter((event) => this.#applyFilter(event, this.#currentFilterType));
    const sortedEvents = this.#applySort(filteredEvents, this.#currentSortType);
    return sortedEvents;
  }

  #renderEventList() {
    this.#eventListPresenter = new EventsListPresenter(
      this.eventsModel,
      this.destinationsModel,
      this.offersModel,
      this.#handleViewAction,
    );

    const filteredAndSortedEvents = this.#getFilteredAndSortedEvents();
    this.#eventListPresenter.init(filteredAndSortedEvents);
  }

  #clearEventList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  #handleViewAction = (update) => {
    this.updateEvent(update);
  };
}
