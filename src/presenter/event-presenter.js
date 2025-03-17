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
    this.#onResetView = onResetView; // Сохраняем ссылку на метод сброса вида

    // Сохраняем предыдущие компоненты
    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditFormComponent;

    // Создаем новый компонент события
    this.#eventComponent = new EventView({
      event,
      destinations,
      offers,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    // Создаем новый компонент формы редактирования события
    this.#eventEditFormComponent = new EventEditFormView({
      event,
      destinations,
      offers,
      onFormSubmit: () => this.#replaceFormToItem(),
      onEditClick: () => {
        this.#replaceFormToItem(); // Закрываем форму редактирования
      },
    });

    // Если компоненты уже были отрисованы, заменяем их
    if (prevEventComponent && prevEventEditComponent) {
      replace(this.#eventComponent, prevEventComponent);
      replace(this.#eventEditFormComponent, prevEventEditComponent);
      remove(prevEventComponent);
      remove(prevEventEditComponent);
      return;
    }

    // Отрисовываем компонент события в списке
    render(this.#eventComponent, this.#tripEventsListElement);
  }

  // Удаление компонентов события
  destroy() {
    remove(this.#eventComponent);
    remove(this.#eventEditFormComponent);
  }

  // Обработчик клика по избранному
  #handleFavoriteClick = (isFavorite) => {
    const updatedEvent = { ...this.#event, isFavorite };
    this.#onDataChange(updatedEvent);
  };

  // Обновление события
  update(updatedEvent) {
    this.#event = updatedEvent;
    this.#eventComponent.updateFavoriteButton(updatedEvent.isFavorite);
  }

  // Сброс вида (возврат к обычному представлению события)
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

  // Заменяет представление события на форму редактирования
  #replaceItemToForm() {
    replace(this.#eventEditFormComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }


  // Заменяет форму редактирования на представление события
  #replaceFormToItem() {
    replace(this.#eventComponent, this.#eventEditFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  // Обработчик нажатия клавиши Escape
  #escKeyDownHandler = (evt) => {
    if (isEscape(evt)) {
      evt.preventDefault();
      this.#replaceFormToItem();
    }
  };
}
