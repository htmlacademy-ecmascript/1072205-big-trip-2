import AbstractView from "../framework/view/abstract-view";
import { humanizeDate } from "../utils/event";

const EVENT_DATE_FORMAT = 'DD MMM';

function createTripInfoTemplate(events, destinations) {
  let tripInfoTitle = '';
  let startTime = events[0].dateFrom;
  let endTime = events[0].dateTo;
  let totalCost = null;

  for (let i = 0; i < events.length; i++) {
    const destinationById = destinations.find((dest) => dest.id === events[i].destination).name;
    tripInfoTitle += destinationById;
    if (i != events.length - 1) {
      tripInfoTitle += ' &mdash; ';
    }
    if (events[i].dateFrom < startTime) {
      startTime = events[i].dateFrom;
    }
    if (events[i].dateTo > endTime) {
      endTime = events[i].dateTo;
    }
    totalCost += events[i].basePrice;
  }

  const dateFrom = humanizeDate(startTime, EVENT_DATE_FORMAT).date;
  const dateTo = humanizeDate(endTime, EVENT_DATE_FORMAT).date;

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripInfoTitle}</h1>

        <p class="trip-info__dates">${dateFrom}&nbsp;&mdash;&nbsp;${dateTo}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
      </p>
    </section>`
  );
}

export default class TripInfoView extends AbstractView {
  #events = [];
  #destinations = [];

  constructor({events, destinations}) {
    super();
    this.#events = events;
    this.#destinations = destinations;
  }

  get template() {
    return createTripInfoTemplate(this.#events, this.#destinations);
  }
}
