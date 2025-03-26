import { render, replace, remove } from '../framework/render.js';
import { isEscape } from '../utils/common.js';
import { UserAction, UpdateType } from '../const.js';
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
      onFormSubmit: this.#handleFormSubmit,
      onEditClick: this.#handleCloseClick,
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

  update(updatedEvent) {
    this.#event = updatedEvent;
  }

  resetView() {
    if (this.#tripEventsListElement.contains(this.#eventEditFormComponent.element)) {
      this.#handleCloseClick();
    }
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#eventEditFormComponent);
  }

  #handleFavoriteClick = () => {
    const updatedEvent = {
      ...this.#event,
      isFavorite: !this.#event.isFavorite,
    };

    this.#event = updatedEvent;
    this.#eventComponent.updateFavoriteButton(updatedEvent.isFavorite);
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
    this.#event = { ...this.#event, ...updatedEvent };
    this.#onDataChange(UserAction.UPDATE_EVENT, UpdateType.MINOR, this.#event);
    this.#replaceFormToItem();
  };

  #handleCloseClick = () => {
    this.#replaceFormToItem();
  };

  #replaceItemToForm() {
    if (!this.#eventComponent.element.parentElement) {
      return;
    }

    this.#eventEditFormComponent = new EventEditFormView({
      event: this.#event,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onEditClick: this.#handleCloseClick,
    });

    replace(this.#eventEditFormComponent, this.#eventComponent);
    remove(this.#eventComponent);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToItem() {
    if (!this.#eventEditFormComponent || !this.#eventEditFormComponent.element.parentElement) {
      return;
    }

    const updatedEventComponent = new EventView({
      event: this.#event,
      destinations: this.#destinations,
      offers: this.#offers,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    replace(updatedEventComponent, this.#eventEditFormComponent);
    remove(this.#eventEditFormComponent);

    this.#eventComponent = updatedEventComponent;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (isEscape(evt)) {
      evt.preventDefault();
      this.#handleCloseClick();
    }
  };
}
