import { EVENT_TYPES } from '../../const.js';
import AbstractView from '../../framework/view/abstract-view.js';
import { createEventEditFormTemplate } from './event-edit-form-view-template.js';

const BLANK_EVENT = {
  id: '',
  basePrice: 0,
  dateFrom: '',
  dateTo: '',
  destination: '',
  isFavourite: false,
  offers: [],
  type: EVENT_TYPES[5],
};

export default class EventEditFormView extends AbstractView {
  #event = null;
  #destinations = null;
  #offers = null;
  #handleFormSubmit = null;

  constructor({event = BLANK_EVENT, destinations, offers, onFormSubmit}) {
    super();
    this.#event = event;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  }

  get template() {
    return createEventEditFormTemplate(this.#event, this.#destinations, this.#offers);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };
}
