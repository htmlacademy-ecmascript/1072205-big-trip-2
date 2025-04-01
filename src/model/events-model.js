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

  async addEvent(newEvent) {
    try {
      console.log('Отправляемые данные:', newEvent);
      const addedEvent = await this.#apiService.addEvent(newEvent);
      this.#events = [addedEvent, ...this.#events];
      this._notify(UpdateType.POST, addedEvent);
    } catch (err) {
      console.error('Ошибка при добавлении события:', err);
    }
  }

  async deleteEvent(eventId) {
    try {
      await this.#apiService.deleteEvent(eventId);
      this.#events = this.#events.filter((event) => event.id !== eventId);
      this._notify(UpdateType.PATCH, eventId);
    } catch (err) {
      console.error('Ошибка при удалении события:', err);
    }
  }
}
