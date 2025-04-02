import Observable from '../framework/observable.js';
import EventApiService from '../event-api-service.js';
import { UpdateType } from '../const.js';

export default class DestinationsModel extends Observable {
  #apiService = new EventApiService();
  #destinations = [];

  async init() {
    try {
      this.#destinations = await this.#apiService.getDestinations();
      this._notify(UpdateType.INIT);
    } catch (err) {
      //console.error('Failed to load destinations:', err);
    }
  }

  get destinations() {
    return this.#destinations;
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => destination.id === id) || null;
  }
}
