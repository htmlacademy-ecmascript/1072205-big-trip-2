import { render } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import EventView from '../view/event-view/event-view.js';
import EventEditFormView from '../view/event-edit-form-view/event-edit-form-view.js';

const siteMainElement = document.querySelector('.page-main');
const tripEventElement = siteMainElement.querySelector('.trip-events');

export default class EventsListPresenter {
  #eventsModel = null;
  #tripEvents = [];
  #destinations = [];
  #offers = [];

  constructor(eventsModel) {
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#tripEvents = [...this.#eventsModel.events];
    this.#destinations = [...this.#eventsModel.destinations];
    this.#offers = [...this.#eventsModel.offers];
  }

  render() {
    render(new SortView(), tripEventElement);
    render(new EventListView(), tripEventElement);

    const tripEventsListElement = siteMainElement.querySelector('.trip-events__list');
    render(new EventEditFormView({event: this.#tripEvents, destinations: this.#destinations, offers: this.#offers}), tripEventsListElement);
    for (let i = 1; i < this.#tripEvents.length; i++) {
      render(new EventView({event: this.#tripEvents[i],  destinations: this.#destinations, offers: this.#offers}), tripEventsListElement);
    }
  }
}

