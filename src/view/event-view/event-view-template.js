import { humanizeDate, eventDuration, isEventFavorite } from '../../utils/event';

const EVENT_DATE_FORMAT = 'MMM DD';

function createEventOffersTemplate(selectedOffers) {
  return selectedOffers && selectedOffers.map((offer) =>
    `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`
  ).join('');
}

function createEventTemplate(event, destinations, offersList) {
  const {basePrice, dateFrom, dateTo, destination, offers, type, isFavorite } = event;
  const date = humanizeDate(dateFrom, EVENT_DATE_FORMAT).date;
  const startTime = humanizeDate(dateFrom).time;
  const endTime = humanizeDate(dateTo).time;
  const duration = Object.entries(eventDuration(dateFrom, dateTo)).map((item) => item[1]).join(' ');
  const destinationById = destinations.find((dest) => dest.id === destination).name;
  const offersByType = offersList.find((offer) => offer.type.toLowerCase() === type.toLowerCase())?.offers ?? [];
  const selectedOffers = offersByType.filter((offer) => offers.includes(offer.id));

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${date}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destinationById}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createEventOffersTemplate(selectedOffers)}
        </ul>
        <button class="event__favorite-btn ${isEventFavorite(isFavorite)}" type="button">
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

export { createEventTemplate };
