import { getMockEvent } from '../mock/events.js';
import { getMockDestinations } from '../mock/destinations.js';
import { getMockTypeOffers } from '../mock/offers.js';

const EVENT_COUNT = 4;

export default class EventsModel {
  events = Array.from({length: EVENT_COUNT + 1}, getMockEvent);
  destinations = getMockDestinations();
  offers = getMockTypeOffers();

  getEvents() {
    return this.events;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }
}
