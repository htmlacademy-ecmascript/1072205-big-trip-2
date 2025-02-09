import { createElement } from '../render.js';
import { humanizeEventDate, eventDuration, isEventFavourite } from '../utils.js';

function createEventOffersTemplate(offers) {
  return offers ? offers.map(((offer) =>
    `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`
  )).join('') : '';
}

function createEventTemplate(event) {
  const {basePrice, dateFrom, dateTo, destination, offers, type, isFavourite} = event;
  const date = humanizeEventDate(dateFrom).date;
  const startTime = humanizeEventDate(dateFrom).time;
  const endTime = humanizeEventDate(dateTo).time;
  const duration = Object.entries(eventDuration(dateFrom, dateTo)).map((item) => item[1]).join('\n');

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="2019-03-18">${date}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createEventOffersTemplate(offers)}
        </ul>
        <button class="event__favorite-btn ${isEventFavourite(isFavourite)}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class EventView {
  constructor({event}) {
    this.event = event;
  }

  getTemplate(event) {
    return createEventTemplate(event);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate(this.event));
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
