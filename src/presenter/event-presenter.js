import { render, replace, remove } from '../framework/render.js';
import { isEscape } from '../utils/common.js';
import EventEditFormView from '../view/event-edit-form-view/event-edit-form-view.js';
import EventView from '../view/event-view/event-view.js';
import { UserAction, UpdateType } from '../const.js';

export default class EventPresenter {
  #event = null;
  #destinations = [];
  #offers = [];
  #tripEventsListElement = null;

  #eventComponent = null;
  #eventEditFormComponent = null;

  #onDataChange = null;
  #onResetView = null;

  static #currentlyEditing = null;

  constructor(container) {
    this.#tripEventsListElement = container;
  }

  init(event, destinationsModel, offersModel, onDataChange, onResetView) {
    if (!this.#tripEventsListElement) {
      this.#tripEventsListElement = document.querySelector('.trip-events__list');
    }

    this.#event = event;
    this.#destinations = destinationsModel;
    this.#offers = offersModel;
    this.#onDataChange = onDataChange;
    this.#onResetView = onResetView;

    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditFormComponent;

    this.#eventComponent = new EventView({
      event: this.#event,
      destinations: this.#destinations,
      offers: this.#offers,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#eventEditFormComponent = new EventEditFormView({
      event,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit, // Сохранение данных при отправке
      onEditClick: this.#handleCloseClick, // Закрытие формы без сохранения
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

 update(updatedEvent) {
    this.#event = updatedEvent;
    this.#eventComponent.updateFavoriteButton(updatedEvent.isFavorite);
  }

  resetView() {
    if (this.#tripEventsListElement.contains(this.#eventEditFormComponent.element)) {
      this.#handleCloseClick();
    }
  }

  #handleFavoriteClick = () => {
    const updatedEvent = {
      ...this.#event,
      isFavorite: !this.#event.isFavorite
    };

    // Обновляем данные
    this.#onDataChange(UserAction.UPDATE_EVENT, UpdateType.PATCH, updatedEvent);

    // После обновления данных перерисовываем только компонент
    this.update(updatedEvent);
  };

  #handleEditClick = () => {
    if (EventPresenter.#currentlyEditing) {
      EventPresenter.#currentlyEditing.resetView();
    }
    EventPresenter.#currentlyEditing = this;
    this.#onResetView();
    this.#replaceItemToForm();
  };

  #handleFormSubmit = (updatedEvent) => {
    // Отправляем данные в модель, только если они действительно изменились
    const newEvent = { ...this.#event, ...updatedEvent };

    if (JSON.stringify(this.#event) !== JSON.stringify(newEvent)) {
      this.#onDataChange(UserAction.UPDATE_EVENT, UpdateType.MINOR, newEvent);
      this.#event = newEvent;  // Обновляем локальное состояние
    }

    this.#replaceFormToItem();  // Закрываем форму и возвращаем к обычному виду
  };

  #handleCloseClick = () => {
    this.#replaceFormToItem(); // Просто закрывает форму без сохранения
  };

  #replaceItemToForm() {
    replace(this.#eventEditFormComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToItem() {
    replace(this.#eventComponent, this.#eventEditFormComponent);  // Заменяем форму на обычный элемент
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (isEscape(evt)) {
      evt.preventDefault();
      this.#handleCloseClick(); // Закрытие без сохранения при ESC
    }
  };
}
