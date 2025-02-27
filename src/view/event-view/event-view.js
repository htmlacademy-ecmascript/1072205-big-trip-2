import AbstractView from '../../framework/view/abstract-view.js';
import { createEventTemplate } from './event-view-template.js';

export default class EventView extends AbstractView {
  #event = null;
  #destinations = [];
  #offers = [];
  #handleEditClick = null;

  constructor({event, destinations, offers, onEditClick}) {
    super();
    this.#event = event;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleEditClick = onEditClick;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createEventTemplate(this.#event, this.#destinations, this.#offers);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
