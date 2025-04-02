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

  init() {
    this.#updateData();

    if (!this.#isDataLoaded()) {
      return;
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
    this.#updateData();

    if (!this.#isDataLoaded()) {
      return;
    }

    if (this.#events.length === 0) {
      this.#tripEventElement.innerHTML = '';
      this.#renderNoEvent();
    } else {
      this.#renderTripInfo();
      this.#renderEventList();
    }
  };

  #updateData() {
    this.#events = [...this.eventsModel.events];
    this.#destinations = [...this.destinationsModel.destinations];
    this.#offers = [...this.offersModel.offers];
  }

  #isDataLoaded() {
    return this.#events.length > 0 && this.#destinations.length > 0 && this.#offers.length > 0;
  }

  #renderNoEvent() {
    render(new NoEventView(), this.#tripEventElement);
  }

  #renderTripInfo() {
    render(
      new TripInfoView(
        this.#events,
        this.#destinations,
        this.#offers,
      ),
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
