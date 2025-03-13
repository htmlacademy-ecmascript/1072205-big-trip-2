import { render, replace, remove } from '../framework/render.js';
import { isEscape } from '../utils/common.js';
import EventEditFormView from '../view/event-edit-form-view/event-edit-form-view.js';
import EventView from '../view/event-view/event-view.js';

export default class EventPresenter {
  #tripEventsListElement = null;
  #event = null;
  #destinations = [];
  #offers = [];

  #eventComponent = null;
  #eventEditFormComponent = null;

  #onDataChange = null;
  #onResetView = null;
  #handleFavoriteClick = null;

  constructor(container) {
    this.#tripEventsListElement = container;
  }

  init(event, destinations, offers, onDataChange, onResetView) {
    if (!this.#tripEventsListElement) {
      this.#tripEventsListElement = document.querySelector('.trip-events__list');
    }

    this.#destinations = destinations;
    this.#offers = offers;
    this.#onDataChange = onDataChange;
    this.#onResetView = onResetView; // Сохраняем ссылку на метод сброса вида
    this.#event = event;

    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditFormComponent;

    this.#eventComponent = new EventView({
      event,
      destinations,
      offers,
      onEditClick: this.#handleEditClick, // Теперь вызываем метод-обработчик
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#eventEditFormComponent = new EventEditFormView({
      event,
      destinations,
      offers,
      onFormSubmit: () => this.#replaceFormToItem(),
      onEditClick: () => {
        this.#onResetView(); // Закрываем все открытые формы перед открытием новой
        this.#replaceItemToForm();
        this.#replaceFormToItem();
      },
    });

    if (prevEventComponent && prevEventEditComponent) {
      replace(this.#eventComponent, prevEventComponent);
      replace(this.#eventEditFormComponent, prevEventEditComponent);
      remove(prevEventComponent);
      remove(prevEventEditComponent);
      return;
    }

    render(this.#eventComponent, this.#tripEventsListElement);
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#eventEditFormComponent);
  }

  handleFavoriteClick = () => {
    const updatedEvent = { ...this.#event, isFavorite: !this.#event.isFavorite };
    this.#onDataChange(updatedEvent);
    this.#eventComponent.updateFavoriteButton(updatedEvent.isFavorite);
  };

  update(updatedEvent) {
    this.#event = updatedEvent;
    this.#eventComponent.updateFavoriteButton(updatedEvent.isFavorite);
  }

  resetView() {
    if (this.#tripEventsListElement.contains(this.#eventEditFormComponent.element)) {
      this.#replaceFormToItem();
    }
  }

  #handleEditClick = () => {
    this.#onResetView();
    this.#replaceItemToForm();
  };

  #replaceItemToForm() {
    replace(this.#eventEditFormComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToItem() {
    replace(this.#eventComponent, this.#eventEditFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (isEscape(evt)) {
      evt.preventDefault();
      this.#replaceFormToItem();
    }
  };
}
