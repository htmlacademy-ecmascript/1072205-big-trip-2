import { render, replace } from '../framework/render.js';
import { isEscape } from '../utils/common.js';
import EventView from '../view/event-view/event-view.js';
import EventEditFormView from '../view/event-edit-form-view/event-edit-form-view.js';


export default class EventPresenter {
   #tripEventsListElement = null;
   #destinations = [];
   #offers = [];

  renderEvent(event, destinations, offers) {
    this.#tripEventsListElement = document.querySelector('.trip-events__list');
    this.#destinations = destinations;
    this.#offers = offers;

    const eventComponent = new EventView({
      event: event,
      destinations: destinations,
      offers: offers,
      onEditClick: () => this.#replaceItemToForm(eventComponent, event)
    });

    render(eventComponent, this.#tripEventsListElement);
  }

  #replaceItemToForm(eventComponent, event) {
    const eventEditFormComponent = new EventEditFormView({
      event,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: () => this.#replaceFormToItem(eventComponent, eventEditFormComponent),
      onEditClick: () => this.#replaceFormToItem(eventComponent, eventEditFormComponent)
    });

    replace(eventEditFormComponent, eventComponent);
    document.addEventListener('keydown', (evt) => this.#escKeyDownHandler(evt, eventComponent, eventEditFormComponent));
  }

  #replaceFormToItem(eventComponent, eventEditFormComponent) {
    replace(eventComponent, eventEditFormComponent);
    document.removeEventListener('keydown', (evt) => this.#escKeyDownHandler(evt, eventComponent, eventEditFormComponent));
  }

  #escKeyDownHandler(evt, eventComponent, eventEditFormComponent) {
    if (isEscape(evt)) {
      evt.preventDefault();
      this.#replaceFormToItem(eventComponent, eventEditFormComponent);
    }
  }
}
