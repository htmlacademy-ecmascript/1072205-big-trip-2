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

  constructor({event = BLANK_EVENT, destinations, offers}) {
    super();
    this.#event = event;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createEventEditFormTemplate(this.#event, this.#destinations, this.#offers);
  }
}
