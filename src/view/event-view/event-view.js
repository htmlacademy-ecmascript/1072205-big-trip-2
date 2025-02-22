import AbstractView from '../../framework/view/abstract-view.js';
import { createEventTemplate } from './event-view-template.js';

export default class EventView extends AbstractView {
  #event = null;
  #destinations = null;
  #offers = null;

  constructor({event, destinations, offers}) {
    super();
    this.#event = event;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createEventTemplate(this.#event, this.#destinations, this.#offers);
  }
}
