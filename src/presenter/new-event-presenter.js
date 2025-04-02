import { render, remove, RenderPosition } from '../framework/render.js';
import EventEditFormView from '../view/event-edit-form-view/event-edit-form-view.js';
import { EVENT_TYPES } from '../const.js';

export default class NewEventPresenter {
  #events = null;
  #destinations = [];
  #offers = [];
  #onDataChange = null;
  #onCloseForm = null;
  #eventEditFormComponent = null;

  constructor({ eventsModel, destinationsModel, offersModel, onDataChange, onCloseForm }) {
    this.#events = eventsModel;
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
        isFavorite: false,
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
      const response = await this.#events.addEvent(newEvent);

      this.destroy();
      document.querySelector('.trip-main__event-add-btn').disabled = false;
    } catch (error) {
      this.#eventEditFormComponent.unlockForm();
      this.#eventEditFormComponent.shakeForm();
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
