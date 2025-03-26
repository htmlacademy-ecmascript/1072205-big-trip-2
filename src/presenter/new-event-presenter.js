import { render, replace, remove } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';
import EventEditFormView from '../view/event-edit-form-view/event-edit-form-view.js';
import EventView from '../view/event-view/event-view.js';

export default class NewEventPresenter {
  #event = null;
  #destinations = [];
  #offers = [];
  #onDataChange = null;
  #onCloseForm = null;

  #eventEditFormComponent = null;
  #eventComponent = null;

  constructor({ destinationsModel, offersModel, onDataChange, onCloseForm }) {
    this.#destinations = destinationsModel;
    this.#offers = offersModel;
    this.#onDataChange = onDataChange;
    this.#onCloseForm = onCloseForm;
  }

  init() {
    this.#event = {
      type: 'Flight',
      destination: '',
      startDate: '',
      endDate: '',
      cost: 0,
      offers: [],
    };

    this.#eventEditFormComponent = new EventEditFormView({
      //event: this.#event,  // Убедитесь, что объект события передаётся
      destinations: this.#destinations,  // Пункты назначения
      offers: this.#offers,  // Опции для события
      // onFormSubmit: this.#handleFormSubmit,
      // onEditClick: this.#handleCloseClick,
    });

    render(this.#eventEditFormComponent, document.querySelector('.page-main .trip-events'));
  }

  #handleFormSubmit = (newEventData) => {
    const updatedEvent = { ...this.#event, ...newEventData };
    this.#onDataChange(UserAction.ADD_EVENT, UpdateType.MINOR, updatedEvent);
    this.#handleCloseFormClick(); // Закрыть форму после сохранения
  };

  #handleCloseFormClick = () => {
    this.#onCloseForm(); // Закрыть форму создания нового события
    remove(this.#eventEditFormComponent); // Удалить форму из DOM
  };
}
