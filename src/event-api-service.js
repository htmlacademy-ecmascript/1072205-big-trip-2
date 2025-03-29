import ApiService from "./framework/api-service";

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class EventApiService extends ApiService {
  constructor() {
    super('https://23.objects.htmlacademy.pro/big-trip', 'Basic eo0w590ik29889a'); // заменить на свой токен
  }

  async getEvents() {
    const response = await this._load({ url: 'points' });
    return this._adaptPointsData(await ApiService.parseResponse(response));
  }

  async getDestinations() {
    const response = await this._load({ url: 'destinations' });
    return this._adaptDestinationsData(await ApiService.parseResponse(response));
  }

  async getOffers() {
    const response = await this._load({ url: 'offers' });
    return this._adaptOffersData(await ApiService.parseResponse(response));
  }

  _adaptPointsData(points) {
    return points.map((point) => ({
      id: point.id,
      type: point.type,
      dateFrom: new Date(point.date_from),
      dateTo: new Date(point.date_to),
      basePrice: point.base_price,
      destination: point.destination,
      offers: point.offers,
      isFavorite: false,
    }));
  }

  _adaptDestinationsData(destinations) {
    return destinations.map((destination) => ({
      id: destination.id,
      name: destination.name,
      description: destination.description,
      pictures: destination.pictures,
    }));
  }

  _adaptOffersData(offers) {
    return offers.map((offer) => ({
      type: offer.type,
      offers: offer.offers,
    }));
  }

  async updateEvent(event) {
    const response = await this._load({
      url: `tasks/${event.id}`,
      method: Method.PUT,
      body: JSON.stringify(event),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }
}
