import { render } from '../framework/render.js';
import { generateFilter } from '../utils/filter.js';
import { generateSort } from '../utils/sort.js';
import { updateItem } from '../utils/event.js';
import { SORTS, UpdateType, UserAction } from '../const.js';
import EventListView from '../view/event-list-view.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import EventPresenter from './event-presenter.js';
import { FILTERS } from '../const.js';
import NewEventPresenter from './new-event-presenter.js';

export default class EventsListPresenter {
  #eventsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #events = [];
  #destinations = [];
  #offers = [];
  #eventPresenters = new Map();

  #eventListComponent = new EventListView();
  #tripEventElement = null;
  #filtersElement = null;
  #currentSortType = SORTS[0].type;
  #currentFilterType = 'everything';
  #newEventPresenter = null;

  constructor(eventsModel, destinationsModel, offersModel) {
    this.#eventsModel = eventsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  get filteredEvents() {
    const events = this.#events;
    console.log('Исходные события:', events); // Проверка

    // Применение фильтра
    return events.filter(event => {
      switch (this.#currentFilterType) {
        case 'everything':
          return true; // Все события
        case 'future':
          return dayjs(event.startDate).isAfter(dayjs()); // Только будущие
        case 'present':
          return dayjs(event.startDate).isBefore(dayjs()) && dayjs(event.endDate).isAfter(dayjs()); // Только текущие
        case 'past':
          return dayjs(event.endDate).isBefore(dayjs()); // Только прошедшие
        default:
          return true;
      }
    });
  }

  #handleFilterChange = (filterType) => {
    this.#currentFilterType = filterType;
    this.#clearEventList();
    this.#renderEventList();  // Перерисовываем список при смене фильтра
  };
  #handleNewEventClick = () => {
    console.log('жмяк');
    // Сбрасываем фильтр и сортировку
    this.#currentFilterType = 'everything';
    this.#currentSortType = SORTS[0].type;

    // Инициализируем новый Presenter для создания нового события
    if (!this.#newEventPresenter) {
      this.#newEventPresenter = new NewEventPresenter({
        destinationsModel: this.#destinations,
        offersModel: this.#offers,
        onDataChange: this.#handleDataChange,
        onCloseForm: this.#closeNewEventForm,
      });
    }
    console.log(this.#newEventPresenter);

    this.#newEventPresenter.init(); // Инициализируем форму добавления нового события
  };

  #handleDataChange = (actionType, updateType, updatedEvent) => {
    if (actionType === UserAction.ADD_EVENT) {
      this.#eventsModel.addEvent(updateType, updatedEvent);
      this.#events.push(updatedEvent);
      this.#clearEventList();
      this.#renderEventList();
    }
  };

  #closeNewEventForm = () => {
    // Закрытие формы и разблокировка кнопки "New Event"
    this.#newEventPresenter = null;
    // Разблокировать кнопку, если она была заблокирована
    const newEventButton = document.querySelector('.trip-controls__new-event-btn');
    newEventButton.disabled = false;
  };

  #applyCurrentFilter(events) {
    switch (this.#currentFilterType) {
      case 'future':
        return events.filter((event) => dayjs(event.dateFrom).isAfter(dayjs()));
      case 'present':
        return events.filter((event) => dayjs(event.dateFrom).isBefore(dayjs()) && dayjs(event.dateTo).isAfter(dayjs()));
      case 'past':
        return events.filter((event) => dayjs(event.dateTo).isBefore(dayjs()));
      default:
        return events;
    }
  }

  get events() {
    const events = Array.isArray(this.#eventsModel.events) ? this.#eventsModel.events : [];
    console.log('Исходные события:', events);

    return [...events].sort((a, b) => {
      const sortFunction = SORTS.find(sortItem => sortItem.type === this.#currentSortType)?.sort;
      return sortFunction ? sortFunction(a, b) : 0;
    });
  }

  getEventPresenters() {
    return this.#eventPresenters;
  }

  init() {
    this.#events = [...this.#eventsModel.events];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    this.#tripEventElement = document.querySelector('.page-main .trip-events');
    this.#filtersElement = document.querySelector('.trip-controls__filters');

    this.#renderFilters();
    this.#renderSort();
    this.#renderEventList();
    const newEventButton = document.querySelector('.trip-main__event-add-btn');
    newEventButton.addEventListener('click', this.#handleNewEventClick);
  }

#renderFilters() {
  render(new FiltersView({
    filters: generateFilter(this.#events),
    currentFilterType: this.#currentFilterType,  // Передаем текущий фильтр
    onFilterChange: this.#handleFilterChange  // Передаем обработчик фильтрации
  }), this.#filtersElement);
}

  #renderSort() {
    console.log('Передаем обработчик в SortView:', this.#handleSortChange);
    const sortView = new SortView({
      sorts: generateSort(),
      onSortChange: this.#handleSortChange,
    });
    render(sortView, this.#tripEventElement);
  }

  #renderEventList() {
    const filteredEvents = this.filteredEvents; // Применение фильтра

    console.log('Отфильтрованные события:', filteredEvents);  // Проверка

    render(this.#eventListComponent, this.#tripEventElement);

    if (filteredEvents.length === 0) {
      this.#renderEmptyMessage();  // Показать сообщение, если нет событий
      return;
    }

    filteredEvents
      .sort((a, b) => {
        const sortFunction = SORTS.find(sortItem => sortItem.type === this.#currentSortType)?.sort;
        return sortFunction ? sortFunction(a, b) : 0;
      })
      .forEach((event) => this.#renderEvent(event)); // Рендерим отфильтрованные события
  }


  #renderEmptyMessage() {
    const message = {
      'everything': 'There are no events now',
      'future': 'There are no future events now',
      'present': 'There are no present events now',
      'past': 'There are no past events now'
    }[this.#currentFilterType];

    this.#eventListComponent.element.innerHTML = `<p class="trip-events__msg">${message}</p>`;
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter(
      this.#tripEventElement.querySelector('.trip-events__list')
    );
    eventPresenter.init(event, this.#destinations, this.#offers, this.#resetEventViews, this.#handleViewAction);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #handleViewAction = (actionType, updateType, update) => {
    if (actionType === UserAction.UPDATE_EVENT) {
      this.#eventsModel.updateEvent(updateType, update);
      this.#events = updateItem(this.#events, update);
      this.#clearEventList();
      this.#renderEventList();
    }
  };

  #handleSortChange = (sortType) => {
    if (this.#currentSortType !== sortType) {
      this.#currentSortType = sortType;
      this.#clearEventList();
      this.#renderEventList();
    }
  };

  #resetEventViews = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #clearEventList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
    this.#eventListComponent.clear();
  }
}
