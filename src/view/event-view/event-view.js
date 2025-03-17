import AbstractView from '../../framework/view/abstract-view.js';
import { createEventTemplate } from './event-view-template.js';

export default class EventView extends AbstractView {
  #event = null;
  #destinations = [];
  #offers = [];
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({ event, destinations, offers, onEditClick, onFavoriteClick }) {
    super();
    this.#event = event;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onEditClick);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#onFavoriteButtonClick);
  }

  get template() {
    return createEventTemplate(this.#event, this.#destinations, this.#offers);
  }

  #onEditClick = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #onFavoriteButtonClick = (evt) => {
    evt.preventDefault();
    if (typeof this.#handleFavoriteClick === 'function') {
      this.#handleFavoriteClick();
    }
  };

  updateFavoriteButton(isFavorite) {
    const favoriteButton = this.element.querySelector('.event__favorite-btn');

    if (favoriteButton) {
      favoriteButton.classList.toggle('event__favorite-btn--active', isFavorite);
    }
  }
}
