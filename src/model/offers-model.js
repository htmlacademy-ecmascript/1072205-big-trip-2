import { getMockTypeOffers } from '../mock/offers.js';
import Observable from '../framework/observable.js';

export default class OffersModel extends Observable {
  #offers = getMockTypeOffers();

  get offers() {
    return this.#offers;
  }

  getOffersByType(type) {
    return this.#offers.find((offer) => offer.type === type)?.offers || [];
  }
}
