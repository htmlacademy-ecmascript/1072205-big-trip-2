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

  async updateEvent(event) {
    try {
      const updatedEvent = await this.#apiService.updateEvent(event);
      const index = this.#events.findIndex((e) => e.id === updatedEvent.id);
      if (index !== -1) {
        this.#events[index] = updatedEvent;
        this._notify(UpdateType.PATCH, updatedEvent);
      }
      return updatedEvent;
    } catch (err) {
      console.error('Ошибка при обновлении события:', err);
    }
  }

  addEvent(updateType, newEvent) {
    this.#events = [newEvent, ...this.#events];
    this._notify(updateType, newEvent);
  }

  deleteEvent(eventId) {
    const index = this.#events.findIndex((event) => event.id === eventId);
    if (index !== -1) {
      this.#events.splice(index, 1);
    }
    this._notify(UpdateType.PATCH, eventId);
  }
}
