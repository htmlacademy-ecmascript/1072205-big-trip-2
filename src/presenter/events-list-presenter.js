import { render } from '../framework/render.js';
import { generateFilter } from '../utils/filter.js';
import { generateSort } from '../utils/sort.js';
import { updateItem } from '../utils/event.js';
import { SORTS, UpdateType, UserAction } from '../const.js';
import EventListView from '../view/event-list-view.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import EventPresenter from './event-presenter.js';

export default class EventsListPresenter {
  #eventsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #events = [];
  #destinations = [];
  #offers = [];
  #eventPresenters = new Map();

  #eventListComponent = new EventListView();
  #tripEventElement = null;
  #filtersElement = null;
  #currentSortType = SORTS[0].type;

  constructor(eventsModel, destinationsModel, offersModel) {
    this.#eventsModel = eventsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  get events() {
    return [...this.#eventsModel.events].sort((a, b) => {
      switch (this.#currentSortType) {
        case SORTS[0].type: return new Date(a.dateFrom) - new Date(b.dateFrom);
        case SORTS[1].type: return new Date(b.dateFrom) - new Date(a.dateFrom);
        default: return 0;
      }
    });
  }

  getEventPresenters() {
    return this.#eventPresenters;
  }

  init() {
    this.#events = [...this.#eventsModel.events];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

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
    const sortView = new SortView({
      sorts: generateSort(),
      onSortChange: this.#handleSortChange,
    });
    render(sortView, this.#tripEventElement);
  }

  #renderEventList() {
    render(this.#eventListComponent, this.#tripEventElement);
    this.#events.forEach((event) => this.#renderEvent(event));
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter(
      this.#tripEventElement.querySelector('.trip-events__list')
    );
    eventPresenter.init(event, this.#destinations, this.#offers, this.#handleViewAction, this.#resetEventViews);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #handleViewAction = (actionType, updateType, update) => {
    if (actionType === UserAction.UPDATE_EVENT) {
      this.#eventsModel.updateEvent(updateType, update);
      this.#events = updateItem(this.#events, update);
      this.#clearEventList();
      this.#renderEventList();
    }
  };

  #handleSortChange = (sortType) => {
    if (this.#currentSortType !== sortType) {
      this.#currentSortType = sortType;
      this.#clearEventList();
      this.#renderEventList();
    }
  };

  #resetEventViews = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #clearEventList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
    this.#eventListComponent.clear();
  }
}
