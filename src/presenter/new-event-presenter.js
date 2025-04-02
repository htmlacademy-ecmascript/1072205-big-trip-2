import { render, remove, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';
import EventEditFormView from '../view/event-edit-form-view/event-edit-form-view.js';
import { EVENT_TYPES } from '../const.js';

export default class NewEventPresenter {
  #events = null;  // Инициализируем приватное свойство
  #destinations = [];
  #offers = [];
  #onDataChange = null;
  #onCloseForm = null;
  #eventEditFormComponent = null;

  constructor({ eventsModel, destinationsModel, offersModel, onDataChange, onCloseForm }) {
    this.#events = eventsModel;  // Теперь переменная #events определена
    this.#destinations = destinationsModel;
    this.#offers = offersModel;
    this.#onDataChange = onDataChange;
    this.#onCloseForm = onCloseForm;
  }

  init() {
    const defaultType = EVENT_TYPES[5];
    const defaultOffers = this.#offers.find((offer) => offer.type === defaultType)?.offers || [];

    this.#eventEditFormComponent = new EventEditFormView({
      event: {
        type: defaultType,
        destination: '',
        dateFrom: '',
        dateTo: '',
        basePrice: 0,
        offers: defaultOffers,
      },
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#formSubmitHandler,
      onEditClick: this.#handleCloseFormClick,
    });

    render(this.#eventEditFormComponent, document.querySelector('.trip-events__list'), RenderPosition.AFTERBEGIN);
  }

  #formSubmitHandler = async (newEvent) => {
    try {
      //this.#eventEditFormComponent.lockForm(); // нет такого метода
      const newEventFromServer = await this.#events.addEvent(newEvent);
      this.#onDataChange(UserAction.ADD_EVENT, UpdateType.MINOR, newEventFromServer);
      this.destroy();
    } catch (error) {
      this.#eventEditFormComponent.unlockForm();
    }
  };

  #handleCloseFormClick = () => {
    this.#onCloseForm();
    remove(this.#eventEditFormComponent);
    this.#eventEditFormComponent = null;
  };

  destroy() {
    if (this.#eventEditFormComponent) {
      remove(this.#eventEditFormComponent);
      this.#eventEditFormComponent = null;
    }
  }
}
