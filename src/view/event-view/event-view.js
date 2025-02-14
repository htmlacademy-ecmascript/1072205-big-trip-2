import { createElement } from '../../render.js';
import { createEventTemplate } from './event-view-template.js';

export default class EventView {
  constructor({event, destinations, offers}) {
    this.event = event;
    this.destinations = destinations;
    this.offers = offers;
  }

  getTemplate(event, destinations, offers) {
    return createEventTemplate(event, destinations, offers);
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
