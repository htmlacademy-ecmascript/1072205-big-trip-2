import { getMockEvent } from '../mock/events.js';
import Observable from '../framework/observable.js';

const EVENT_COUNT = 4;

export default class EventsModel extends Observable {
  #events = Array.from({ length: EVENT_COUNT }, getMockEvent);

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
    const index = this._events.findIndex((item) => item.id === event.id);
    if (index !== -1) {
      this._events.splice(index, 1);
    }
    this._notify(updateType, event);
  }
}
