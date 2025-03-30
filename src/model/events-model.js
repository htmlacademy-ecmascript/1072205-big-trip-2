import { getMockEvent } from '../mock/events.js';
import Observable from '../framework/observable.js';

const EVENT_COUNT = 1;

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

  deleteEvent(eventId) {
    console.log("Список событий:", this.#events);

    this.#events.forEach((event, index) => {
      console.log(`Событие ${index}: id=${event.id} (тип ${typeof event.id}), eventId=${eventId} (тип ${typeof eventId})`);
    });

    if (!this.#events || !Array.isArray(this.#events)) {
      console.error("Список событий не найден.");
      return;
    }
    const index = this.#events.findIndex((event) => event.id == eventId);



    console.log("Индекс события:", index);
    if (index === -1) {
      console.error("Событие не найдено.");
      return;
    }

    // Удаление события
    this.#events.splice(index, 1);
    console.log("Список событий после удаления:", this.#events);
  }

}
