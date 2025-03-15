import { render, replace, remove } from '../framework/render.js';
import { isEscape } from '../utils/common.js';
import EventEditFormView from '../view/event-edit-form-view/event-edit-form-view.js';
import EventView from '../view/event-view/event-view.js';

export default class EventPresenter {
  #event = null;
  #destinations = [];
  #offers = [];
  #tripEventsListElement = null;

  #eventComponent = null;
  #eventEditFormComponent = null;

  #onDataChange = null;
  #onResetView = null;
  #onEditClick = null; // Для корректного вызова редактирования

  static #currentlyEditing = null; // Статическое поле для отслеживания открытой формы

  constructor(container) {
    this.#tripEventsListElement = container;
  }

  init(event, destinations, offers, onDataChange, onResetView) {
    if (!this.#tripEventsListElement) {
      this.#tripEventsListElement = document.querySelector('.trip-events__list');
    }

    this.#event = event;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#onDataChange = onDataChange;
    this.#onResetView = onResetView;

    // Предыдущие компоненты
    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditFormComponent;

    // Новый компонент события
    this.#eventComponent = new EventView({
      event,
      destinations,
      offers,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.handleFavoriteClick,
    });

    // Новый компонент формы редактирования события
    this.#eventEditFormComponent = new EventEditFormView({
      event,
      destinations,
      offers,
      onFormSubmit: () => this.#replaceFormToItem(),
      onEditClick: () => {
        this.#onResetView(); // Закрыть другие формы
        this.#replaceItemToForm();
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
    if (EventPresenter.#currentlyEditing) {
      EventPresenter.#currentlyEditing.resetView(); // Закрыть уже открытую форму
    }
    EventPresenter.#currentlyEditing = this; // Установить текущий презентер как редактируемый
    this.#onResetView(); // Закрыть все формы перед открытием новой
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
