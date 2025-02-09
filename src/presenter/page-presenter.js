import TripInfoView from '../view/trip-info-view.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import EventEditFormView from '../view/event-edit-form-view.js';
import EventView from '../view/event-view.js';
import EventListView from '../view/event-list-view.js';
import { render, RenderPosition } from '../render.js';

const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const tripEventElement = siteMainElement.querySelector('.trip-events');

export default class PagePresenter {
  constructor(eventsModel) {
    this.eventsModel = eventsModel;
  }

  init() {
    this.tripEvents = [...this.eventsModel.getEvents()];
    render(new TripInfoView(), tripMainElement, RenderPosition.AFTERBEGIN);
    render(new FiltersView(), filtersElement);
    render(new SortView(), tripEventElement);
    render(new EventListView(), tripEventElement);
    const tripEventsListElement = document.querySelector('.trip-events__list');
    render(new EventEditFormView(), tripEventsListElement);

    for (let i = 0; i < this.tripEvents.length; i++) {
      render(new EventView({event: this.tripEvents[i]}), tripEventsListElement);
    }
  }
}
