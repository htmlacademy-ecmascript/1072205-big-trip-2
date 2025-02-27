import { render, replace } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import EventView from '../view/event-view/event-view.js';
import EventEditFormView from '../view/event-edit-form-view/event-edit-form-view.js';

const siteMainElement = document.querySelector('.page-main');
const tripEventElement = siteMainElement.querySelector('.trip-events');

const isEscape = (evt) => evt.key === 'Escape';

export default class EventsListPresenter {
  #eventsModel;
  #tripEvents = [];
  #destinations = [];
  #offers = [];
  #eventListComponent = new EventListView();

  constructor(eventsModel) {
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#tripEvents = [...this.#eventsModel.events];
    this.#destinations = [...this.#eventsModel.destinations];
    this.#offers = [...this.#eventsModel.offers];

    this.#renderEventList();
  }

  #renderEventList() {
    render(this.#eventListComponent, tripEventElement);
    this.#tripEvents.forEach((event) => this.#renderEvent(event));
  }

  #renderEvent(event) {
    const tripEventsListElement = siteMainElement.querySelector('.trip-events__list');

    const eventComponent = new EventView({
      event,
      destinations: this.#destinations,
      offers: this.#offers,
      onEditClick: () => this.#replaceItemToForm(eventComponent, event)
    });

    render(eventComponent, tripEventsListElement);
  }

  #replaceItemToForm(eventComponent, event) {
    const eventEditFormComponent = new EventEditFormView({
      event,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: () => this.#replaceFormToItem(eventComponent, eventEditFormComponent),
      onEditClick: () => this.#replaceFormToItem(eventComponent, eventEditFormComponent)
    });

    replace(eventEditFormComponent, eventComponent);
    document.addEventListener('keydown', (evt) => this.#escKeyDownHandler(evt, eventComponent, eventEditFormComponent));
  }

  #replaceFormToItem(eventComponent, eventEditFormComponent) {
    replace(eventComponent, eventEditFormComponent);
    document.removeEventListener('keydown', (evt) => this.#escKeyDownHandler(evt, eventComponent, eventEditFormComponent));
  }

  #escKeyDownHandler(evt, eventComponent, eventEditFormComponent) {
    if (isEscape(evt)) {
      evt.preventDefault();
      this.#replaceFormToItem(eventComponent, eventEditFormComponent);
    }
  }
}
