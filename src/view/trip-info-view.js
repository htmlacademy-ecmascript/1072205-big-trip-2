import AbstractView from '../framework/view/abstract-view';
import { humanizeDate } from '../utils/event';

const EVENT_DATE_FORMAT = 'DD MMM';

function createTripInfoTemplate(events, destinations, offers) {
  if (!events.length) {
    return '';
  }

  const destinationNames = events.map((event) => destinations.find((dest) => dest.id === event.destination).name);
  const tripInfoTitle = destinationNames.join(' &mdash; ');

  const tripStartTime = Math.min(...events.map((event) => event.dateFrom));
  const tripEndTime = Math.max(...events.map((event) => event.dateTo));

  console.log('Events:', events);
console.log('Offers:', offers);
events.forEach((event) => {
  console.log(`Event: ${event.type}, Base price: ${event.basePrice}, Offers:`, event.offers);
});
const totalCost = events.reduce((sum, event) => {
  let eventCost = event.basePrice;

  console.log(`Processing event: ${event.type}, Base price: ${event.basePrice}`);

  if (Array.isArray(event.offers) && event.offers.length > 0) {
    // Сразу прибавляем стоимость всех офферов события
    const selectedOffersCost = event.offers.reduce((offerSum, offer) => {
      console.log(`Adding offer price: ${offer.price} for offer: ${offer.title}`);
      return offerSum + offer.price;
    }, 0);

    eventCost += selectedOffersCost;
  }

  console.log(`Final cost for event ${event.type}: ${eventCost}`);
  return sum + eventCost;
}, 0);



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
  #offers;

  constructor({ events, destinations, offers }) {
    super();
    this.#events = events;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createTripInfoTemplate(this.#events, this.#destinations, this.#offers);
  }
}
