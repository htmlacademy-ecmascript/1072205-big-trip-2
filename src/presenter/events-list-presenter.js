import { FILTERS } from '../const.js';
import { render } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import EventPresenter from './event-presenter.js';
import NewEventPresenter from './new-event-presenter.js';

export default class EventsListPresenter {
  #events = [];
  #destinationsModel;
  #offersModel;
  #eventPresenters = new Map();
  #eventListComponent = new EventListView();
  #tripEventElement;
  #filtersElement;
  #newEventPresenter = null;
  #currentFilterType = FILTERS[0].type;
  #onDataChange = null;
  #resetView = null;

  constructor(eventsModel, destinationsModel, offersModel, onDataChange, resetView) {
    this.eventsModel = eventsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#onDataChange = onDataChange;
    this.#resetView = resetView;
  }

  init(events) {
    this.#events = [...events];
    this.#tripEventElement = document.querySelector('.page-main .trip-events');
    this.#filtersElement = document.querySelector('.trip-controls__filters');

    this.#renderEventList();
    document
      .querySelector('.trip-main__event-add-btn')
      .addEventListener('click', this.#handleNewEventClick);
  }

  #handleNewEventClick = () => {
    this.#newEventPresenter = new NewEventPresenter({
      eventsModel: this.eventsModel,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
    });

    this.#newEventPresenter.init();
  };

  #renderEventList() {
    this.#clearEventList(); // Очистка перед повторным рендерингом

    if (!this.#events.length) {
      document.querySelector(`#filter-${this.#currentFilterType}`).disabled = true;
      return;
    }

    render(this.#eventListComponent, this.#tripEventElement);
    this.#events.forEach((event) => this.#renderEvent(event));
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter(
      this.#tripEventElement.querySelector('.trip-events__list'),
      this.renderEventList,  // Передаем функцию рендеринга
      this.eventsModel,  // Передаем модель событий
      this.#onDataChange,  // Передаем обработчик данных
      this.#resetView // Передаем метод сброса
    );

    eventPresenter.init(event, this.eventsModel, this.#destinationsModel, this.#offersModel, this.#onDataChange, this.#resetView);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  updateEvents(events) {
    this.#events = [...events];
    this.#renderEventList();
  }

  #clearEventList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
    this.#tripEventElement.innerHTML = '';
  }
}


  // #closeNewEventForm = () => {
  //   this.#newEventPresenter?.destroy();
  //   this.#newEventPresenter = null;
  //   document.removeEventListener('keydown', this.#handleEscKeyDown);
  //   document.querySelector('.trip-main__event-add-btn').disabled = false;
  //   this.#reRenderEventList();
  // };

  // #reRenderEventList() {
  //   this.#clearEventList();
  //   //this.#updateData();
  //   this.#renderEventList();
  // }

  // #handleNewEventClick = () => {
  //   this.#currentFilterType = FILTERS[0].type;
  //   this.#currentSortType = SORTS[0].type;
  //   this.#clearFilters();
  //   this.#clearSort();
  //   this.#renderFilters();
  //   this.#renderSort();

  //   if (!this.#newEventPresenter) {
  //     this.#newEventPresenter = new NewEventPresenter({
  //       eventsModel: this.eventsModel,
  //       destinationsModel: this.#destinationsModel,
  //       offersModel: this.#offersModel,
  //       onDataChange: this.#handleViewAction,
  //       onCloseForm: this.#closeNewEventForm,
  //     });
  //   }

  //   this.#newEventPresenter.init();
  //   document.addEventListener('keydown', this.#handleEscKeyDown);
  //   document.querySelector('.trip-main__event-add-btn').disabled = true;
  // };
