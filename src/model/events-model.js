import { getMockEvent } from '../mock/events.js';
import { UpdateType } from '../const.js';
import Observable from '../framework/observable.js';

const EVENT_COUNT = 3;

export default class EventsModel extends Observable {
  #events = Array.from({ length: EVENT_COUNT }, getMockEvent);

  get events() {
    return this.#events;
  }

  updateEvent(updateType, update) {
    const index = this.events.findIndex(event => event.id === update.id);
    if (index !== -1) {
      this.events[index] = update;
      this._notify(updateType, update);
    }
  }

  addEvent(updateType, newEvent) {
    this.#events = [newEvent, ...this.#events];

    this._notify(updateType, newEvent);
  }

  deleteEvent(updateType, eventToDelete) {
    const initialLength = this.#events.length;
    this.#events = this.#events.filter((event) => event.id !== eventToDelete.id);

    if (initialLength === this.#events.length) {
      throw new Error('Can\'t delete unexisting event');
    }

    this._notify(updateType, eventToDelete);
  }
}
