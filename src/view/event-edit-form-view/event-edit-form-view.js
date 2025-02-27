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
  #destinations = [];
  #offers = [];
  #handleFormSubmit = null;
  #handleEditClick = null;

  constructor({event = BLANK_EVENT, destinations, offers, onFormSubmit, onEditClick}) {
    super();
    this.#event = event;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditClick = onEditClick;
    this.#registerEvents();
  }

  get template() {
    return createEventEditFormTemplate(this.#event, this.#destinations, this.#offers);
  }

  #registerEvents() {
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
