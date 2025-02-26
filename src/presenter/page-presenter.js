import { render, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import NoEventView from '../view/no-event-view.js';
import { generateFilter } from '../mock/filter.js';

const siteMainElement = document.querySelector('.page-main');
const tripEventElement = siteMainElement.querySelector('.trip-events');
const tripMainElement = document.querySelector('.trip-main');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');

export default class PagePresenter {
  #tripEvents = [];
  #eventsModel = null;

  constructor(eventsModel) {
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#tripEvents = [...this.#eventsModel.events];
    const filters = generateFilter(this.#eventsModel.events);

    render(new FiltersView({filters}), filtersElement);
    if (this.#tripEvents.length === 0) {
      render(new NoEventView(), tripEventElement);
      return;
    }
    render(new TripInfoView(), tripMainElement, RenderPosition.AFTERBEGIN);
    render(new SortView(), tripEventElement);
  }
}
