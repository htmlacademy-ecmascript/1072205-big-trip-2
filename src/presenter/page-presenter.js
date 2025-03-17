import { render, RenderPosition } from '../framework/render.js';
import { updateItem } from '../utils/event.js';
import TripInfoView from '../view/trip-info-view.js';
import NoEventView from '../view/no-event-view.js';
import EventsListPresenter from './events-list-presenter.js';

export default class PagePresenter {
  #eventsModel = null;
  #events = [];
  #destinations = [];
  #eventPresenters = new Map(); // Добавлено объявление

  #tripMainElement = null;
  #tripEventElement = null;
  #eventListPresenter = null; // Добавляем переменную для хранения списка событий

  constructor(eventsModel) {
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#events = [...this.#eventsModel.events];
    this.#destinations = [...this.#eventsModel.destinations];

    this.#tripMainElement = document.querySelector('.trip-main');
    this.#tripEventElement = document.querySelector('.page-main .trip-events');

    if (this.#events.length === 0) {
      this.#renderNoEvent();
      return;
    }

    this.#renderTripInfo();
    this.#renderEventList();
  }

  #renderNoEvent() {
    if (this.#events.length === 0) {
      render(new NoEventView(this.#tripEventElement), this.#tripEventElement);
    }
  }

  #renderTripInfo() {
    render(new TripInfoView({ events: this.#events, destinations: this.#destinations }), this.#tripMainElement, RenderPosition.AFTERBEGIN);
  }

  #renderEventList() {
    this.#eventListPresenter = new EventsListPresenter(this.#eventsModel);
    this.#eventListPresenter.init();

    // Теперь мы можем получить презентеры событий
    this.#eventPresenters = this.#eventListPresenter.getEventPresenters();
  }

  #onEventChange = (updatedEvent) => {
    this.#events = updateItem(this.#events, updatedEvent);
    this.#eventPresenters.get(updatedEvent.id)?.update(updatedEvent);
  };

  updateEvent(updatedEvent) {
    this.#events = this.#events.map((event) => event.id === updatedEvent.id ? updatedEvent : event);
    this.#eventPresenters.get(updatedEvent.id)?.update(updatedEvent);
  }

  #resetEventViews = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };
}
