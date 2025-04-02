import { render, RenderPosition } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import EventPresenter from './event-presenter.js';
import NewEventPresenter from './new-event-presenter.js';
// import { generateFilter } from '../utils/filter.js';
// import { generateSort } from '../utils/sort.js';
 import { SORTS, FILTERS, UserAction } from '../const.js';

export default class EventsListPresenter {
  #events = [];
  #destinationsModel;
  #offersModel;
  #eventPresenters = new Map();
  #eventListComponent = new EventListView();
  #tripEventElement;
  #filtersElement;
  #newEventPresenter = null;
   #currentFilterType = FILTERS[0].type;
  // #currentSortType = SORTS[0].type;
  // #onDataChange;

  constructor(eventsModel, destinationsModel, offersModel) {
    this.eventsModel = eventsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init(events) {
    this.#events = [...events];
    this.#tripEventElement = document.querySelector('.page-main .trip-events');
    this.#filtersElement = document.querySelector('.trip-controls__filters');
    this.#renderEventList();

    document.querySelector('.trip-main__event-add-btn').addEventListener('click', this.#handleNewEventClick);
  }

  #handleNewEventClick = () => {
    this.#newEventPresenter = new NewEventPresenter({
      eventsModel: this.eventsModel,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
    });

    this.#newEventPresenter.init();
  };

  #renderEventList() {
    if (!this.#events.length) {
      document.querySelector(`#filter-${this.#currentFilterType}`).disabled = true;
      return;
    }

    render(this.#eventListComponent, this.#tripEventElement);
    this.#events.forEach((event) => this.#renderEvent(event));
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter(
      this.#tripEventElement.querySelector('.trip-events__list'),
      this.#renderEventList,
      this.eventsModel,
    );

    eventPresenter.init(event, this.eventsModel, this.#destinationsModel, this.#offersModel);
    this.#eventPresenters.set(event.id, eventPresenter);
  }
}

  // #handleEscKeyDown = (evt) => {
  //   if (evt.key === 'Escape') {
  //     evt.preventDefault();
  //     this.#closeNewEventForm();
  //   }
  // };

  // #closeNewEventForm = () => {
  //   this.#newEventPresenter?.destroy();
  //   this.#newEventPresenter = null;
  //   document.removeEventListener('keydown', this.#handleEscKeyDown);
  //   document.querySelector('.trip-main__event-add-btn').disabled = false;
  //   this.#reRenderEventList();
  // };

  // #clearFilters() {
  //   this.#filtersElement.innerHTML = '';
  // }



  //   render(sortView, this.#tripEventElement, RenderPosition.AFTERBEGIN);
  // }

  // #clearSort() {
  //   const sortElement = document.querySelector('.trip-events__trip-sort');
  //   sortElement.innerHTML = '';
  // }

  // #reRenderEventList() {
  //   this.#clearEventList();
  //   //this.#updateData();
  //   this.#renderEventList();
  // }

  // get filteredEvents() {
  //   return this.#events.filter((event) => this.#applyFilter(event, this.#currentFilterType));
  // }

// getEventPresenters() {
//   return this.#eventPresenters;
// }

  // #renderEventList() {
  //   if (!this.filteredEvents.length) {
  //     document.querySelector(`#filter-${this.#currentFilterType}`).disabled = true;
  //     return;
  //   }

  //   render(this.#eventListComponent, this.#tripEventElement);
  //   this.filteredEvents
  //     .sort(this.#getSortFunction())
  //     .forEach((event) => this.#renderEvent(event));
  // }

    // #getSortFunction() {
  //   return SORTS.find((sortItem) => sortItem.type === this.#currentSortType)?.sort || (() => 0);
  // }

  // #resetEventViews = () => {
  //   this.#eventPresenters.forEach((presenter) => presenter.resetView());
  // };

    // #renderEvent(event) {
  //   const eventPresenter = new EventPresenter(
  //     this.#tripEventElement.querySelector('.trip-events__list'),
  //     this.#reRenderEventList,
  //     this.eventsModel,
  //     this.#handleViewAction,
  //   );

  //   eventPresenter.init(event, this.eventsModel, this.#destinationsModel, this.#offersModel, this.#resetEventViews, this.#handleViewAction);
  //   this.#eventPresenters.set(event.id, eventPresenter);
  // }

    // updateEvents(events) {
  //   this.#events = [...events];
  //   this.#reRenderEventList();
  // }

  // #handleViewAction = (actionType, updateType, update) => {
  //   this.#onDataChange(actionType, updateType, update);
  // };

  // #handleViewAction = (actionType, updateType, update) => {

  //   switch (actionType) {
  //     case UserAction.ADD_EVENT:
  //       this.#eventsModel.addEvent(update);
  //       this.#events.push(update);
  //       this.#reRenderEventList();
  //       break;

  //     case UserAction.UPDATE_EVENT:
  //       this.#eventsModel.updateEvent(update);
  //       this.#events = updateItem(this.#events, update);

  //       if (this.#eventPresenters.has(update.id)) {
  //         this.#eventPresenters.get(update.id).init(update, this.#eventsModel, this.#destinations, this.#offers, this.#resetEventViews, this.#handleViewAction);
  //       }
  //       break;

  //     case UserAction.DELETE_EVENT:
  //       this.#eventsModel.deleteEvent(update.id);
  //       this.#events = this.#events.filter((event) => event.id !== update.id);

  //       this.#eventPresenters.get(update.id)?.destroy();
  //       this.#eventPresenters.delete(update.id);

  //       this.#reRenderEventList();
  //       break;
  //   }
  // };

  // #handleNewEventClick = () => {
  //   this.#currentFilterType = FILTERS[0].type;
  //   this.#currentSortType = SORTS[0].type;
  //   this.#clearFilters();
  //   this.#clearSort();
  //   this.#renderFilters();
  //   this.#renderSort();

  //   if (!this.#newEventPresenter) {
  //     this.#newEventPresenter = new NewEventPresenter({
  //       eventsModel: this.eventsModel,
  //       destinationsModel: this.#destinationsModel,
  //       offersModel: this.#offersModel,
  //       onDataChange: this.#handleViewAction,
  //       onCloseForm: this.#closeNewEventForm,
  //     });
  //   }

  //   this.#newEventPresenter.init();
  //   document.addEventListener('keydown', this.#handleEscKeyDown);
  //   document.querySelector('.trip-main__event-add-btn').disabled = true;
  // };

    // init(events, onDataChange) {
  //   this.#tripEventElement = document.querySelector('.page-main .trip-events');
  //   this.#filtersElement = document.querySelector('.trip-controls__filters');
  //   this.#onDataChange = onDataChange;
  //   this.updateEvents(events);

  //   document.querySelector('.trip-main__event-add-btn').addEventListener('click', this.#handleNewEventClick);
  // }
