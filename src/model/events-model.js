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
      console.error('Ошибка загрузки данных:', err);
      this.#events = [];
    }
  }

  get events() {
    return this.#events;
  }

  async updateEvent(updateType, update) {
    const index = this.#events.findIndex((event) => event.id === update.id);
    if (index !== -1) {
      try {
        const updatedEvent = await this.#apiService.updateEvent(update);
        this.#events[index] = updatedEvent;
        this._notify(updateType, updatedEvent);
      } catch (error) {
        console.error('Ошибка обновления данных:', error);
      }
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
