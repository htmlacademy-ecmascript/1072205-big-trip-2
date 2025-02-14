import { EVENT_TYPES } from '../../const.js';
import {createElement} from '../../render.js';
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

export default class EventEditFormView {
  constructor({event = BLANK_EVENT, destinations, offers}) {
    this.event = event;
    this.destinations = destinations;
    this.offers = offers;
  }

  getTemplate(event, destinations, offers) {
    return createEventEditFormTemplate(event, destinations, offers);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate(this.event, this.destinations, this.offers));
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
