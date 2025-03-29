import { render } from '../framework/render.js';
import { generateFilter } from '../utils/filter.js';
import { generateSort } from '../utils/sort.js';
import { updateItem } from '../utils/event.js';
import { SORTS, FILTERS, UserAction } from '../const.js';
import EventListView from '../view/event-list-view.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import EventPresenter from './event-presenter.js';
import NewEventPresenter from './new-event-presenter.js';

export default class EventsListPresenter {
  #eventsModel;
  #destinationsModel;
  #offersModel;
  #events = [];
  #destinations = [];
  #offers = [];
  #eventPresenters = new Map();
  #eventListComponent = new EventListView();
  #tripEventElement;
  #filtersElement;
  #newEventPresenter = null;
  #currentSortType = SORTS[0].type;
  #currentFilterType = FILTERS[0].type;

  constructor(eventsModel, destinationsModel, offersModel) {
    this.#eventsModel = eventsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#eventsModel.addObserver(this._handleModelUpdate);
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

    document.querySelector('.trip-main__event-add-btn').addEventListener('click', this.#handleNewEventClick);
  }

  _handleModelUpdate = (event) => {
    if (event === 'DELETE_EVENT') {
      this.#reRenderEventList();
    }
  };

  get filteredEvents() {
    return this.#events.filter((event) => this.#applyFilter(event, this.#currentFilterType));
  }

  #applyFilter(event, filterType) {
    const now = new Date();
    switch (filterType) {
      case 'future': return event.dateFrom > now;
      case 'present': return event.dateFrom <= now && event.dateTo >= now;
      case 'past': return event.dateTo < now;
      default: return true;
    }
  }

  #handleFilterChange = (filterType) => {
    this.#currentFilterType = filterType;
    this.#reRenderEventList();
  };

  #handleNewEventClick = () => {
    this.#currentFilterType = FILTERS[0].type;
    this.#currentSortType = SORTS[0].type;
    this.#reRenderEventList();

    if (!this.#newEventPresenter) {
      this.#newEventPresenter = new NewEventPresenter({
        eventsModel: this.#eventsModel,
        destinationsModel: this.#destinations,
        offersModel: this.#offers,
        onDataChange: this.#handleDataChange,
        onCloseForm: this.#closeNewEventForm,
      });
    }
    this.#newEventPresenter.init();
    document.addEventListener('keydown', this.#handleEscKeyDown);
    document.querySelector('.trip-main__event-add-btn').disabled = true;
  };

  #handleDataChange = (actionType, updateType, updatedEvent) => {
    if (actionType === UserAction.ADD_EVENT) {
      this.#eventsModel.addEvent(updateType, updatedEvent);
      this.#events.push(updatedEvent);
    } else if (actionType === UserAction.DELETE_EVENT) {
      this.#eventsModel.deleteEvent(updateType, updatedEvent);
      this.#events = this.#events.filter((event) => event.id !== updatedEvent.id);
    }
    this.#reRenderEventList();
  };

  #handleEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#closeNewEventForm();
    }
  };

  #closeNewEventForm = () => {
    this.#newEventPresenter?.destroy();
    this.#newEventPresenter = null;
    document.removeEventListener('keydown', this.#handleEscKeyDown);
    document.querySelector('.trip-main__event-add-btn').disabled = false;
    this.#reRenderEventList();
  };

  #renderFilters() {
    const filters = generateFilter(this.#events).map((filter) => ({
      ...filter,
      isDisabled: this.#events.every((event) => !this.#applyFilter(event, filter.type))
    }));

    render(new FiltersView({
      filters,
      currentFilterType: this.#currentFilterType,
      onFilterChange: this.#handleFilterChange
    }), this.#filtersElement);
  }

  #renderSort() {
    render(new SortView({
      sorts: generateSort(),
      onSortChange: this.#handleSortChange,
    }), this.#tripEventElement);
  }

  #renderEventList() {
    if (this.filteredEvents.length === 0) {
      document.querySelector(`#filter-${this.#currentFilterType}`).disabled = true;
      return;
    }
    render(this.#eventListComponent, this.#tripEventElement);
    this.filteredEvents.sort(this.#getSortFunction()).forEach((event) => this.#renderEvent(event));
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter(
      this.#tripEventElement.querySelector('.trip-events__list'),
      this.#reRenderEventList,
      this.#eventsModel
    );
    eventPresenter.init(event, this.#eventsModel, this.#destinations, this.#offers, this.#resetEventViews, this.#handleViewAction);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  _onDataChange = (updateType, userAction, event) => {
    if (userAction === UserAction.DELETE_EVENT) {
      this.#eventsModel.deleteEvent(updateType, event);
    }
  };

  #handleViewAction = (actionType, updateType, update) => {
    if (actionType === UserAction.UPDATE_EVENT) {
      this.#eventsModel.updateEvent(updateType, update);
      this.#events = updateItem(this.#events, update);
      this.#reRenderEventList();
    }
  };

  #handleSortChange = (sortType) => {
    if (this.#currentSortType !== sortType) {
      this.#currentSortType = sortType;
      this.#reRenderEventList();
    }
  };

  #getSortFunction() {
    return SORTS.find((sortItem) => sortItem.type === this.#currentSortType)?.sort || (() => 0);
  }

  #resetEventViews = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #clearEventList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
    this.#eventListComponent.clear();
  }


  #reRenderEventList() {
    this.#clearEventList();
    this.#renderEventList();
  }

  getEventPresenters() {
    return this.#eventPresenters || [];
  }
}
