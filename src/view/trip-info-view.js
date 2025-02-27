import AbstractView from '../framework/view/abstract-view';
import { humanizeDate } from '../utils/event';

const EVENT_DATE_FORMAT = 'DD MMM';

function createTripInfoTemplate(events, destinations) {
  if (!events.length) {
    return '';
  }

  const destinationNames = events.map((event) => destinations.find((dest) => dest.id === event.destination).name);
  const tripInfoTitle = destinationNames.join(' &mdash; ');
  const tripStartTime = Math.min(...events.map((event) => event.dateFrom));
  const tripEndTime = Math.max(...events.map((event) => event.dateTo));
  const totalCost = events.reduce((sum, event) => sum + event.basePrice, 0);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripInfoTitle}</h1>
        <p class="trip-info__dates">
          ${humanizeDate(tripStartTime, EVENT_DATE_FORMAT).date}&nbsp;&mdash;&nbsp;
          ${humanizeDate(tripEndTime, EVENT_DATE_FORMAT).date}
        </p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
      </p>
    </section>`
  );
}

export default class TripInfoView extends AbstractView {
  #events;
  #destinations;

  constructor({ events, destinations }) {
    super();
    this.#events = events;
    this.#destinations = destinations;
  }

  get template() {
    return createTripInfoTemplate(this.#events, this.#destinations);
  }
}
