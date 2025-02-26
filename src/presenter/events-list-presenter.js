import { render, replace } from '../framework/render.js';
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

    this.#renderEventList();
  }

  #renderEventList() {
    render(new EventListView(), tripEventElement);
    for (let i = 1; i < this.#tripEvents.length; i++) {
      this.#renderEvent(this.#tripEvents[i], this.#destinations, this.#offers);
    }
  }

  #renderEvent(event, destinations, offers) {
    const tripEventsListElement = siteMainElement.querySelector('.trip-events__list');
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToItem();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };
    const eventComponent = new EventView({
      event,
      destinations,
      offers,
      onEditClick: () => {
        replaceItemToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });
    const eventEditFormComponent = new EventEditFormView({
      event,
      destinations,
      offers,
      onFormSubmit: () => {
        replaceFormToItem();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onEditClick: () => {
        replaceFormToItem();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceItemToForm() {
      replace(eventEditFormComponent, eventComponent);
    }

    function replaceFormToItem() {
      replace(eventComponent, eventEditFormComponent);
    }

    render(eventComponent, tripEventsListElement)
  }
}

