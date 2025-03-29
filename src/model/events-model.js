import { UpdateType } from '../const.js';
import Observable from '../framework/observable.js';
import EventApiService from '../event-api-service.js';

export default class EventsModel extends Observable {
  #apiService = new EventApiService();
  #events = [];


  async init() {
    try {
      this.#events = await this.#apiService.getEvents();
      this._notify(UpdateType.INIT, this.#events);
    } catch (err) {
      console.error('Failed to load events:', err);
      this.#events = [];
    }
  }

  get events() {
    return this.#events;
  }

  updateEvent(updateType, update) {
    const index = this.#events.findIndex((event) => event.id === update.id);
    if (index !== -1) {
      this.#events[index] = update;
      this._notify(updateType, update);
    }
  }

  addEvent(updateType, newEvent) {
    this.#events = [newEvent, ...this.#events];
    this._notify(updateType, newEvent);
  }

  deleteEvent(updateType, event) {
    const index = this.#events.findIndex((item) => item.id === event.id);
    if (index !== -1) {
      this.#events.splice(index, 1);
    }
    this._notify(updateType, event);
  }
}
