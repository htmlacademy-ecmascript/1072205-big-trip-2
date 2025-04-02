import { render, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import NoEventView from '../view/no-event-view.js';
import EventsListPresenter from './events-list-presenter.js';

export default class PagePresenter {
  #events = [];
  #destinations = [];
  #offers = [];
  #eventPresenters = new Map();

  #tripMainElement = null;
  #eventListPresenter = null;
  #tripEventElement = null;

  constructor(eventsModel, destinationsModel, offersModel) {
    this.eventsModel = eventsModel;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;

    this.#tripMainElement = document.querySelector('.trip-main');
    this.#tripEventElement = document.querySelector('.trip-events');

    this.eventsModel.addObserver(this.#handleModelUpdate);
  }

  async init() {
    try {
      this.#events = await this.eventsModel.events;
      this.#destinations = await this.destinationsModel.destinations;
      this.#offers = await this.offersModel.offers;
    } catch (error) {
      throw new Error('Данные не инициализированы');
    }

    if (this.#events.length === 0) {
      this.#renderNoEvent();
      return;
    }

    this.#renderTripInfo();
    this.#renderEventList();
  }

  updateEvent(updatedEvent) {
    this.eventsModel.updateEvent(updatedEvent);
  }

  #handleModelUpdate = () => {
    this.#events = [...this.eventsModel.events];

    if (this.#events.length === 0) {
      this.#tripEventElement.innerHTML = '';
      this.#renderNoEvent();
    } else {
      this.#renderTripInfo();
      this.#eventListPresenter.updateEvents(this.#events);
    }
  };

  #renderNoEvent() {
    render(new NoEventView(), this.#tripEventElement);
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
    this.#eventListPresenter = new EventsListPresenter(
      this.eventsModel,
      this.destinationsModel,
      this.offersModel
    );
    this.#eventListPresenter.init(this.#events);
  }
}
