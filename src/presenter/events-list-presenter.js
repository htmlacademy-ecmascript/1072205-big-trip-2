import { render } from '../framework/render.js';
import { generateFilter } from '../utils/filter.js';
import { generateSort } from '../utils/sort.js';
import { updateItem } from '../utils/event.js';
import { SORTS, FILTERS, UserAction } from '../const.js';
import EventListView from '../view/event-list-view.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import EventPresenter from './event-presenter.js';
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
  #newEventPresenter = null;
  #currentSortType = SORTS[0].type;
  #currentFilterType = FILTERS[0].type;

  constructor(eventsModel, destinationsModel, offersModel) {
    this.#eventsModel = eventsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
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

  get events() {
    const events = Array.isArray(this.#eventsModel.events) ? this.#eventsModel.events : [];

    return [...events].sort((a, b) => {
      const sortFunction = SORTS.find(sortItem => sortItem.type === this.#currentSortType)?.sort;
      return sortFunction ? sortFunction(a, b) : 0;
    });
  }

  #handleFormSubmit = (updatedEvent) => {
    this.#eventsModel.addEvent(UpdateType.MINOR, updatedEvent);

    // Перерисовываем список
    this.#clearEventList();
    this.#renderEventList();

    // Закрываем форму после сохранения
    this.#closeNewEventForm();
  };


  getEventPresenters() {
    return this.#eventPresenters;
  }

  #handleFilterChange = (filterType) => {
    this.#currentFilterType = filterType;
    this.#clearEventList();
    this.#renderEventList();
  };

  #handleNewEventClick = () => {
    this.#currentFilterType = FILTERS[0].type;
    this.#currentSortType = SORTS[0].type;

    this.#clearEventList();
    this.#renderEventList();

    if (!this.#newEventPresenter) {
      this.#newEventPresenter = new NewEventPresenter({
        destinationsModel: this.#destinations,
        offersModel: this.#offers,
        onDataChange: this.#handleDataChange,
        onCloseForm: this.#closeNewEventForm,
      });
    }

    this.#newEventPresenter.init();
    document.addEventListener('keydown', this.#handleEscKeyDown); // Добавляем обработчик Esc

    const newEventButton = document.querySelector('.trip-main__event-add-btn');
    newEventButton.setAttribute('disabled', 'true');
  };

  #handleDataChange = (actionType, updateType, updatedEvent) => {
    if (actionType === UserAction.ADD_EVENT) {
      this.#eventsModel.addEvent(updateType, updatedEvent);
      this.#events.push(updatedEvent);

      // Перерисовываем список событий
      this.#clearEventList();
      this.#renderEventList();

      // Закрываем форму создания события
      this.#closeNewEventForm();
    }
  };


  #handleEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#closeNewEventForm();
    }
  };

  #closeNewEventForm = () => {
    if (this.#newEventPresenter) {
      this.#newEventPresenter.destroy(); // Удаляем форму
      this.#newEventPresenter = null;
    }

    document.removeEventListener('keydown', this.#handleEscKeyDown);

    const newEventButton = document.querySelector('.trip-main__event-add-btn');
    if (newEventButton) {
      newEventButton.disabled = false;
    }

    // Перерисовываем список после закрытия формы
    this.#clearEventList();
    this.#renderEventList();
  };

#renderFilters() {
  const filters = generateFilter(this.#events).map(filter => ({
    ...filter,
    isDisabled: this.filteredEventsByType(filter.type).length === 0
  }));

  render(new FiltersView({
    filters,
    currentFilterType: this.#currentFilterType,
    onFilterChange: this.#handleFilterChange
  }), this.#filtersElement);
}

filteredEventsByType(filterType) {
  return this.#events.filter(event => {
    switch (filterType) {
      case 'everything':
        return true;
      case 'future':
        return event.dateFrom > new Date();
      case 'present':
        return event.dateFrom <= new Date() && event.dateTo >= new Date();
      case 'past':
        return event.dateTo < new Date();
      default:
        return true;
    }
  });
}

#renderSort() {
  const sortView = new SortView({
    sorts: generateSort(),
    onSortChange: this.#handleSortChange,
  });
  render(sortView, this.#tripEventElement);
}

#renderEventList() {
  const filteredEvents = this.filteredEvents;

  if (filteredEvents.length === 0) {
    document.querySelector(`#filter-${this.#currentFilterType}`).setAttribute('disabled', 'true');
    return;
  }

  render(this.#eventListComponent, this.#tripEventElement);

  filteredEvents
  .sort((a, b) => {
    const sortFunction = SORTS.find(sortItem => sortItem.type === this.#currentSortType)?.sort;
    return sortFunction ? sortFunction(a, b) : 0;
  })
  .forEach((event) => this.#renderEvent(event)); // Рендерим отфильтрованные события
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

  get filteredEvents() {
    return this.#events.filter(event => {
      switch (this.#currentFilterType) {
        case 'everything':
          return true; // Все события
        case 'future':
          return event.dateFrom > new Date();
        case 'present':
          return event.dateFrom <= new Date() && event.dateTo >= new Date();
        case 'past':
          return event.dateTo < new Date();
        default:
          return true;
      }
    });
  }
}
