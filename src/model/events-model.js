import { getMockEvent } from '../mock/events.js';
import { getMockDestinations } from '../mock/destinations.js';
import { getMockTypeOffers } from '../mock/offers.js';

const EVENT_COUNT = 4;

export default class EventsModel {
  #events = Array.from({length: EVENT_COUNT}, getMockEvent);
  #destinations = getMockDestinations();
  #offers = getMockTypeOffers();

  get events() {
    return this.#events;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }
}
