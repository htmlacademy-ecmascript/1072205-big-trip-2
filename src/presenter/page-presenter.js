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
    this.#renderSort();
    this.#renderEventList();
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
    render(
      new TripInfoView(
        this.#events,
        this.#destinations,
        this.#offers,
      ),
      this.#tripMainElement,
      RenderPosition.AFTERBEGIN
    );
  }

  #renderFilters() {
    const filters = FILTERS.map((filter) => ({
      ...filter,
      isDisabled: this.#events.every((event) => !this.#applyFilter(event, filter.type)),
    }));

    render(new FiltersView({
      filters,
      currentFilterType: this.#currentFilterType,
      onFilterChange: this.#handleFilterChange,
    }), document.querySelector('.trip-controls__filters'));
  }

  #applyFilter(filterType) {
    const now = new Date();
    return this.#events.filter((event) => {
      return {
        future: event.dateFrom > now,
        present: event.dateFrom <= now && event.dateTo >= now,
        past: event.dateTo < now,
      }[filterType] ?? true;
    });
  }

  #handleFilterChange = (filterType) => {
    this.#currentFilterType = filterType;
    this.#clearEventList();
    this.#renderEventList();
  };

  // #renderSort() {
  //   const sortView = new SortView({
  //     sorts: generateSort(),
  //     onSortChange: this.#handleSortChange,
  //   });

  #renderSort() {
    render(new SortView({
      sorts: SORTS,
      currentSortType: this.#currentSortType,
      onSortChange: this.#handleSortChange,
    }), this.#tripEventElement, RenderPosition.AFTERBEGIN);
  }

  #applySort(events, sortType) {
    const sortFunction = SORTS.find((sortItem) => sortItem.type === sortType)?.sort || (() => 0);
    return events.sort(sortFunction);
  }

  #handleSortChange = (sortType) => {
    if (this.#currentSortType !== sortType) {
      this.#currentSortType = sortType;
      this.#clearEventList();
      this.#renderEventList();
    }
  }

  #getFilteredAndSortedEvents() {
    const filteredEvents = this.#applyFilter(this.#events, this.#currentFilterType);
    return this.#applySort(filteredEvents, this.#currentSortType);
  }

  #renderEventList() {
    this.#eventListPresenter = new EventsListPresenter(
      this.eventsModel,
      this.destinationsModel,
      this.offersModel
    );
    const filteredAndSortedEvents = this.#getFilteredAndSortedEvents();
    this.#eventListPresenter.init(filteredAndSortedEvents);
  }

  #clearEventList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
    // this.#eventListComponent.clear();
  }
}
