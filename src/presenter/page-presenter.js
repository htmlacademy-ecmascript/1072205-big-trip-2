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
    this.eventsModel = eventsModel;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;

    this.#tripMainElement = document.querySelector('.trip-main'); // Здесь .trip-main должен быть существующим элементом в вашем HTML
    this.#tripEventElement = document.querySelector('.trip-events'); // И аналогично для этого
  }

  async init() {
    if (!this.eventsModel || !this.destinationsModel || !this.offersModel) {
      throw new Error('Models are not initialized');
    }

    try {
      await this.eventsModel.init();
      await this.destinationsModel.init();
      await this.offersModel.init();

    } catch (error) {
      console.error('Error during initialization:', error);
      this.renderErrorMessage(error);
    }

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
