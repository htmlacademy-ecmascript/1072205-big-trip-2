import { render } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import { generateSort } from '../utils/sort.js';
import EventPresenter from './event-presenter.js';

export default class EventsListPresenter {
  #eventsModel = null;
  #events = [];
  #destinations = [];
  #offers = [];
  #eventPresenters = new Map();
  #tripEventElement = null;

  #eventListComponent = new EventListView();

  constructor(eventsModel) {
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#events = [...this.#eventsModel.events];
    this.#destinations = [...this.#eventsModel.destinations];
    this.#offers = [...this.#eventsModel.offers];

    this.#tripEventElement = document.querySelector('.page-main .trip-events');

    this.#renderSort();
    this.#renderEventList();
  }

  #renderSort() {
    const sorts = generateSort();
    const sortView = new SortView({
      sorts,
      onSortChange: this.#handleSortChange,
    });
    render(sortView, this.#tripEventElement);
    sortView.setEventListeners();
  }

  #renderEventList() {
    render(this.#eventListComponent, this.#tripEventElement);
    this.#events.forEach((event) => {
      const eventPresenter = new EventPresenter(
        this.#tripEventElement.querySelector('.trip-events__list')
      );

      eventPresenter.init(event, this.#destinations, this.#offers);
      this.#eventPresenters.set(event.id, eventPresenter);
    });
  }

  #handleSortChange = (sortType) => {
    // Сортировка в зависимости от типа
    switch (sortType) {
      case 'day':
        this.#events.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
        break;
      case 'event':
        this.#events.sort((a, b) => a.destination.localeCompare(b.destination));
        break;
      case 'time':
        this.#events.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
        break;
      case 'price':
        this.#events.sort((a, b) => a.price - b.price);
        break;
      case 'offers':
        this.#events.sort((a, b) => a.offers.length - b.offers.length);
        break;
      default:
        break;
    }

    // Очищаем текущий список
    this.#eventListComponent.clear();

    // Перерисовываем список с отсортированными событиями
    this.#renderEventList();
  }
}
