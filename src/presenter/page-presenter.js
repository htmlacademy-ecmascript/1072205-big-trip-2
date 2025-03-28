import { render, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import NoEventView from '../view/no-event-view.js';
import EventsListPresenter from './events-list-presenter.js';

export default class PagePresenter {
  #eventsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #events = [];
  #destinations = [];
  #offers = [];
  #eventPresenters = new Map();

  #tripMainElement = null;
  #tripEventElement = null;
  #eventListPresenter = null;

  constructor(eventsModel, destinationsModel, offersModel) {
    this.#eventsModel = eventsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#events = [...this.#eventsModel.events];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    this.#tripMainElement = document.querySelector('.trip-main');
    this.#tripEventElement = document.querySelector('.page-main .trip-events');

    if (this.#events.length === 0) {
      this.#renderNoEvent();
      return;
    }

    this.#renderTripInfo();
    this.#renderEventList();
  }

  updateEvent(updatedEvent) {
    this.#events = this.#events.map((event) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );
    this.#eventPresenters.get(updatedEvent.id)?.update(updatedEvent);
  }

  #renderNoEvent() {
    if (this.#events.length === 0) {
      render(new NoEventView(), this.#tripEventElement);
    }
  }

  #renderTripInfo() {
    render(
      new TripInfoView({
        events: this.#events,
        destinations: this.#destinations,
        offers: this.#offers,
      }),
      this.#tripMainElement,
      RenderPosition.AFTERBEGIN
    );
  }

  #renderEventList() {
    this.#eventListPresenter = new EventsListPresenter(this.#eventsModel, this.#destinationsModel, this.#offersModel);
    this.#eventListPresenter.init();

    this.#eventPresenters = this.#eventListPresenter.getEventPresenters();
  }
}
