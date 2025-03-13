import { getMockEvent } from '../mock/events.js';
import { getMockDestinations } from '../mock/destinations.js';
import { getMockTypeOffers } from '../mock/offers.js';

const EVENT_COUNT = 5;

export default class EventsModel {
  #events = Array.from({ length: EVENT_COUNT }, getMockEvent);
  #destinations = getMockDestinations();
  #offers = getMockTypeOffers();

  get events() {
    return this.#events;
  }

  set events(newEvents) {
    this.#events = newEvents;
  }

  get destinations() {
    return this.#destinations;
  }

  set destinations(newDestinations) {
    this.#destinations = newDestinations;
  }

  get offers() {
    return this.#offers;
  }

  set offers(newOffers) {
    this.#offers = newOffers;
  }
}
